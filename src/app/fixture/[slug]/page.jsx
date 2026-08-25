/**
 * Ruta: src/app/fixture/[slug]/page.jsx
 * Resumen: Detalle de un partido específico.
 * Estilo: Fondo blanco, sin gradientes.
 */
import { adminDb } from "@/lib/firebase/admin";
import MatchDetail from "@/components/fixture/MatchDetail";
import PageHeader from "@/components/layout/PageHeader";
import Image from "next/image";
import Link from "next/link";
import { getOptimizedUrlFromUrl } from "@/lib/cloudinary-server";

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

// Función auxiliar para obtener la imagen correcta según estado y URL
function getMatchImage(match, baseUrl) {
  if (match.imageUrl && match.imageUrl !== "") {
    if (match.imageUrl.includes("res.cloudinary.com")) {
      return getOptimizedUrlFromUrl(match.imageUrl, {
        width: 1200,
        height: 630,
        crop: "fill",
        fetch_format: "auto",
        quality: "auto",
      });
    } else {
      return match.imageUrl.startsWith("http")
        ? match.imageUrl
        : `${baseUrl}${match.imageUrl}`;
    }
  }
  // Si no hay imagen, usar fin.png o proximo.png según finished
  return match.finished ? `${baseUrl}/fin.png` : `${baseUrl}/proximo.png`;
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
    const description = `Partido de ${sportLabel} en el Club Curiyú. ${match.finished ? `Resultado: ${match.homeScore} - ${match.awayScore}` : "Próximo partido"
      }`;

    const imageUrl = getMatchImage(match, baseUrl);

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

  if (!slug) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Partido no encontrado</h1>
          <Link
            href="/fixture"
            className="inline-block bg-verde text-white font-semibold py-2 px-6 rounded-full hover:bg-verde-oscuro transition-colors"
          >
            Volver al fixture
          </Link>
        </div>
      </div>
    );
  }

  let match = null;
  try {
    const docSnap = await adminDb.collection("matches").doc(slug).get();
    if (!docSnap.exists) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Partido no encontrado</h1>
            <Link
              href="/fixture"
              className="inline-block bg-verde text-white font-semibold py-2 px-6 rounded-full hover:bg-verde-oscuro transition-colors"
            >
              Volver al fixture
            </Link>
          </div>
        </div>
      );
    }
    match = serializeMatch(docSnap);
  } catch (error) {
    console.error("Error cargando partido:", error);
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error al cargar el partido</h1>
          <Link
            href="/fixture"
            className="inline-block bg-verde text-white font-semibold py-2 px-6 rounded-full hover:bg-verde-oscuro transition-colors"
          >
            Volver al fixture
          </Link>
        </div>
      </div>
    );
  }

  // Imagen para el render: usamos la misma función de imagen optimizada
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clubcuriyu.com";
  const imageUrl = getMatchImage(match, baseUrl);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16">
        <PageHeader
          eyebrow={match.sport === "hockey" ? "Hockey" : "Rugby"}
          title="Detalle del partido"
        />

        {/* Banner de imagen grande */}
        <div className="relative h-52 md:h-96 w-full rounded-2xl overflow-hidden mb-8 shadow-xl bg-gray-100">
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