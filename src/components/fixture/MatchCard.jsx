/**
 * Ruta: src/components/fixture/MatchCard.jsx
 * Resumen: Tarjeta resumida de partido, enlazada a la página de detalle.
 * Lógica: Componente de servidor (sin hooks). Verifica que `match.id` exista antes de crear
 *         el Link. Muestra imagen (imageUrl o logo2.png), badge de deporte con colores/iconos,
 *         fecha, categoría, equipos, marcador con resaltado de Curiyú y enlace "Ver más".
 *         No expande; navega a `/fixture/[id]`.
 * Debería: Mostrar un resumen atractivo y permitir al usuario ir al detalle del partido.
 */

import Link from "next/link";

// Nombres posibles del club para identificar si un equipo es Curiyú.
const CURIYU_NAMES = ["curiyú", "curiyu", "club curiyú"];

function isCuriyu(teamName) {
  if (!teamName) return false;
  const name = teamName.toLowerCase();
  return CURIYU_NAMES.some((curiyuName) => name.includes(curiyuName));
}

export default function MatchCard({ match }) {
  const homeIsCuriyu = isCuriyu(match.homeTeam);
  const awayIsCuriyu = isCuriyu(match.awayTeam);
  const imageUrl =
    match.imageUrl && match.imageUrl !== "" ? match.imageUrl : "/logo2.png";

  // Evitar enlaces inválidos si falta el id
  const href = match.id ? `/fixture/${match.id}` : "#";

  // Contenido interno de la tarjeta (se usa tanto si hay link como si no)
  const cardContent = (
    <>
      {/* Imagen y badge de deporte */}
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={`${match.homeTeam} vs ${match.awayTeam}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 left-2">
          {match.sport === "rugby" ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-sm">
              <span aria-hidden="true">🏉</span> Rugby
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/80 text-green-700 border border-green-600 text-xs font-semibold backdrop-blur-sm">
              <span aria-hidden="true">🏑</span> Hockey
            </span>
          )}
        </div>
      </div>

      {/* Cuerpo */}
      <div className="p-4 flex flex-col flex-1 bg-white dark:bg-slate-800">
        <div className="flex items-center justify-between mb-2">
          <time className="text-xs text-gray-500 dark:text-gray-400">
            {new Intl.DateTimeFormat("es-AR", {
              day: "2-digit",
              month: "short",
            }).format(new Date(match.date))}
          </time>
          {match.category && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-200">
              {match.category}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-left flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white leading-tight text-sm">
              {match.homeTeam}
            </h3>
            <p className="text-gray-400 text-xs">vs</p>
            <h3 className="font-semibold text-gray-900 dark:text-white leading-tight text-sm">
              {match.awayTeam}
            </h3>
          </div>
          <div className="ml-3 flex-shrink-0 text-right">
            {match.finished ? (
              <p className="text-xl font-extrabold tracking-tight">
                {homeIsCuriyu ? (
                  <span className="text-green-600">{match.homeScore}</span>
                ) : (
                  <span className="text-gray-900 dark:text-white">{match.homeScore}</span>
                )}
                <span className="text-gray-400 mx-1">-</span>
                {awayIsCuriyu ? (
                  <span className="text-green-600">{match.awayScore}</span>
                ) : (
                  <span className="text-gray-900 dark:text-white">{match.awayScore}</span>
                )}
              </p>
            ) : (
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                Próximo
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-100 dark:border-slate-700 text-right">
          <span className="text-xs font-medium text-primary">Ver más →</span>
        </div>
      </div>
    </>
  );

  // Si no tiene id, se renderiza sin enlace (por seguridad)
  if (!match.id) {
    return (
      <div className="group flex flex-col rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {cardContent}
    </Link>
  );
}