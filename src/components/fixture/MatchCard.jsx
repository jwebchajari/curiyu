/**
 * Ruta: src/components/fixture/MatchCard.jsx
 * Resumen: Tarjeta resumida de partido, enlazada a la página de detalle.
 * Lógica: Componente de servidor. Muestra imagen (imageUrl optimizada si es de Cloudinary,
 *         o fallback /fin.png para finalizados y /proximo.png para próximos).
 *         Muestra badge de deporte, fecha, equipos, marcador y enlace "Ver más".
 * Debería: Mostrar un resumen atractivo y navegar a `/fixture/[id]`.
 * Estilo: Fondo blanco, sin modo oscuro.
 */
import Link from "next/link";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary-client";

const CURIYU_NAMES = ["curiyú", "curiyu", "club curiyú"];

function isCuriyu(teamName) {
  if (!teamName) return false;
  const name = teamName.toLowerCase();
  return CURIYU_NAMES.some((curiyuName) => name.includes(curiyuName));
}

export default function MatchCard({ match }) {
  const homeIsCuriyu = isCuriyu(match.homeTeam);
  const awayIsCuriyu = isCuriyu(match.awayTeam);

  // Determinar imagen
  const fallbackImage = match.finished ? "/fin.png" : "/proximo.png";
  const rawImage = match.imageUrl && match.imageUrl !== "" ? match.imageUrl : fallbackImage;
  const imageUrl = getOptimizedCloudinaryUrl(rawImage, 800);

  const href = match.id ? `/fixture/${match.id}` : "#";

  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white"
    >
      {/* Imagen */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={`${match.homeTeam} vs ${match.awayTeam}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Badge de deporte */}
        <div className="absolute top-2 left-2">
          {match.sport === "rugby" ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 text-white text-xs font-semibold backdrop-blur-sm">
              <span aria-hidden="true">🏉</span> Rugby
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 text-green-700 border border-green-600 text-xs font-semibold backdrop-blur-sm">
              <span aria-hidden="true">🏑</span> Hockey
            </span>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1 bg-white">
        <div className="flex items-center justify-between mb-2">
          <time className="text-xs text-gray-500">
            {new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short" }).format(new Date(match.date))}
          </time>
          {match.category && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              {match.category}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-left flex-1">
            <h3 className="font-semibold text-gray-900 leading-tight text-sm">
              {match.homeTeam}
            </h3>
            <p className="text-gray-400 text-xs">vs</p>
            <h3 className="font-semibold text-gray-900 leading-tight text-sm">
              {match.awayTeam}
            </h3>
          </div>
          <div className="ml-3 flex-shrink-0 text-right">
            {match.finished ? (
              <p className="text-xl font-extrabold tracking-tight">
                {homeIsCuriyu ? (
                  <span className="text-green-600">{match.homeScore}</span>
                ) : (
                  <span className="text-gray-900">{match.homeScore}</span>
                )}
                <span className="text-gray-400 mx-1">-</span>
                {awayIsCuriyu ? (
                  <span className="text-green-600">{match.awayScore}</span>
                ) : (
                  <span className="text-gray-900">{match.awayScore}</span>
                )}
              </p>
            ) : (
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                Próximo
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-100 text-right">
          <span className="text-xs font-medium text-green-700">Ver más →</span>
        </div>
      </div>
    </Link>
  );
}