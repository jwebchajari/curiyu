// src/app/admin/fixture/page.jsx
import { adminDb } from "@/lib/firebase/admin";
import FixtureManager from "@/components/admin/FixtureManager";

export const dynamic = 'force-dynamic';

export default async function AdminFixturePage() {
    let matches = [];
    try {
        const snapshot = await adminDb.collection("matches").orderBy("date", "desc").get();

        matches = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: data.date?.toDate?.() ? data.date.toDate().toISOString() : data.date,
                updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : null,
            };
        });

    } catch (e) {
        console.error(e);
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-oscuro mb-6">Gestión de Fixture</h1>
            <FixtureManager matches={matches} />
        </div>
    );
}