// src/app/noticias/page.jsx
import { getAllNews } from "@/lib/firebase/news";
import NewsGrid from "@/components/news/NewsGrid";

export const metadata = {
    title: "Noticias",
    description:
        "Últimas noticias y novedades del Club Curiyú: resultados, eventos y actividad institucional.",
};

export default async function NoticiasPage() {
    // Obtenemos las noticias
    const rawNews = await getAllNews();

    // 🛠️ CORRECCIÓN: Serializamos los datos para que el cliente pueda leerlos sin errores
    const news = rawNews.map((item) => ({
        ...item,
        publishedAt: item.publishedAt?.toDate?.()
            ? item.publishedAt.toDate().toLocaleDateString("es-ES")
            : (item.publishedAt || "Sin fecha"),
        updatedAt: item.updatedAt?.toDate?.()
            ? item.updatedAt.toDate().toLocaleDateString("es-ES")
            : (item.updatedAt || "Sin fecha"),
    }));

    return (
        <div className="container-club py-16">
            <h1 className="font-display text-5xl md:text-6xl text-verde mb-8">Noticias</h1>
            <NewsGrid news={news} />
        </div>
    );
}