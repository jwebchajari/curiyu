import { getNewsBySlug } from "@/lib/firebase/news";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata({ params }) {
    const news = await getNewsBySlug(params.slug);
    if (!news) {
        return {
            title: "Noticia no encontrada",
            description: "La noticia que buscás no existe.",
        };
    }
    return {
        title: news.title,
        description: news.excerpt,
        openGraph: {
            title: news.title,
            description: news.excerpt,
            images: news.coverImageUrl ? [{ url: news.coverImageUrl }] : [],
        },
    };
}

export default async function NoticiaDetallePage({ params }) {
    const news = await getNewsBySlug(params.slug);

    if (!news) {
        return (
            <div className="container-club py-16 text-center">
                <h1 className="font-display text-4xl text-verde mb-4">Noticia no encontrada</h1>
                <Link href="/noticias" className="text-verde hover:underline">
                    ← Volver a Noticias
                </Link>
            </div>
        );
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return "";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
    };

    return (
        <article className="container-club py-16 max-w-3xl mx-auto">
            <Link href="/noticias" className="text-verde hover:underline text-sm mb-4 inline-block">
                ← Volver a Noticias
            </Link>
            <h1 className="font-display text-4xl md:text-5xl text-verde mb-4">{news.title}</h1>
            <p className="text-sm text-oscuro/50 mb-6">{formatDate(news.publishedAt)}</p>

            {news.coverImageUrl && (
                <div className="relative h-64 md:h-96 w-full rounded-xl overflow-hidden mb-8">
                    <Image
                        src={news.coverImageUrl}
                        alt={news.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 800px"
                        priority
                    />
                </div>
            )}

            <div className="prose max-w-none text-oscuro/80">
                {news.content ? (
                    <div dangerouslySetInnerHTML={{ __html: news.content }} />
                ) : (
                    <p>{news.excerpt}</p>
                )}
            </div>
        </article>
    );
}