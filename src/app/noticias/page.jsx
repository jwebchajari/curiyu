// src/app/noticias/page.jsx
import { getAllNews } from "@/lib/firebase/news";
import NewsGrid from "@/components/news/NewsGrid";

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
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
                <h1 className="font-display text-4xl md:text-6xl text-verde">Noticias</h1>
                <p className="text-sm text-gray-500">Mantenete al día con la vida del club</p>
            </div>
            <NewsGrid news={news} />
        </div>
    );
}