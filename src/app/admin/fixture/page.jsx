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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-oscuro mb-6 sm:mb-8">
                Gestión de Fixture
            </h1>
            <FixtureManager matches={matches} />
        </div>
    );
}