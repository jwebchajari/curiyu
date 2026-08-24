// src/app/page.jsx
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

export default async function Home() {
  // Obtener noticias
  const allNews = await getAllNews();
  const latestNews = allNews.slice(0, 3);

  // Obtener partidos desde Firestore
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

  // Separar finalizados y próximos
  const finishedMatches = matches
    .filter((m) => m.finished)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const upcomingMatches = matches
    .filter((m) => !m.finished)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Último partido finalizado (si existe)
  const lastFinishedMatch = finishedMatches[0] || null;

  // Próximos 3 partidos (incluye los de hoy)
  const nextMatches = upcomingMatches.slice(0, 3);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* HERO */}
        <section className="relative bg-verde text-white py-20 md:py-36 text-center px-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: "url('/foto-club.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-verde/70 via-verde/60 to-verde/80" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <p className="text-verde-claro uppercase tracking-widest text-sm font-medium mb-3">
              Chajarí, Entre Ríos · Argentina
            </p>
            <h1 className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl tracking-wide mb-4 text-white drop-shadow-lg">
              CLUB CURIYÚ
            </h1>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/rugby"
                className="bg-white text-verde font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-white"
              >
                Rugby
              </Link>
              <Link
                href="/hockey"
                className="border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-verde transition-all hover:scale-105 shadow-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-white"
              >
                Hockey
              </Link>
            </div>
          </div>
        </section>

        {/* ÚLTIMAS NOTICIAS */}
        <section className="max-w-6xl mx-auto px-4 py-12 md:py-16 w-full">
          <div className="flex items-center justify-between mb-6 md:mb-10">
            <h2 className="font-display text-3xl md:text-5xl text-verde">Últimas Noticias</h2>
            <Link
              href="/noticias"
              className="text-sm text-verde font-semibold hover:underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-verde rounded"
            >
              Ver todas <span aria-hidden="true">→</span>
            </Link>
          </div>

          {latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {latestNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/noticias/${item.slug || item.id}`}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 block focus:outline-none focus:ring-2 focus:ring-verde"
                >
                  <div className="relative h-48 bg-gradient-to-br from-verde-suave to-verde/30 flex items-center justify-center">
                    {item.coverImageUrl ? (
                      <Image
                        src={item.coverImageUrl}
                        alt={item.title || "Noticia"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <span className="text-5xl opacity-50">📰</span>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-white/80 backdrop-blur-sm text-verde text-xs font-bold px-3 py-1 rounded-full">
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="font-bold text-oscuro text-lg sm:text-xl mb-2 group-hover:text-verde transition-colors line-clamp-2">
                      {item.title || "Sin título"}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                      {item.excerpt || "Sin descripción disponible."}
                    </p>
                    <span className="mt-4 inline-block text-verde font-semibold text-sm group-hover:underline">
                      Leer más →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 text-center">
              <p className="text-gray-500 text-lg">📭 No hay noticias publicadas aún.</p>
            </div>
          )}
        </section>

        {/* PARTIDOS: último resultado y próximos */}
        <section className="bg-verde-suave py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 w-full">
            <div className="flex items-center justify-between mb-6 md:mb-10">
              <h2 className="font-display text-3xl md:text-5xl text-verde">Partidos</h2>
              <Link
                href="/fixture"
                className="text-sm text-verde font-semibold hover:underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-verde rounded"
              >
                Ver fixture <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* Resultado del último partido finalizado */}
            {lastFinishedMatch && (
              <div className="mb-8 bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Último resultado
                </p>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="text-lg sm:text-xl font-bold text-oscuro">
                    {lastFinishedMatch.homeTeam} {lastFinishedMatch.homeScore} - {lastFinishedMatch.awayScore} {lastFinishedMatch.awayTeam}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(lastFinishedMatch.date)}
                  </span>
                </div>
              </div>
            )}

            {/* Próximos partidos */}
            {nextMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {nextMatches.map((match) => (
                  <Link
                    key={match.id}
                    href="/fixture"
                    className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col gap-3 border border-gray-100 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-verde"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-bold text-verde bg-verde-suave px-3 py-1 rounded-full">
                        {match.category || "Partido"}
                      </span>
                      {isToday(match.date) ? (
                        <span className="text-xs font-bold text-white bg-yellow-500 px-3 py-1 rounded-full">
                          HOY
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">
                          {formatDate(match.date)}
                        </span>
                      )}
                    </div>
                    <p className="text-oscuro font-bold text-xl">
                      {match.homeTeam} vs {match.awayTeam}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <span>🏉</span>
                      {match.sport || "Rugby"} · {match.category || "General"}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
                <p className="text-gray-500 text-lg">📭 No hay próximos partidos programados.</p>
              </div>
            )}
          </div>
        </section>

        {/* HISTORIA BREVE */}
        <section className="max-w-6xl mx-auto px-4 py-12 md:py-16 w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <p className="text-verde text-sm font-semibold uppercase tracking-widest mb-2">
              Nuestra historia
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-oscuro mb-5 leading-tight">
              Más de 20 años <br />siendo una familia
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Fundado en Chajarí, Entre Ríos, el Club Curiyú es una institución deportiva y social
              que forma personas a través del rugby y el hockey. Con cientos de socios, es un espacio
              de contención, valores y comunidad.
            </p>
            <Link
              href="/historia"
              className="inline-block bg-verde text-white font-semibold py-3 px-8 rounded-full hover:bg-verde-oscuro transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-verde focus:ring-offset-2"
            >
              Leer más
            </Link>
          </div>
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://i.ibb.co/rKbvLsBx/70fd63d6-896d-4190-9094-6b201e4345bc.jpg"
              alt="Instalaciones del Club Curiyú"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}