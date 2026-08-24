"use client";

/**
 * Ruta: src/components/fixture/MatchDetail.jsx
 * Resumen: Muestra todos los detalles de un partido y botón compartir.
 * Lógica: Componente cliente. Recibe `match`. Identifica a Curiyú, muestra imagen grande,
 *         marcador central con resaltado verde, estadísticas en tarjetas con fondos,
 *         explicación de puntos dentro de un acordeón cerrado por defecto y botón compartir.
 * Debería: Presentar el partido de forma atractiva, clara y permitir compartir fácilmente.
 */
import { useState } from "react";

const CURIYU_NAMES = ["curiyú", "curiyu", "club curiyú"];

function isCuriyu(teamName) {
  if (!teamName) return false;
  const name = teamName.toLowerCase();
  return CURIYU_NAMES.some((curiyuName) => name.includes(curiyuName));
}

export default function MatchDetail({ match }) {
  const [shareStatus, setShareStatus] = useState("");
  const [showPointsInfo, setShowPointsInfo] = useState(false);

  const homeIsCuriyu = isCuriyu(match.homeTeam);
  const awayIsCuriyu = isCuriyu(match.awayTeam);

  const curiyuHomeStats = homeIsCuriyu;
  const curiyuStats = {
    tries: curiyuHomeStats ? match.homeTries : match.awayTries,
    conversions: curiyuHomeStats ? match.homeConversions : match.awayConversions,
    penalties: curiyuHomeStats ? match.homePenalties : match.awayPenalties,
    tryPenalties: curiyuHomeStats ? match.homeTryPenalties : match.awayTryPenalties,
  };
  const rivalStats = {
    tries: curiyuHomeStats ? match.awayTries : match.homeTries,
    conversions: curiyuHomeStats ? match.awayConversions : match.homeConversions,
    penalties: curiyuHomeStats ? match.awayPenalties : match.homePenalties,
    tryPenalties: curiyuHomeStats ? match.awayTryPenalties : match.homeTryPenalties,
  };

  const POINTS = {
    try: 5,
    conversion: 2,
    penalty: 3,
    tryPenalty: 8,
  };

  const curiyuTryPoints = curiyuStats.tries * POINTS.try;
  const curiyuConversionPoints = curiyuStats.conversions * POINTS.conversion;
  const curiyuPenaltyPoints = curiyuStats.penalties * POINTS.penalty;
  const curiyuTryPenaltyPoints = curiyuStats.tryPenalties * POINTS.tryPenalty;

  const rivalTryPoints = rivalStats.tries * POINTS.try;
  const rivalConversionPoints = rivalStats.conversions * POINTS.conversion;
  const rivalPenaltyPoints = rivalStats.penalties * POINTS.penalty;
  const rivalTryPenaltyPoints = rivalStats.tryPenalties * POINTS.tryPenalty;

  const curiyuTotalPoints =
    curiyuTryPoints + curiyuConversionPoints + curiyuPenaltyPoints + curiyuTryPenaltyPoints;
  const rivalTotalPoints =
    rivalTryPoints + rivalConversionPoints + rivalPenaltyPoints + rivalTryPenaltyPoints;

  let resultText = "";
  if (match.finished && (homeIsCuriyu || awayIsCuriyu)) {
    const curiyuScore = homeIsCuriyu ? match.homeScore : match.awayScore;
    const opponentScore = homeIsCuriyu ? match.awayScore : match.homeScore;
    if (curiyuScore > opponentScore) resultText = "Victoria";
    else if (curiyuScore < opponentScore) resultText = "Derrota";
    else resultText = "Empate";
  }

  const handleShare = async () => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/fixture/${match.id}`;
    const shareData = {
      title: `${match.homeTeam} vs ${match.awayTeam}`,
      text: `Partido de ${match.sport === "hockey" ? "Hockey" : "Rugby"}`,
      url: shareUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareStatus("Compartido");
      } catch (err) {
        if (err.name !== "AbortError") setShareStatus("Error al compartir");
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus("Enlace copiado");
      } catch (err) {
        setShareStatus("No se pudo copiar");
      }
    }
    setTimeout(() => setShareStatus(""), 3000);
  };

  const imageUrl =
    match.imageUrl && match.imageUrl !== "" ? match.imageUrl : "/logo2.png";

  const isRugby = match.sport === "rugby";
  const sportBadgeClass = isRugby
    ? "bg-green-900 text-white"
    : "bg-white text-green-700 border border-green-600";
  const sportIcon = isRugby ? "🏉" : "🏑";
  const sportLabel = isRugby ? "Rugby" : "Hockey";

  return (
    <article className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden">
      {/* Imagen principal */}
      <div className="relative h-64 sm:h-96 w-full">
        <img
          src={imageUrl}
          alt={`${match.homeTeam} vs ${match.awayTeam}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${sportBadgeClass}`}>
            <span aria-hidden="true">{sportIcon}</span>
            {sportLabel}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-sm font-medium">
            📅 {new Intl.DateTimeFormat("es-AR", { dateStyle: "long" }).format(new Date(match.date))}
          </p>
          {match.location && <p className="text-sm">📍 {match.location}</p>}
        </div>
      </div>

      {/* Cuerpo */}
      <div className="p-6 sm:p-10">
        {match.category && (
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-200">
              {match.category}
            </span>
          </div>
        )}

        {/* Marcador central */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8">
          <div className="text-center flex-1">
            <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {match.homeTeam}
            </h1>
            {homeIsCuriyu && (
              <span className="inline-block mt-1 text-xs font-bold text-green-600 uppercase tracking-wide">
                Curiyú
              </span>
            )}
          </div>

          <div className="text-center">
            <p className="text-4xl sm:text-6xl font-black tracking-tight">
              {homeIsCuriyu ? (
                <span className="text-green-600">{match.homeScore}</span>
              ) : (
                <span className="text-gray-900 dark:text-white">{match.homeScore}</span>
              )}
              <span className="text-gray-300 dark:text-gray-500 mx-2 sm:mx-4">-</span>
              {awayIsCuriyu ? (
                <span className="text-green-600">{match.awayScore}</span>
              ) : (
                <span className="text-gray-900 dark:text-white">{match.awayScore}</span>
              )}
            </p>
            {match.finished && (
              <span
                className={[
                  "mt-2 inline-block px-4 py-1 rounded-full text-sm font-bold",
                  resultText === "Victoria" && "bg-green-100 text-green-700",
                  resultText === "Derrota" && "bg-red-100 text-red-700",
                  resultText === "Empate" && "bg-gray-100 text-gray-700",
                ].join(" ")}
              >
                {resultText}
              </span>
            )}
          </div>

          <div className="text-center flex-1">
            <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {match.awayTeam}
            </h1>
            {awayIsCuriyu && (
              <span className="inline-block mt-1 text-xs font-bold text-green-600 uppercase tracking-wide">
                Curiyú
              </span>
            )}
          </div>
        </div>

        {/* Detalles de tantos */}
        {match.finished && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Detalle de tantos
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Tarjeta Curiyú */}
              <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-slate-800 rounded-2xl p-5 border border-green-100 dark:border-green-900/50 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-green-700 dark:text-green-400">
                    Curiyú
                  </h3>
                  <span className="text-2xl font-black text-green-600">
                    {curiyuTotalPoints}
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Tries</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {curiyuStats.tries} <span className="text-gray-400">→</span> {curiyuTryPoints} pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Conversiones</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {curiyuStats.conversions} <span className="text-gray-400">→</span> {curiyuConversionPoints} pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Penales</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {curiyuStats.penalties} <span className="text-gray-400">→</span> {curiyuPenaltyPoints} pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Try penal</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {curiyuStats.tryPenalties} <span className="text-gray-400">→</span> {curiyuTryPenaltyPoints} pts
                    </span>
                  </div>
                </div>
              </div>

              {/* Tarjeta Rival */}
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-700/50 dark:to-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">
                    Rival
                  </h3>
                  <span className="text-2xl font-black text-gray-700 dark:text-gray-200">
                    {rivalTotalPoints}
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Tries</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {rivalStats.tries} <span className="text-gray-400">→</span> {rivalTryPoints} pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Conversiones</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {rivalStats.conversions} <span className="text-gray-400">→</span> {rivalConversionPoints} pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Penales</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {rivalStats.penalties} <span className="text-gray-400">→</span> {rivalPenaltyPoints} pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Try penal</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {rivalStats.tryPenalties} <span className="text-gray-400">→</span> {rivalTryPenaltyPoints} pts
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Acordeón de explicación de puntos */}
            <div className="mt-6">
              <button
                onClick={() => setShowPointsInfo((prev) => !prev)}
                aria-expanded={showPointsInfo}
                className="w-full flex items-center justify-between bg-blue-50 dark:bg-slate-900/60 rounded-2xl p-4 text-sm font-semibold text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span>¿Cómo se suman los puntos?</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transform transition-transform ${showPointsInfo ? "rotate-180" : ""}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {showPointsInfo && (
                <div className="mt-2 bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm animate-fadeIn">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Try</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Conversión</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Penal</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Try penal</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-blue-600 dark:text-blue-300">
                    * El try penal vale 8 puntos porque equivale a un try (5) + un penal (3).
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botón compartir */}
        <div className="mt-10 flex flex-col items-center">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-700 text-white font-semibold hover:bg-green-800 transition-colors shadow-lg shadow-green-700/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.32l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.03 3.03 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Compartir partido
          </button>
          {shareStatus && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{shareStatus}</p>
          )}
        </div>
      </div>
    </article>
  );
}