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
            className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-shadow"
        >
            {news.coverImageUrl && (
                <div className="relative h-48 w-full">
                    <Image
                        src={news.coverImageUrl}
                        alt={news.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
            )}
            <div className="p-6">
                <h2 className="text-xl font-bold text-oscuro mb-2 line-clamp-2">{news.title}</h2>
                <p className="text-sm text-oscuro/60 mb-3 line-clamp-3">{news.excerpt}</p>
                <div className="flex justify-between items-center text-xs text-oscuro/40">
                    <span>{formatDate(news.publishedAt)}</span>
                    <span className="text-verde font-medium">Leer más →</span>
                </div>
            </div>
        </Link>
    );
}