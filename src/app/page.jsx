import Link from "next/link";
import Image from "next/image";
import { getAllNews } from "@/lib/firebase/news";
import { adminDb } from "@/lib/firebase/admin";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Club Curiyú | Rugby y Hockey — Chajarí, Entre Ríos",
  description:
    "Club deportivo en Chajarí, Entre Ríos. Rugby y Hockey para todas las edades. Somos una familia.",
};

const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
};

const isToday = (date) => {
  const today = new Date();
  const d = new Date(date);
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

const CURIYU_NAMES = ["curiyú", "curiyu", "club curiyú"];
function isCuriyu(teamName) {
  if (!teamName) return false;
  const name = teamName.toLowerCase();
  return CURIYU_NAMES.some((curiyuName) => name.includes(curiyuName));
}

export default async function Home() {
  const allNews = await getAllNews();
  const latestNews = allNews.slice(0, 3);

  let matches = [];
  try {
    const snapshot = await adminDb.collection("matches").orderBy("date", "asc").get();
    matches = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate?.() ? data.date.toDate().toISOString() : data.date,
      };
    });
  } catch (error) {
    console.error("Error cargando partidos:", error);
  }

  const finishedMatches = matches
    .filter((m) => m.finished)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const upcomingMatches = matches
    .filter((m) => !m.finished)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const nextMatches = upcomingMatches.slice(0, 3);
  const lastResults = finishedMatches.slice(0, 3);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-white">
        {/* HERO */}
        <section className="relative min-h-[85vh] flex items-center justify-center bg-verde text-white py-20 px-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 animate-slow-zoom"
            style={{ backgroundImage: "url('/foto-club.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-verde/80 via-verde/70 to-verde/90" />
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <p className="text-verde-claro uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold mb-4 drop-shadow">
              Chajarí, Entre Ríos · Argentina
            </p>
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wide leading-none mb-6 text-white drop-shadow-2xl">
              CLUB CURIYÚ
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
              Rugby y Hockey para todas las edades. Somos una familia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/rugby"
                className="w-full sm:w-auto bg-white text-verde font-bold py-3 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-verde"
              >
                Rugby
              </Link>
              <Link
                href="/hockey"
                className="w-full sm:w-auto border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-verde transition-all hover:scale-105 shadow-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-verde"
              >
                Hockey
              </Link>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* ÚLTIMAS NOTICIAS (ahora primero) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          <div className="flex items-end justify-between mb-8 md:mb-14">
            <div>
              <p className="text-verde text-sm font-semibold uppercase tracking-widest mb-2">Actualidad</p>
              <h2 className="font-display text-4xl md:text-5xl text-oscuro leading-tight">Últimas Noticias</h2>
            </div>
            <Link
              href="/noticias"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-verde hover:text-verde-oscuro transition-colors focus:outline-none focus:ring-2 focus:ring-verde rounded px-3 py-2"
            >
              Ver todas <span aria-hidden="true">→</span>
            </Link>
          </div>

          {latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {latestNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/noticias/${item.slug || item.id}`}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col focus:outline-none focus:ring-2 focus:ring-verde hover:-translate-y-2"
                >
                  {/* Imagen superior estilo fixture */}
                  <div className="relative h-52 w-full overflow-hidden">
                    {item.coverImageUrl ? (
                      <Image
                        src={item.coverImageUrl}
                        alt={item.title || "Noticia"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-verde-suave to-verde/30 flex items-center justify-center">
                        <span className="text-6xl opacity-50">📰</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-verde text-xs font-bold px-3 py-1 rounded-full shadow">
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-oscuro text-lg sm:text-xl mb-2 group-hover:text-verde transition-colors line-clamp-2">
                      {item.title || "Sin título"}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                      {item.excerpt || "Sin descripción disponible."}
                    </p>
                    <div className="mt-auto flex justify-end">
                      <span className="inline-flex items-center gap-1 text-verde font-semibold text-sm group-hover:gap-2 transition-all">
                        Leer más <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-12 text-center">
              <p className="text-gray-500 text-lg">📭 No hay noticias publicadas aún.</p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/noticias"
              className="inline-flex items-center gap-2 text-sm font-semibold text-verde px-4 py-2 rounded-full border border-verde/30 hover:bg-verde/5 transition-colors"
            >
              Ver todas las noticias <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* PRÓXIMOS PARTIDOS */}
        <section className="bg-gradient-to-b from-verde-suave/50 to-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-end justify-between mb-8 md:mb-14">
              <div>
                <p className="text-verde text-sm font-semibold uppercase tracking-widest mb-2">Agenda</p>
                <h2 className="font-display text-4xl md:text-5xl text-oscuro leading-tight">Próximos Partidos</h2>
              </div>
              <Link
                href="/fixture"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-verde hover:text-verde-oscuro transition-colors focus:outline-none focus:ring-2 focus:ring-verde rounded px-3 py-2"
              >
                Ver fixture completo <span aria-hidden="true">→</span>
              </Link>
            </div>

            {nextMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {nextMatches.map((match) => {
                  const date = new Date(match.date);
                  const isTodayMatch = isToday(date);
                  const homeIsCuriyu = isCuriyu(match.homeTeam);
                  const awayIsCuriyu = isCuriyu(match.awayTeam);
                  return (
                    <Link
                      key={match.id}
                      href={`/fixture/${match.id}`}
                      className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col focus:outline-none focus:ring-2 focus:ring-verde hover:-translate-y-2"
                    >
                      <div className="p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-xs font-bold text-verde bg-verde-suave px-3 py-1 rounded-full uppercase">
                            {match.sport === "rugby" ? "🏉 Rugby" : "🏑 Hockey"}
                          </span>
                          {isTodayMatch ? (
                            <span className="text-xs font-bold text-white bg-yellow-500 px-3 py-1 rounded-full animate-pulse">
                              HOY
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500 font-medium">
                              {formatDate(match.date)}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col gap-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold text-oscuro text-xl leading-tight group-hover:text-verde transition-colors">
                                {match.homeTeam}
                              </p>
                              <span
                                className={`inline-block mt-1 text-xs font-medium uppercase tracking-wide px-2 py-0.5 rounded-full ${homeIsCuriyu
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                                  }`}
                              >
                                Local
                              </span>
                            </div>
                            <span className="text-gray-300 font-bold text-2xl leading-none mt-1">vs</span>
                          </div>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold text-oscuro text-xl leading-tight group-hover:text-verde transition-colors">
                                {match.awayTeam}
                              </p>
                              <span
                                className={`inline-block mt-1 text-xs font-medium uppercase tracking-wide px-2 py-0.5 rounded-full ${awayIsCuriyu
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                                  }`}
                              >
                                Visita
                              </span>
                            </div>
                            <span className="w-8"></span>
                          </div>
                        </div>

                        {match.category && (
                          <p className="text-sm text-gray-500">{match.category}</p>
                        )}

                        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                          <span className="text-sm font-semibold text-verde opacity-0 group-hover:opacity-100 transition-opacity">
                            Ver detalle →
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(match.date).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
                <p className="text-gray-500 text-lg">📭 No hay próximos partidos programados.</p>
              </div>
            )}
          </div>
        </section>

        {/* ÚLTIMOS RESULTADOS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          <div className="flex items-end justify-between mb-8 md:mb-14">
            <div>
              <p className="text-verde text-sm font-semibold uppercase tracking-widest mb-2">Resultados</p>
              <h2 className="font-display text-4xl md:text-5xl text-oscuro leading-tight">Últimos Resultados</h2>
            </div>
            <Link
              href="/fixture?tab=resultados"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-verde hover:text-verde-oscuro transition-colors focus:outline-none focus:ring-2 focus:ring-verde rounded px-3 py-2"
            >
              Ver todos <span aria-hidden="true">→</span>
            </Link>
          </div>

          {lastResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {lastResults.map((match) => {
                const homeIsCuriyu = isCuriyu(match.homeTeam);
                const awayIsCuriyu = isCuriyu(match.awayTeam);
                let resultText = "";
                if (homeIsCuriyu || awayIsCuriyu) {
                  const curiyuScore = homeIsCuriyu ? match.homeScore : match.awayScore;
                  const opponentScore = homeIsCuriyu ? match.awayScore : match.homeScore;
                  if (curiyuScore > opponentScore) resultText = "Victoria";
                  else if (curiyuScore < opponentScore) resultText = "Derrota";
                  else resultText = "Empate";
                }
                return (
                  <article
                    key={match.id}
                    className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group"
                  >
                    <div className="relative h-36 sm:h-40 w-full">
                      <Image
                        src={
                          match.imageUrl && match.imageUrl !== ""
                            ? match.imageUrl
                            : match.finished
                              ? "/fin.png"
                              : "/proximo.png"
                        }
                        alt={`${match.homeTeam} vs ${match.awayTeam}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                        <span className="text-white text-xs font-semibold uppercase tracking-wide drop-shadow">
                          {match.sport === "rugby" ? "🏉 Rugby" : "🏑 Hockey"}
                        </span>
                        <span className="text-white/90 text-xs bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                          {formatDate(match.date)}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-center flex-1">
                          <p className="font-semibold text-oscuro text-sm sm:text-base truncate">
                            {match.homeTeam}
                          </p>
                          <span
                            className={`inline-block mt-1 text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full ${homeIsCuriyu
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                              }`}
                          >
                            Local
                          </span>
                        </div>
                        <div className="px-3 sm:px-4">
                          <p className="text-2xl sm:text-3xl font-black tracking-tight">
                            {homeIsCuriyu ? (
                              <span className="text-green-600">{match.homeScore}</span>
                            ) : (
                              <span className="text-gray-900">{match.homeScore}</span>
                            )}
                            <span className="text-gray-300 mx-1">-</span>
                            {awayIsCuriyu ? (
                              <span className="text-green-600">{match.awayScore}</span>
                            ) : (
                              <span className="text-gray-900">{match.awayScore}</span>
                            )}
                          </p>
                        </div>
                        <div className="text-center flex-1">
                          <p className="font-semibold text-oscuro text-sm sm:text-base truncate">
                            {match.awayTeam}
                          </p>
                          <span
                            className={`inline-block mt-1 text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full ${awayIsCuriyu
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                              }`}
                          >
                            Visita
                          </span>
                        </div>
                      </div>
                      {resultText && (
                        <div className="mt-auto">
                          <span
                            className={[
                              "inline-block text-xs font-bold px-4 py-1.5 rounded-full",
                              resultText === "Victoria" && "bg-green-100 text-green-700",
                              resultText === "Derrota" && "bg-red-100 text-red-700",
                              resultText === "Empate" && "bg-gray-100 text-gray-700",
                            ].join(" ")}
                          >
                            {resultText}
                          </span>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
              <p className="text-gray-500 text-lg">📭 No hay resultados recientes.</p>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/fixture"
              className="inline-flex items-center gap-2 text-sm font-semibold text-verde px-4 py-2 rounded-full border border-verde/30 hover:bg-verde/5 transition-colors"
            >
              Ver fixture completo <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* HISTORIA BREVE */}
        <section className="bg-gradient-to-b from-white to-verde-suave/30 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-verde text-sm font-semibold uppercase tracking-widest mb-3">
                  Nuestra historia
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-oscuro mb-6 leading-tight">
                  Más de 20 años <br />siendo una familia
                </h2>
                <p className="text-gray-600 leading-relaxed mb-8 text-base md:text-lg">
                  Fundado en Chajarí, Entre Ríos, el Club Curiyú es una institución deportiva y social
                  que forma personas a través del rugby y el hockey. Con cientos de socios, es un espacio
                  de contención, valores y comunidad.
                </p>
                <Link
                  href="/historia"
                  className="inline-flex items-center gap-2 bg-verde text-white font-semibold py-3 px-8 rounded-full hover:bg-verde-oscuro transition-all hover:shadow-xl hover:gap-3 focus:outline-none focus:ring-2 focus:ring-verde focus:ring-offset-2"
                >
                  Leer más <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="order-1 lg:order-2 relative">
                <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-2xl group">
                  <Image
                    src="https://i.ibb.co/rKbvLsBx/70fd63d6-896d-4190-9094-6b201e4345bc.jpg"
                    alt="Instalaciones del Club Curiyú"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-verde/10 rounded-full blur-2xl -z-10" />
                <div className="absolute -top-5 -right-5 w-32 h-32 bg-verde/20 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}