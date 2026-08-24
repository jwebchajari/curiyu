/**
 * Ruta: src/app/noticias/[slug]/page.jsx
 * Resumen: Página de detalle de una noticia, con contenido HTML enriquecido.
 * Lógica: Obtiene la noticia por slug desde Firestore. Genera metadatos dinámicos
 *         para SEO, incluyendo Open Graph y Twitter Cards con imagen optimizada.
 *         Renderiza el HTML generado por el editor Tiptap de forma segura y con
 *         estilos adaptados a móvil. Incluye botón de compartir.
 *         En la visualización se usa la URL original de la imagen para evitar
 *         problemas de optimización que impidan la carga.
 * Debería: Mostrar la noticia completa con formato (negritas, listas, imágenes)
 *          y permitir compartirla en redes sociales con preview correcto.
 */
import { getNewsBySlug } from "@/lib/firebase/news";
import Image from "next/image";
import Link from "next/link";
import ShareButton from "@/components/news/ShareButton";

export const dynamic = 'force-dynamic';

const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
};

function buildShareImageUrl(imageUrl, siteUrl) {
    if (!imageUrl) return `${siteUrl}/escudoi.png`;
    if (imageUrl.includes("res.cloudinary.com")) {
        if (imageUrl.includes("q_auto") || imageUrl.includes("f_auto")) return imageUrl;
        const parts = imageUrl.split("/image/upload/");
        if (parts.length === 2) {
            const publicId = parts[1].replace(/^v\d+\//, "");
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            if (cloudName) {
                return `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto,c_scale,w_1200/${publicId}`;
            }
        }
    }
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${siteUrl}${imageUrl}`;
}

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
    const shareImage = buildShareImageUrl(news.coverImageUrl, siteUrl);

    return {
        title: news.title,
        description: news.excerpt || "Noticia del Club Curiyú",
        alternates: { canonical: newsUrl },
        openGraph: {
            title: news.title,
            description: news.excerpt,
            type: 'article',
            publishedTime: publishedTime,
            url: newsUrl,
            siteName: "Club Curiyú",
            images: [{ url: shareImage, width: 1200, height: 630, alt: news.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: news.title,
            description: news.excerpt,
            images: [shareImage],
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

    const formattedDate = formatDate(news.publishedAt);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: news.title,
        description: news.excerpt,
        image: buildShareImageUrl(news.coverImageUrl, siteUrl),
        datePublished: news.publishedAt?.toDate?.()?.toISOString() || news.publishedAt,
        dateModified: news.updatedAt?.toDate?.()?.toISOString() || news.updatedAt,
        author: {
            "@type": "Organization",
            name: "Club Curiyú",
        },
        publisher: {
            "@type": "Organization",
            name: "Club Curiyú",
            logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/escudoi.png`,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": newsUrl,
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <article className="max-w-3xl mx-auto px-4 py-10 md:py-16">
                <Link
                    href="/noticias"
                    className="inline-flex items-center gap-1 text-verde hover:underline text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-verde rounded"
                >
                    ← Volver a Noticias
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <h1 className="font-display text-3xl md:text-5xl text-verde leading-tight">
                        {news.title}
                    </h1>
                    <div className="w-full md:w-auto">
                        <ShareButton title={news.title} url={newsUrl} />
                    </div>
                </div>

                <p className="text-sm text-oscuro/50 mb-6">{formattedDate}</p>

                {news.coverImageUrl && (
                    <div className="relative h-52 md:h-96 w-full rounded-xl overflow-hidden mb-8 shadow-lg">
                        <Image
                            src={news.coverImageUrl}
                            alt={news.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 800px"
                            priority
                            unoptimized
                        />
                    </div>
                )}

                <div className="prose prose-sm sm:prose-lg max-w-none text-oscuro/80">
                    {news.content ? (
                        <div
                            className="[&_img]:w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_p]:leading-relaxed [&_p]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-verde [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-verde [&_blockquote]:pl-4 [&_blockquote]:italic"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />
                    ) : (
                        <p className="leading-relaxed">{news.excerpt}</p>
                    )}
                </div>
            </article>
        </>
    );
}