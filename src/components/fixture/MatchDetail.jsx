"use client";

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

  // Si el partido no está finalizado, no mostramos marcador ni estadísticas
  const isFinished = match.finished;

  // Determinar las estadísticas de Curiyú y rival solo si está finalizado
  const curiyuStats = isFinished
    ? {
      tries: homeIsCuriyu ? match.homeTries : match.awayTries,
      conversions: homeIsCuriyu ? match.homeConversions : match.awayConversions,
      penalties: homeIsCuriyu ? match.homePenalties : match.awayPenalties,
      tryPenalties: homeIsCuriyu ? match.homeTryPenalties : match.awayTryPenalties,
    }
    : { tries: 0, conversions: 0, penalties: 0, tryPenalties: 0 };

  const rivalStats = isFinished
    ? {
      tries: homeIsCuriyu ? match.awayTries : match.homeTries,
      conversions: homeIsCuriyu ? match.awayConversions : match.homeConversions,
      penalties: homeIsCuriyu ? match.awayPenalties : match.homePenalties,
      tryPenalties: homeIsCuriyu ? match.awayTryPenalties : match.homeTryPenalties,
    }
    : { tries: 0, conversions: 0, penalties: 0, tryPenalties: 0 };

  const POINTS = { try: 5, conversion: 2, penalty: 3, tryPenalty: 8 };

  const curiyuTotalPoints = isFinished
    ? curiyuStats.tries * POINTS.try +
    curiyuStats.conversions * POINTS.conversion +
    curiyuStats.penalties * POINTS.penalty +
    curiyuStats.tryPenalties * POINTS.tryPenalty
    : 0;

  const rivalTotalPoints = isFinished
    ? rivalStats.tries * POINTS.try +
    rivalStats.conversions * POINTS.conversion +
    rivalStats.penalties * POINTS.penalty +
    rivalStats.tryPenalties * POINTS.tryPenalty
    : 0;

  let resultText = "";
  if (isFinished && (homeIsCuriyu || awayIsCuriyu)) {
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
      text: `Partido de ${match.sport === "hockey" ? "Hockey" : "Rugby"}${isFinished
        ? ` | Resultado: ${match.homeScore} - ${match.awayScore}`
        : " | Próximo partido"
        }`,
      url: shareUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareStatus("✅ ¡Compartido con éxito!");
      } catch (err) {
        if (err.name !== "AbortError") setShareStatus("❌ Error al compartir");
        else setShareStatus("");
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus("🔗 Enlace copiado al portapapeles");
      } catch (err) {
        setShareStatus("⚠️ No se pudo copiar el enlace");
      }
    }
    setTimeout(() => setShareStatus(""), 3000);
  };

  const isRugby = match.sport === "rugby";
  const sportBadgeClass = isRugby
    ? "bg-green-800 text-white"
    : "bg-white text-green-700 border border-green-600";
  const sportIcon = isRugby ? "🏉" : "🏑";
  const sportLabel = isRugby ? "Rugby" : "Hockey";

  return (
    <article className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="p-6 sm:p-10">
        {/* Badges de deporte y categoría */}
        {match.category && (
          <div className="mb-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${sportBadgeClass}`}
            >
              <span aria-hidden="true">{sportIcon}</span>
              {sportLabel}
            </span>
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
              {match.category}
            </span>
          </div>
        )}

        {/* Equipos y marcador */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8">
          {/* Equipo local */}
          <div className="text-center flex-1">
            <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900">
              {match.homeTeam}
            </h1>
            <span className="inline-block mt-1 px-3 py-1 rounded-full bg-gray-100 text-xs font-bold uppercase tracking-wide text-gray-600">
              Local
            </span>
          </div>

          {/* Marcador o VS */}
          <div className="text-center">
            {isFinished ? (
              <>
                <p className="text-4xl sm:text-6xl font-black tracking-tight">
                  <span className={homeIsCuriyu ? "text-green-600" : "text-gray-900"}>
                    {match.homeScore}
                  </span>
                  <span className="text-gray-300 mx-2 sm:mx-4">-</span>
                  <span className={awayIsCuriyu ? "text-green-600" : "text-gray-900"}>
                    {match.awayScore}
                  </span>
                </p>
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
              </>
            ) : (
              <div className="py-4">
                <p className="text-3xl sm:text-4xl font-black text-gray-300 tracking-widest">
                  VS
                </p>
                <p className="mt-2 text-sm font-medium text-gray-500">
                  Próximo partido
                </p>
              </div>
            )}
          </div>

          {/* Equipo visitante */}
          <div className="text-center flex-1">
            <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900">
              {match.awayTeam}
            </h1>
            <span className="inline-block mt-1 px-3 py-1 rounded-full bg-gray-100 text-xs font-bold uppercase tracking-wide text-gray-600">
              Visita
            </span>
            {awayIsCuriyu && (
              <span className="block mt-1 text-xs font-bold text-green-600 uppercase tracking-wide">
                Curiyú
              </span>
            )}
          </div>
        </div>

        {/* Detalle de tantos solo si está finalizado */}
        {isFinished && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Detalle de tantos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Tarjeta Curiyú */}
              <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-5 border border-green-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-green-700">Curiyú</h3>
                  <span className="text-2xl font-black text-green-600">
                    {curiyuTotalPoints}
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tries</span>
                    <span className="font-semibold text-gray-900">
                      {curiyuStats.tries}{" "}
                      <span className="text-gray-400">→</span>{" "}
                      {curiyuStats.tries * POINTS.try} pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Conversiones</span>
                    <span className="font-semibold text-gray-900">
                      {curiyuStats.conversions}{" "}
                      <span className="text-gray-400">→</span>{" "}
                      {curiyuStats.conversions * POINTS.conversion} pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Penales</span>
                    <span className="font-semibold text-gray-900">
                      {curiyuStats.penalties}{" "}
                      <span className="text-gray-400">→</span>{" "}
                      {curiyuStats.penalties * POINTS.penalty} pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Try penal</span>
                    <span className="font-semibold text-gray-900">
                      {curiyuStats.tryPenalties}{" "}
                      <span className="text-gray-400">→</span>{" "}
                      {curiyuStats.tryPenalties * POINTS.tryPenalty} pts
                    </span>
                  </div>
                </div>
              </div>

              {/* Tarjeta Rival */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-700">Rival</h3>
                  <span className="text-2xl font-black text-gray-700">
                    {rivalTotalPoints}
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tries</span>
                    <span className="font-semibold text-gray-900">
                      {rivalStats.tries}{" "}
                      <span className="text-gray-400">→</span>{" "}
                      {rivalStats.tries * POINTS.try} pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Conversiones</span>
                    <span className="font-semibold text-gray-900">
                      {rivalStats.conversions}{" "}
                      <span className="text-gray-400">→</span>{" "}
                      {rivalStats.conversions * POINTS.conversion} pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Penales</span>
                    <span className="font-semibold text-gray-900">
                      {rivalStats.penalties}{" "}
                      <span className="text-gray-400">→</span>{" "}
                      {rivalStats.penalties * POINTS.penalty} pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Try penal</span>
                    <span className="font-semibold text-gray-900">
                      {rivalStats.tryPenalties}{" "}
                      <span className="text-gray-400">→</span>{" "}
                      {rivalStats.tryPenalties * POINTS.tryPenalty} pts
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Acordeón de cómo se suman puntos */}
            <div className="mt-6">
              <button
                onClick={() => setShowPointsInfo((prev) => !prev)}
                aria-expanded={showPointsInfo}
                className="w-full flex items-center justify-between bg-blue-50 rounded-2xl p-4 text-sm font-semibold text-blue-800 hover:bg-blue-100 transition-colors"
              >
                <span>¿Cómo se suman los puntos?</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transform transition-transform ${showPointsInfo ? "rotate-180" : ""
                    }`}
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
                <div className="mt-2 bg-white rounded-2xl p-5 shadow-sm animate-fadeIn border border-gray-100">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-gray-900">5</p>
                      <p className="text-xs text-gray-500">Try</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-gray-900">2</p>
                      <p className="text-xs text-gray-500">Conversión</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-gray-900">3</p>
                      <p className="text-xs text-gray-500">Penal</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-gray-900">8</p>
                      <p className="text-xs text-gray-500">Try penal</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-blue-600">
                    * El try penal vale 8 puntos porque equivale a un try (5) + un penal (3).
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botón de compartir */}
        <div className="mt-10 flex flex-col items-center">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-green-700 to-green-600 text-white font-semibold hover:from-green-800 hover:to-green-700 transition-all shadow-lg shadow-green-700/30 hover:shadow-xl hover:shadow-green-700/40 active:scale-95"
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
            <p className="mt-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-full px-4 py-1.5 animate-fadeIn">
              {shareStatus}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}