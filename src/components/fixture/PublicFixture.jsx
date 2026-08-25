/**
 * Ruta: src/components/fixture/PublicFixture.jsx
 * Resumen: Renderiza solapas Rugby/Hockey y las secciones de próximos y resultados.
 * Lógica: Recibe `sport`, `upcoming` (próximos), `finished` (resultados).
 *         Muestra los próximos partidos (todos) y los resultados con paginación (10 iniciales + Ver más).
 * Estilo: Fondo blanco, sin modo oscuro.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import MatchCard from "./MatchCard";

const TABS = [
  { key: "rugby", label: "Rugby", icon: "🏉" },
  { key: "hockey", label: "Hockey", icon: "🏑" },
];

const INITIAL_RESULTS = 10;
const RESULTS_INCREMENT = 10;

export default function PublicFixture({ sport, upcoming, finished }) {
  const [visibleResults, setVisibleResults] = useState(INITIAL_RESULTS);

  // Mostrar todos los próximos (sin paginación)
  const upcomingList = upcoming;

  // Resultados con paginación
  const resultsList = finished.slice(0, visibleResults);
  const hasMoreResults = visibleResults < finished.length;

  const handleLoadMore = () => {
    setVisibleResults((prev) => prev + RESULTS_INCREMENT);
  };

  return (
    <div className="space-y-12">
      {/* Solapas */}
      <div role="tablist" aria-label="Elegir deporte" className="flex justify-center gap-3">
        {TABS.map((tab) => {
          const isActive = tab.key === sport;
          return (
            <Link
              key={tab.key}
              href={`/fixture?deporte=${tab.key}`}
              role="tab"
              aria-selected={isActive}
              className={[
                "inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 text-black",
                isActive
                  ? "bg-white border-2 border-green-700 shadow-lg scale-105"
                  : "bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
              ].join(" ")}
            >
              <span aria-hidden="true" className="text-base">
                {tab.icon}
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Próximos partidos */}
      <section aria-label={`Próximos partidos de ${sport}`}>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-green-700">●</span> Próximos partidos
        </h2>
        {upcomingList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingList.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay próximos partidos.
          </div>
        )}
      </section>

      {/* Resultados (partidos finalizados) */}
      <section aria-label={`Resultados de ${sport}`}>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-green-700">●</span> Resultados
        </h2>
        {finished.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resultsList.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
            {hasMoreResults && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition"
                >
                  Ver más resultados ({finished.length - visibleResults} restantes)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay resultados aún.
          </div>
        )}
      </section>
    </div>
  );
}