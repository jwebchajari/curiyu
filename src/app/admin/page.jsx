// src/app/admin/page.jsx
import { adminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

// Función para identificar si un equipo es Curiyú
const CURIYU_NAMES = ["curiyú", "curiyu", "club curiyú"];

function isCuriyu(teamName) {
    if (!teamName) return false;
    const name = teamName.toLowerCase();
    return CURIYU_NAMES.some((curiyuName) => name.includes(curiyuName));
}

export default async function AdminDashboard() {
    let partidos = [];
    try {
        const snapshot = await adminDb.collection("matches").orderBy("date", "desc").get();
        partidos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error cargando partidos:", error);
    }

    // Solo partidos finalizados donde juega Curiyú (local o visitante)
    const finished = partidos.filter((p) => p.finished === true);

    // Inicializar contadores
    let totalPartidos = 0;
    let ganados = 0;
    let perdidos = 0;
    let empatados = 0;

    // Estadísticas de Curiyú (identificando si es local o visitante)
    let puntosAFavor = 0;
    let puntosEnContra = 0;
    let triesAFavor = 0;
    let triesEnContra = 0;
    let conversionesAFavor = 0;
    let conversionesEnContra = 0;
    let penalesAFavor = 0;
    let penalesEnContra = 0;
    let tryPenalAFavor = 0;
    let tryPenalEnContra = 0;

    finished.forEach((p) => {
        const homeIsCuriyu = isCuriyu(p.homeTeam);
        const awayIsCuriyu = isCuriyu(p.awayTeam);

        // Solo contar si Curiyú participa
        if (!homeIsCuriyu && !awayIsCuriyu) return;

        totalPartidos++;

        // Puntos de Curiyú y Rival
        const curiyuScore = homeIsCuriyu ? p.homeScore || 0 : p.awayScore || 0;
        const rivalScore = homeIsCuriyu ? p.awayScore || 0 : p.homeScore || 0;

        // Estadísticas de Curiyú
        const curiyuTries = homeIsCuriyu ? p.homeTries || 0 : p.awayTries || 0;
        const curiyuConversions = homeIsCuriyu ? p.homeConversions || 0 : p.awayConversions || 0;
        const curiyuPenalties = homeIsCuriyu ? p.homePenalties || 0 : p.awayPenalties || 0;
        const curiyuTryPenalties = homeIsCuriyu ? p.homeTryPenalties || 0 : p.awayTryPenalties || 0;

        // Estadísticas del Rival
        const rivalTries = homeIsCuriyu ? p.awayTries || 0 : p.homeTries || 0;
        const rivalConversions = homeIsCuriyu ? p.awayConversions || 0 : p.homeConversions || 0;
        const rivalPenalties = homeIsCuriyu ? p.awayPenalties || 0 : p.homePenalties || 0;
        const rivalTryPenalties = homeIsCuriyu ? p.awayTryPenalties || 0 : p.homeTryPenalties || 0;

        // Acumular puntos
        puntosAFavor += curiyuScore;
        puntosEnContra += rivalScore;

        // Acumular estadísticas
        triesAFavor += curiyuTries;
        triesEnContra += rivalTries;
        conversionesAFavor += curiyuConversions;
        conversionesEnContra += rivalConversions;
        penalesAFavor += curiyuPenalties;
        penalesEnContra += rivalPenalties;
        tryPenalAFavor += curiyuTryPenalties;
        tryPenalEnContra += rivalTryPenalties;

        // Resultado
        if (curiyuScore > rivalScore) ganados++;
        else if (curiyuScore < rivalScore) perdidos++;
        else empatados++;
    });

    const tasaVictoria = totalPartidos > 0 ? Math.round((ganados / totalPartidos) * 100) : 0;

    return (
        <div className="space-y-6 sm:space-y-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Dashboard</h1>

            {/* Tarjetas principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-100">
                    <p className="text-sm text-gray-500">Partidos Jugados</p>
                    <p className="text-2xl sm:text-3xl font-bold text-verde">{totalPartidos}</p>
                </div>
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-100">
                    <p className="text-sm text-gray-500">Ganados</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">{ganados}</p>
                </div>
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-100">
                    <p className="text-sm text-gray-500">Perdidos</p>
                    <p className="text-2xl sm:text-3xl font-bold text-red-600">{perdidos}</p>
                </div>
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-100">
                    <p className="text-sm text-gray-500">Empatados</p>
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{empatados}</p>
                </div>
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-100">
                    <p className="text-sm text-gray-500">Tasa de Victoria</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">{tasaVictoria}%</p>
                </div>
            </div>

            {/* Puntos Totales */}
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-100">
                <h2 className="text-xl font-bold mb-4">Puntos Totales</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">A favor</p>
                        <p className="text-2xl font-bold text-verde">{puntosAFavor}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">En contra</p>
                        <p className="text-2xl font-bold text-red-600">{puntosEnContra}</p>
                    </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                    Diferencia: <span className="font-bold">{puntosAFavor - puntosEnContra}</span>
                </div>
            </div>

            {/* Estadísticas de Juego */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* A FAVOR */}
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-verde mb-4">📊 A Favor</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between border-b pb-2">
                            <span>Tries</span>
                            <span className="font-bold">{triesAFavor}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span>Conversiones</span>
                            <span className="font-bold">{conversionesAFavor}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span>Penales</span>
                            <span className="font-bold">{penalesAFavor}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Try Penal</span>
                            <span className="font-bold">{tryPenalAFavor}</span>
                        </div>
                    </div>
                </div>

                {/* EN CONTRA */}
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-red-600 mb-4">📉 En Contra</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between border-b pb-2">
                            <span>Tries</span>
                            <span className="font-bold">{triesEnContra}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span>Conversiones</span>
                            <span className="font-bold">{conversionesEnContra}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span>Penales</span>
                            <span className="font-bold">{penalesEnContra}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Try Penal</span>
                            <span className="font-bold">{tryPenalEnContra}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}