/**
 * Ruta: src/app/admin/fixture/page.jsx
 */
import { adminDb } from "@/lib/firebase/admin";
import FixtureManager from "@/components/admin/FixtureManager";

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

export default async function AdminFixturePage() {
  let matches = [];

  try {
    const snapshot = await adminDb
      .collection("matches")
      .orderBy("date", "desc")
      .get();

    matches = snapshot.docs.map(serializeMatch);
  } catch (error) {
    console.error("Error cargando partidos:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
          Gestión de Fixture
        </h1>
        <a
          href="/admin/fixture/nuevo"
          className="bg-verde text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-verde-oscuro transition shadow-sm hover:shadow-md text-center"
        >
          + Nuevo Partido
        </a>
      </div>
      <FixtureManager matches={matches} />
    </div>
  );
}