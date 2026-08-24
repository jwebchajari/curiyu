/**
 * Ruta: src/app/fixture/[slug]/page.jsx
 * Resumen: Página de detalle de un partido específico.
 * Lógica: Obtiene el partido por ID (slug) desde Firestore. En Next.js 15, `params` es
 *         una Promise, por lo que se usa `await params` para obtener el slug.
 *         Genera metadatos dinámicos para SEO, incluyendo imagen optimizada para compartir.
 *         Muestra una imagen de portada grande (si existe) y luego el detalle.
 * Debería: Mostrar todos los detalles del partido al hacer clic en "Ver más" desde la lista,
 *          y permitir compartir el enlace con imagen y título personalizados.
 */
import { adminDb } from "@/lib/firebase/admin";
import MatchDetail from "@/components/fixture/MatchDetail";
import PageHeader from "@/components/layout/PageHeader";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getOptimizedUrlFromUrl } from "@/lib/cloudinary-server"; // <-- Importación agregada

export const dynamic = "force-dynamic";

function serializeMatch(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    date: data.date?.toDate?.() ? data.date.toDate().toISOString() : data.date,
    updatedAt: data.updatedAt?.toDate?.()
      ? data.updatedAt.toDate().toISOString()
      : null,
  };
}

export async function generateMetadata({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clubcuriyu.com";
  try {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    if (!slug) return { title: "Partido no encontrado" };

    const docSnap = await adminDb.collection("matches").doc(slug).get();
    if (!docSnap.exists) return { title: "Partido no encontrado" };

    const match = serializeMatch(docSnap);
    const sportLabel = match.sport === "hockey" ? "Hockey" : "Rugby";
    const title = `${match.homeTeam} vs ${match.awayTeam} | ${sportLabel} | Club Curiyú`;
    const description = `Partido de ${sportLabel} en el Club Curiyú. ${
      match.finished ? `Resultado: ${match.homeScore} - ${match.awayScore}` : "Próximo partido"
    }`;

    let imageUrl;
    if (match.imageUrl && match.imageUrl !== "") {
      if (match.imageUrl.includes("res.cloudinary.com")) {
        imageUrl = getOptimizedUrlFromUrl(match.imageUrl, {
          width: 1200,
          height: 630,
          crop: "fill",
          fetch_format: "auto",
          quality: "auto",
        });
      } else {
        imageUrl = match.imageUrl.startsWith("http")
          ? match.imageUrl
          : `${baseUrl}${match.imageUrl}`;
      }
    } else {
      imageUrl = `${baseUrl}/logo2.png`;
    }

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        url: `${baseUrl}/fixture/${match.id}`,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error generando metadata:", error);
    return {
      title: "Fixture | Club Curiyú",
      description: "Detalle del partido",
    };
  }
}

export default async function MatchDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) notFound();

  let match = null;
  try {
    const docSnap = await adminDb.collection("matches").doc(slug).get();
    if (!docSnap.exists) notFound();
    match = serializeMatch(docSnap);
  } catch (error) {
    console.error("Error cargando partido:", error);
    notFound();
  }

  const imageUrl = match.imageUrl && match.imageUrl !== "" ? match.imageUrl : "/logo2.png";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16">
        <PageHeader
          eyebrow={match.sport === "hockey" ? "Hockey" : "Rugby"}
          title="Detalle del partido"
        />

        {/* Banner de imagen grande */}
        <div className="relative h-52 md:h-96 w-full rounded-2xl overflow-hidden mb-8 shadow-xl">
          <Image
            src={imageUrl}
            alt={`${match.homeTeam} vs ${match.awayTeam}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
            unoptimized
          />
        </div>

        <MatchDetail match={match} />
      </div>
    </div>
  );
}