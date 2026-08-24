// src/app/admin/page.jsx
import { adminDb } from "@/lib/firebase/admin";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    // Obtenemos todos los partidos
    let partidos = [];
    try {
        const snapshot = await adminDb.collection("matches").orderBy("date", "desc").get();
        partidos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error cargando partidos:", error);
    }

    // Solo partidos finalizados
    const finished = partidos.filter(p => p.finished === true);
    const totalPartidos = finished.length;

    // Contadores generales
    let ganados = 0;
    let perdidos = 0;
    let empatados = 0;

    // Estadísticas a favor (CURIYU es el equipo local)
    let puntosAFavor = 0;
    let triesAFavor = 0;
    let conversionesAFavor = 0;
    let penalesAFavor = 0;
    let tryPenalAFavor = 0;

    // Estadísticas en contra (Rival es el visitante)
    let puntosEnContra = 0;
    let triesEnContra = 0;
    let conversionesEnContra = 0;
    let penalesEnContra = 0;
    let tryPenalEnContra = 0;

    finished.forEach(p => {
        const local = p.homeScore || 0;
        const visita = p.awayScore || 0;

        // Puntos
        puntosAFavor += local;
        puntosEnContra += visita;

        // Tries
        triesAFavor += (p.homeTries || 0);
        triesEnContra += (p.awayTries || 0);

        // Conversiones
        conversionesAFavor += (p.homeConversions || 0);
        conversionesEnContra += (p.awayConversions || 0);

        // Penales
        penalesAFavor += (p.homePenalties || 0);
        penalesEnContra += (p.awayPenalties || 0);

        // Try Penal
        tryPenalAFavor += (p.homeTryPenalties || 0);
        tryPenalEnContra += (p.awayTryPenalties || 0);

        // Resultado (CURIYU es el equipo local)
        if (local > visita) {
            ganados++;
        } else if (local < visita) {
            perdidos++;
        } else {
            empatados++;
        }
    });

    // Tasa de victoria (evitamos división por cero)
    const tasaVictoria = totalPartidos > 0 ? Math.round((ganados / totalPartidos) * 100) : 0;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-oscuro">Dashboard</h1>

            {/* Tarjetas principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <p className="text-sm text-gray-500">Partidos Jugados</p>
                    <p className="text-3xl font-bold text-verde">{totalPartidos}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <p className="text-sm text-gray-500">Ganados</p>
                    <p className="text-3xl font-bold text-green-600">{ganados}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <p className="text-sm text-gray-500">Perdidos</p>
                    <p className="text-3xl font-bold text-red-600">{perdidos}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <p className="text-sm text-gray-500">Tasa de Victoria</p>
                    <p className="text-3xl font-bold text-blue-600">{tasaVictoria}%</p>
                </div>
            </div>

            {/* Puntos Totales */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
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
            </div>

            {/* Estadísticas de Juego (Tries, Conversiones, Penales, Try Penal) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* A FAVOR */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
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
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
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