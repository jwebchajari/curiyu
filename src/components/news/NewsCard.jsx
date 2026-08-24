// src/components/news/NewsCard.jsx
import Link from "next/link";
import Image from "next/image";

export default function NewsCard({ news }) {
    const formatDate = (timestamp) => {
        if (!timestamp) return "";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
    };

    return (
        <Link
            href={`/noticias/${news.slug}`}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 block focus:outline-none focus:ring-2 focus:ring-verde"
        >
            {news.coverImageUrl && (
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <Image
                        src={news.coverImageUrl}
                        alt={news.title || "Noticia"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
            )}
            <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-oscuro mb-2 line-clamp-2 group-hover:text-verde transition-colors">
                    {news.title || "Sin título"}
                </h2>
                {news.excerpt && (
                    <p className="text-sm text-oscuro/60 mb-3 line-clamp-3">
                        {news.excerpt}
                    </p>
                )}
                <div className="flex justify-between items-center text-xs text-oscuro/40 pt-3 border-t border-gray-100">
                    <span>{formatDate(news.publishedAt)}</span>
                    <span className="text-verde font-medium">Leer más →</span>
                </div>
            </div>
        </Link>
    );
}