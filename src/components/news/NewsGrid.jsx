import NewsCard from "./NewsCard";

export default function NewsGrid({ news }) {
    if (!news || news.length === 0) {
        return (
            <div className="text-center py-12 text-oscuro/60">
                No hay noticias publicadas todavía.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
                <NewsCard key={item.id} news={item} />
            ))}
        </div>
    );
}