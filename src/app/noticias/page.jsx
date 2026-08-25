/**
 * Ruta: src/app/noticias/page.jsx
 * Resumen: Listado público de noticias con fondo blanco y manejo de estado vacío.
 * Estilo: Fondo blanco, sin gradientes.
 */
import { getAllNews } from "@/lib/firebase/news";
import NewsGrid from "@/components/news/NewsGrid";
import PageHeader from "@/components/layout/PageHeader";

export const revalidate = 300;

export const metadata = {
    title: "Noticias | Club Curiyú",
    description:
        "Últimas noticias y novedades del Club Curiyú: resultados, eventos y actividad institucional.",
    openGraph: {
        title: "Noticias | Club Curiyú",
        description:
            "Últimas noticias y novedades del Club Curiyú: resultados, eventos y actividad institucional.",
        type: "website",
        url: "/noticias",
    },
    twitter: {
        card: "summary_large_image",
        title: "Noticias | Club Curiyú",
        description:
            "Últimas noticias y novedades del Club Curiyú: resultados, eventos y actividad institucional.",
    },
};

export default async function NoticiasPage() {
    const rawNews = await getAllNews();

    // Depuración: muestra en consola del servidor cuántas noticias se obtuvieron
    console.log(`[NoticiasPage] ${rawNews.length} noticias obtenidas`);

    const news = rawNews.map((item) => ({
        ...item,
        publishedAt: item.publishedAt?.toDate?.()
            ? item.publishedAt.toDate().toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })
            : (item.publishedAt || "Sin fecha"),
        updatedAt: item.updatedAt?.toDate?.()
            ? item.updatedAt.toDate().toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })
            : (item.updatedAt || "Sin fecha"),
    }));

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
                <PageHeader
                    eyebrow="Club Curiyú"
                    title="Noticias"
                    action={<p className="text-white/80">Mantenete al día con la vida del club</p>}
                />

                {news.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
                        <p className="text-xl text-gray-600">📭 No hay noticias publicadas aún.</p>
                        <p className="text-sm text-gray-400 mt-2">Pronto compartiremos novedades.</p>
                    </div>
                ) : (
                    <NewsGrid news={news} />
                )}
            </div>
        </div>
    );
}