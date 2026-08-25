/**
 * Ruta: src/components/fixture/PublicFixture.jsx
 * Resumen: Renderiza solapas Rugby/Hockey y las secciones de últimos y próximos partidos.
 * Lógica: Recibe `sport`, `played`, `upcoming`. Las solapas son Links con query param.
 *         Solo renderiza secciones si hay datos. Estilos modernos con Tailwind.
 * Debería: Mostrar la categoría activa con sus partidos, con aspecto atractivo y responsive.
 * Estilo: Fondo blanco, sin modo oscuro.
 */
import Link from "next/link";
import MatchCard from "./MatchCard";

const TABS = [
  { key: "rugby", label: "Rugby", icon: "🏉" },
  { key: "hockey", label: "Hockey", icon: "🏑" },
];

export default function PublicFixture({ sport, played, upcoming }) {
  return (
    <div className="space-y-12">
      {/* Solapas tipo píldora con texto negro siempre */}
      <div
        role="tablist"
        aria-label="Elegir deporte"
        className="flex justify-center gap-3"
      >
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
              <span aria-hidden="true" className="text-base">{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Últimos partidos (jugados) */}
      <section aria-label={`Últimos partidos de ${sport}`}>
        {played.length > 0 ? (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-green-700">●</span> Últimos partidos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {played.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay partidos jugados aún.
          </div>
        )}
      </section>

      {/* Próximos partidos */}
      <section aria-label={`Próximos partidos de ${sport}`}>
        {upcoming.length > 0 ? (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-green-700">●</span> Próximos partidos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay próximos partidos.
          </div>
        )}
      </section>
    </div>
  );
}