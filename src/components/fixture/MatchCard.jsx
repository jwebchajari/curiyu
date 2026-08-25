/**
 * Ruta: src/components/fixture/MatchCard.jsx
 * Resumen: Tarjeta resumida de partido, enlazada a la página de detalle.
 * Mejoras: Muestra local/visitante con color verde para Curiyú, fecha más grande para próximos,
 *          sin íconos de deporte, resultado con el mismo color que el equipo.
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
  const isFinished = match.finished;

  // Determinar imagen
  const fallbackImage = isFinished ? "/fin.png" : "/proximo.png";
  const rawImage = match.imageUrl && match.imageUrl !== "" ? match.imageUrl : fallbackImage;
  const imageUrl = getOptimizedCloudinaryUrl(rawImage, 800);

  const href = match.id ? `/fixture/${match.id}` : "#";

  // Formatear fecha
  const dateObj = new Date(match.date);
  const formattedDate = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(dateObj);

  // Para próximos partidos, fecha más grande
  const dateClass = isFinished
    ? "text-xs text-gray-500"
    : "text-sm font-semibold text-green-700";

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
        {/* Badge de deporte eliminado - ya no se muestra */}
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1 bg-white">
        <div className="flex items-center justify-between mb-2">
          <time className={dateClass}>{formattedDate}</time>
          {match.category && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              {match.category}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-left flex-1">
            {/* Equipo Local */}
            <div className="flex items-center gap-1">
              <h3
                className={`font-semibold leading-tight text-sm ${homeIsCuriyu ? "text-green-600" : "text-gray-900"
                  }`}
              >
                {match.homeTeam}
              </h3>
              {homeIsCuriyu && (
                <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
                  (Local)
                </span>
              )}
              {!homeIsCuriyu && (
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  (Local)
                </span>
              )}
            </div>

            <p className="text-gray-300 text-xs font-bold">vs</p>

            {/* Equipo Visitante */}
            <div className="flex items-center gap-1">
              <h3
                className={`font-semibold leading-tight text-sm ${awayIsCuriyu ? "text-green-600" : "text-gray-900"
                  }`}
              >
                {match.awayTeam}
              </h3>
              {awayIsCuriyu && (
                <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
                  (Visitante)
                </span>
              )}
              {!awayIsCuriyu && (
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  (Visitante)
                </span>
              )}
            </div>
          </div>

          {/* Resultado */}
          <div className="ml-3 flex-shrink-0 text-right">
            {isFinished ? (
              <p className="text-xl font-extrabold tracking-tight">
                <span className={homeIsCuriyu ? "text-green-600" : "text-gray-900"}>
                  {match.homeScore}
                </span>
                <span className="text-gray-400 mx-1">-</span>
                <span className={awayIsCuriyu ? "text-green-600" : "text-gray-900"}>
                  {match.awayScore}
                </span>
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