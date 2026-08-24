// src/app/noticias/[slug]/page.jsx
import { getNewsBySlug } from "@/lib/firebase/news";
import Image from "next/image";
import Link from "next/link";
import ShareButton from "@/components/news/ShareButton";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const news = await getNewsBySlug(slug);

    if (!news) {
        return {
            title: "Noticia no encontrada",
            description: "La noticia que buscás no existe.",
        };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const newsUrl = `${siteUrl}/noticias/${slug}`;
    const publishedTime = news.publishedAt?.toDate?.()?.toISOString() || news.publishedAt;

    return {
        title: news.title,
        description: news.excerpt,
        alternates: { canonical: newsUrl },
        openGraph: {
            title: news.title,
            description: news.excerpt,
            type: 'article',
            publishedTime: publishedTime,
            url: newsUrl,
            siteName: "Club Curiyú",
            images: news.coverImageUrl
                ? [{ url: news.coverImageUrl, alt: news.title }]
                : [{ url: `${siteUrl}/escudoi.png`, alt: "Escudo del Club Curiyú" }],
        },
        twitter: {
            card: 'summary_large_image',
            title: news.title,
            description: news.excerpt,
            images: news.coverImageUrl
                ? [news.coverImageUrl]
                : [`${siteUrl}/escudoi.png`],
        },
    };
}

export default async function NoticiaDetallePage({ params }) {
    const { slug } = await params;
    const news = await getNewsBySlug(slug);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const newsUrl = `${siteUrl}/noticias/${slug}`;

    if (!news) {
        return (
            <div className="px-4 py-16 text-center">
                <h1 className="font-display text-4xl text-verde mb-4">Noticia no encontrada</h1>
                <Link href="/noticias" className="text-verde hover:underline">← Volver a Noticias</Link>
            </div>
        );
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return "";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
    };

    return (
        <article className="max-w-3xl mx-auto px-4 py-10 md:py-16">
            <Link
                href="/noticias"
                className="inline-flex items-center gap-1 text-verde hover:underline text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-verde rounded"
            >
                ← Volver a Noticias
            </Link>

            {/* Título y Botón de Compartir (Se apilan en móvil) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <h1 className="font-display text-3xl md:text-5xl text-verde leading-tight">{news.title}</h1>
                <div className="w-full md:w-auto">
                    <ShareButton title={news.title} url={newsUrl} />
                </div>
            </div>

            <p className="text-sm text-oscuro/50 mb-6">{formatDate(news.publishedAt)}</p>

            {/* Imagen: Altura adaptable a móvil */}
            {news.coverImageUrl && (
                <div className="relative h-52 md:h-96 w-full rounded-xl overflow-hidden mb-8 shadow-lg">
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

            {/* Contenido HTML dinámico optimizado para móvil */}
            <div className="prose prose-sm sm:prose-lg max-w-none text-oscuro/80">
                {news.content ? (
                    <div
                        className="[&_img]:w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_p]:leading-relaxed [&_p]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_ul]:list-disc [&_ul]:pl-5"
                        dangerouslySetInnerHTML={{ __html: news.content }}
                    />
                ) : (
                    <p className="leading-relaxed">{news.excerpt}</p>
                )}
            </div>
        </article>
    );
}