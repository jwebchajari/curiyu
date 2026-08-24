/**
 * Ruta: src/app/admin/fixture/page.jsx
 * Resumen: Página de gestión de fixture en admin.
 * Lógica: Obtiene todos los partidos desde Firestore ordenados por fecha descendente.
 *         No usa filtros por sport ni where compuestos para evitar necesidad de índice.
 *         Luego, si se desea, se puede filtrar en memoria.
 * Debería: Mostrar todos los partidos y permitir CRUD desde FixtureManager.
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
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-oscuro mb-6 sm:mb-8">
        Gestión de Fixture
      </h1>
      <FixtureManager matches={matches} />
    </div>
  );
}