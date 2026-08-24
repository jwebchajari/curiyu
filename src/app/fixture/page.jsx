// src/app/fixture/page.jsx
import { adminDb } from "@/lib/firebase/admin";
import PublicFixture from "@/components/fixture/PublicFixture";

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
    },
};

export const dynamic = 'force-dynamic';

export default async function FixturePage() {
    let matches = [];
    try {
        const snapshot = await adminDb
            .collection("matches")
            .orderBy("date", "asc")
            .get();

        matches = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: data.date?.toDate?.() ? data.date.toDate().toISOString() : data.date,
                // Convertir Timestamps a string para evitar errores de serialización
                updatedAt: data.updatedAt?.toDate?.()
                    ? data.updatedAt.toDate().toISOString()
                    : null,
            };
        });
    } catch (error) {
        console.error("Error cargando partidos:", error);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
            <h1 className="font-display text-4xl md:text-6xl text-verde mb-6 md:mb-8">
                Fixture
            </h1>
            <PublicFixture matches={matches} />
        </div>
    );
}