// src/app/noticias/[slug]/page.jsx
import { getNewsBySlug } from "@/lib/firebase/news";
import Image from "next/image";
import Link from "next/link";
import ShareButton from "@/components/news/ShareButton";
export const dynamic = 'force-dynamic';
// 🔥 Metadatos completos para SEO y Redes Sociales
export async function generateMetadata({ params }) {
    // 🔥 CORRECCIÓN IMPORTANTE: Desenvolver la Promesa de params con await
    const { slug } = await params;

    const news = await getNewsBySlug(slug);
    if (!news) {
        return {
            title: "Noticia no encontrada",
            description: "La noticia que buscás no existe.",
        };
    }

    // URL absoluta para compartir (configura NEXT_PUBLIC_SITE_URL en tu .env para producción)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const newsUrl = `${siteUrl}/noticias/${slug}`;

    // Formatear fecha para el metadata
    const publishedTime = news.publishedAt?.toDate?.()?.toISOString() || news.publishedAt;

    return {
        title: news.title,
        description: news.excerpt,
        alternates: {
            canonical: newsUrl, // URL canónica para SEO
        },
        openGraph: {
            title: news.title,
            description: news.excerpt,
            type: 'article', // Tipo artículo para Facebook/LinkedIn
            publishedTime: publishedTime,
            url: newsUrl,
            images: news.coverImageUrl ? [{ url: news.coverImageUrl }] : [],
        },
        twitter: {
            card: 'summary_large_image', // Tarjeta grande con imagen para Twitter/X
            title: news.title,
            description: news.excerpt,
            images: news.coverImageUrl ? [news.coverImageUrl] : [],
        },
    };
}

export default async function NoticiaDetallePage({ params }) {
    // 🔥 CORRECCIÓN IMPORTANTE: Desenvolver la Promesa de params con await
    const { slug } = await params;

    const news = await getNewsBySlug(slug);

    // URL absoluta para el botón de compartir
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const newsUrl = `${siteUrl}/noticias/${slug}`;

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

            {/* Título y Botón de Compartir */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <h1 className="font-display text-4xl md:text-5xl text-verde">{news.title}</h1>
                <ShareButton title={news.title} url={newsUrl} />
            </div>

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