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
  const [isSharing, setIsSharing] = useState(false);
  const [showPointsInfo, setShowPointsInfo] = useState(false);

  // ... (todo el código de cálculo de puntos y resultado permanece igual)

  const handleShare = async () => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/fixture/${match.id}`;
    const shareData = {
      title: `${match.homeTeam} vs ${match.awayTeam}`,
      text: `Partido de ${match.sport === "hockey" ? "Hockey" : "Rugby"}`,
      url: shareUrl,
    };

    setIsSharing(true);
    setShareStatus("");

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("✅ ¡Compartido con éxito!");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus("🔗 Enlace copiado al portapapeles");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setShareStatus("❌ No se pudo compartir. Intenta de nuevo.");
      }
    } finally {
      setIsSharing(false);
      setTimeout(() => setShareStatus(""), 4000);
    }
  };

  // ... (resto del código del componente, sin cambios en lógica)

  return (
    <article className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="p-6 sm:p-10">
        {/* ... todo el contenido anterior ... */}

        {/* Sección de compartir mejorada */}
        <div className="mt-10 flex flex-col items-center">
          <button
            onClick={handleShare}
            disabled={isSharing}
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold transition-all shadow-lg ${isSharing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-800 hover:shadow-green-700/40 active:scale-95"
              }`}
          >
            {isSharing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Compartiendo...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.32l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.03 3.03 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Compartir partido
              </>
            )}
          </button>

          {shareStatus && (
            <div className="mt-3 px-4 py-2 rounded-full bg-gray-100 text-sm font-medium text-gray-700 animate-fadeIn">
              {shareStatus}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}