/**
 * Ruta: src/app/fixture/page.jsx
 * Resumen: Página pública de fixture con solapas por deporte.
 * Lógica: Lee el query param `deporte` (default 'rugby') y consulta Firestore
 *         con dos queries limitadas: últimos 2 jugados (< ahora) y próximos 3 (>= ahora).
 *         Usa `force-dynamic` porque los resultados cambian seguido.
 *         Serializa Timestamps y expone todos los campos del partido para que
 *         los componentes hijos puedan mostrar categoría, resultado, etc.
 * Debería: Mostrar la categoría activa con sus partidos recientes y próximos,
 *          sin cargar todo el historial.
 */
import { adminDb } from "@/lib/firebase/admin";
import PublicFixture from "@/components/fixture/PublicFixture";
import PageHeader from "@/components/layout/PageHeader";

export const metadata = {
  title: "Fixture | Club Curiyú",
  description:
    "Próximos partidos y resultados de Rugby y Hockey del Club Curiyú de Chajarí, Entre Ríos.",
  openGraph: {
    title: "Fixture | Club Curiyú",
    description:
      "Próximos partidos y resultados de Rugby y Hockey del Club Curiyú de Chajarí, Entre Ríos.",
    type: "website",
    url: "/fixture",
    images: [
      {
        url: "/images/og-image.jpg", // Asegúrate de tener esta imagen en public/images/
        width: 1200,
        height: 630,
        alt: "Fixture Club Curiyú",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fixture | Club Curiyú",
    description:
      "Próximos partidos y resultados de Rugby y Hockey del Club Curiyú.",
    images: ["/images/og-image.jpg"],
  },
};

export const dynamic = "force-dynamic";

// Función auxiliar para serializar Timestamps de Firestore
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

export default async function FixturePage({ searchParams }) {
  const sportParam = searchParams?.deporte;
  const sport = sportParam === "hockey" ? "hockey" : "rugby"; // default rugby
  const now = new Date();

  let played = [];
  let upcoming = [];

  try {
    // Ejecutamos ambas consultas en paralelo con .get()
    const [playedSnap, upcomingSnap] = await Promise.all([
      adminDb
        .collection("matches")
        .where("sport", "==", sport)
        .where("date", "<", now)
        .orderBy("date", "desc")
        .limit(2)
        .get(),
      adminDb
        .collection("matches")
        .where("sport", "==", sport)
        .where("date", ">=", now)
        .orderBy("date", "asc")
        .limit(3)
        .get(),
    ]);

    played = playedSnap.docs.map(serializeMatch);
    upcoming = upcomingSnap.docs.map(serializeMatch);
  } catch (error) {
    console.error("Error cargando partidos:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
      <PageHeader eyebrow="Rugby y Hockey" title="Fixture" />
      <PublicFixture sport={sport} played={played} upcoming={upcoming} />
    </div>
  );
}