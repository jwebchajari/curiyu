/**
 * Ruta: src/app/fixture/page.jsx
 * Resumen: Página pública de fixture con solapas por deporte y metadatos dinámicos para compartir partido.
 * Lógica: Lee `deporte` de query params. Si llega `match`, consulta ese partido para generar
 *         og:image y título personalizado en el link compartido.
 *         Usa `force-dynamic` y serializa Timestamps. Fondo decorativo.
 * Debería: Mostrar la categoría activa con partidos recientes y próximos, y al compartir un
 *          partido específico, el preview muestra su imagen y datos.
 */
import { adminDb } from "@/lib/firebase/admin";
import PublicFixture from "@/components/fixture/PublicFixture";
import PageHeader from "@/components/layout/PageHeader";

export const dynamic = "force-dynamic";

function serializeMatch(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    date: data.date?.toDate?.() ? data.date.toDate().toISOString() : data.date,
    updatedAt: data.updatedAt?.toDate?.()
      ? data.updatedAt.toDate().toISOString()
      : null,
  };
}

// Genera metadatos dinámicos para compartir partido específico
export async function generateMetadata({ searchParams }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clubcuriyu.com";
  const sport = searchParams?.deporte === "hockey" ? "hockey" : "rugby";
  const matchId = searchParams?.match;

  // Metadata por defecto
  const defaultMetadata = {
    title: "Fixture | Club Curiyú",
    description:
      "Próximos partidos y resultados de Rugby y Hockey del Club Curiyú de Chajarí, Entre Ríos.",
    openGraph: {
      title: "Fixture | Club Curiyú",
      description:
        "Próximos partidos y resultados de Rugby y Hockey del Club Curiyú de Chajarí, Entre Ríos.",
      type: "website",
      url: `${baseUrl}/fixture?deporte=${sport}`,
      images: [{ url: `${baseUrl}/logo2.png`, width: 1200, height: 630, alt: "Club Curiyú" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Fixture | Club Curiyú",
      description: "Próximos partidos y resultados de Rugby y Hockey del Club Curiyú.",
      images: [`${baseUrl}/logo2.png`],
    },
  };

  if (!matchId) return defaultMetadata;

  try {
    const docSnap = await adminDb.collection("matches").doc(matchId).get();
    if (!docSnap.exists) return defaultMetadata;

    const match = serializeMatch(docSnap);
    const sportLabel = match.sport === "hockey" ? "Hockey" : "Rugby";
    const title = `${match.homeTeam} vs ${match.awayTeam} | ${sportLabel} | Club Curiyú`;
    const description = `Partido de ${sportLabel} en el Club Curiyú. ${
      match.finished ? `Resultado: ${match.homeScore} - ${match.awayScore}` : "Próximo partido"
    }`;
    const imageUrl = match.imageUrl && match.imageUrl !== "" ? match.imageUrl : `${baseUrl}/logo2.png`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        url: `${baseUrl}/fixture?deporte=${match.sport}&match=${match.id}`,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error generando metadata del partido:", error);
    return defaultMetadata;
  }
}

export default async function FixturePage({ searchParams }) {
  const sportParam = searchParams?.deporte;
  const sport = sportParam === "hockey" ? "hockey" : "rugby";
  const now = new Date();

  let played = [];
  let upcoming = [];

  try {
    // SOLUCIÓN TEMPORAL: sin filtro por sport por falta de índice compuesto
    const [playedSnap, upcomingSnap] = await Promise.all([
      adminDb
        .collection("matches")
        .where("date", "<", now)
        .orderBy("date", "desc")
        .limit(20)
        .get(),
      adminDb
        .collection("matches")
        .where("date", ">=", now)
        .orderBy("date", "asc")
        .limit(20)
        .get(),
    ]);

    played = playedSnap.docs
      .map(serializeMatch)
      .filter((m) => m.sport === sport)
      .slice(0, 2);

    upcoming = upcomingSnap.docs
      .map(serializeMatch)
      .filter((m) => m.sport === sport)
      .slice(0, 3);
  } catch (error) {
    console.error("Error cargando partidos:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <PageHeader eyebrow="Rugby y Hockey" title="Fixture" />
        <PublicFixture sport={sport} played={played} upcoming={upcoming} />
      </div>
    </div>
  );
}