/**
 * Ruta: src/app/noticias/page.jsx
 * Resumen: Listado público de noticias del club.
 * Lógica: Trae todas las noticias, formatea fechas a es-AR, y las pasa a
 *         NewsGrid. Usa PageHeader con el slot `action` para el subtítulo
 *         que antes iba en un flex aparte.
 * Debería: Mantenerse razonablemente actualizada sin pegarle a Firestore en
 *         cada request — por eso usa ISR (`revalidate`) en vez de estático
 *         puro o `force-dynamic`.
 */
import { getAllNews } from "@/lib/firebase/news";
import NewsGrid from "@/components/news/NewsGrid";
import PageHeader from "@/components/layout/PageHeader";

// ISR: revalida cada 5 min. Las noticias no cambian segundo a segundo como
// el fixture, así que no hace falta `force-dynamic` acá — esto permite que
// Next sirva la página cacheada y la refresque en background (mejor Core
// Web Vitals que recalcular todo en cada visita).
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
            <PageHeader
                eyebrow="Club Curiyú"
                title="Noticias"
                action={<p>Mantenete al día con la vida del club</p>}
            />
            <NewsGrid news={news} />
        </div>
    );
}