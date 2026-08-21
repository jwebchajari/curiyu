import { getAllNews } from "@/lib/firebase/news";
import NewsGrid from "@/components/news/NewsGrid";

export const metadata = {
    title: "Noticias",
    description:
        "Últimas noticias y novedades del Club Curiyú: resultados, eventos y actividad institucional.",
};

export default async function NoticiasPage() {
    const news = await getAllNews();

    return (
        <div className="container-club py-16">
            <h1 className="font-display text-5xl md:text-6xl text-verde mb-8">Noticias</h1>
            <NewsGrid news={news} />
        </div>
    );
}