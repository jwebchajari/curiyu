/**
 * Ruta: src/app/fixture/page.jsx
 * Resumen: Página pública de fixture con solapas por deporte y listado de próximos y resultados.
 * Estilo: Fondo blanco.
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

// Metadatos dinámicos (corregido: searchParams es una Promise)
export async function generateMetadata({ searchParams }) {
  // ✅ Resolver la promesa
  const params = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clubcuriyu.com";
  const sport = params?.deporte === "hockey" ? "hockey" : "rugby";
  const matchId = params?.match;

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
    const description = `Partido de ${sportLabel} en el Club Curiyú. ${match.finished ? `Resultado: ${match.homeScore} - ${match.awayScore}` : "Próximo partido"
      }`;
    const imageUrl =
      match.imageUrl && match.imageUrl !== "" ? match.imageUrl : `${baseUrl}/logo2.png`;

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

// Página principal (corregido: searchParams es una Promise)
export default async function FixturePage({ searchParams }) {
  // ✅ Resolver la promesa
  const params = await searchParams;
  const sportParam = params?.deporte;
  const sport = sportParam === "hockey" ? "hockey" : "rugby";
  const now = new Date();

  let allMatches = [];

  try {
    const snapshot = await adminDb
      .collection("matches")
      .orderBy("date", "desc")
      .get();

    allMatches = snapshot.docs.map(serializeMatch);
  } catch (error) {
    console.error("Error cargando partidos:", error);
  }

  const matchesBySport = allMatches.filter((m) => m.sport === sport);

  const upcoming = matchesBySport
    .filter((m) => !m.finished)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const finished = matchesBySport
    .filter((m) => m.finished)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <PageHeader eyebrow="Rugby y Hockey" title="Fixture" />
        <PublicFixture
          sport={sport}
          upcoming={upcoming}
          finished={finished}
        />
      </div>
    </div>
  );
}