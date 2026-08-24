// src/components/admin/FixtureManager.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import {
    createMatchAction,
    updateMatchResultAction,
    deleteMatchAction,
    bulkCreateMatchesAction
} from "@/app/admin/fixture/actions";

// Sub-componente para el formulario interactivo de cada partido
function MatchResultForm({ match }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [homeTries, setHomeTries] = useState(match.homeTries || 0);
    const [homeConversions, setHomeConversions] = useState(match.homeConversions || 0);
    const [homePenalties, setHomePenalties] = useState(match.homePenalties || 0);
    const [homeTryPenalties, setHomeTryPenalties] = useState(match.homeTryPenalties || 0);

    const [awayTries, setAwayTries] = useState(match.awayTries || 0);
    const [awayConversions, setAwayConversions] = useState(match.awayConversions || 0);
    const [awayPenalties, setAwayPenalties] = useState(match.awayPenalties || 0);
    const [awayTryPenalties, setAwayTryPenalties] = useState(match.awayTryPenalties || 0);

    const homeScore = (homeTries * 5) + (homeConversions * 2) + (homePenalties * 3) + (homeTryPenalties * 8);
    const awayScore = (awayTries * 5) + (awayConversions * 2) + (awayPenalties * 3) + (awayTryPenalties * 8);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await updateMatchResultAction(match.id, {
            homeScore,
            awayScore,
            homeTries,
            awayTries,
            homeConversions,
            awayConversions,
            homePenalties,
            awayPenalties,
            homeTryPenalties,
            awayTryPenalties,
            finished: true
        });

        setIsSubmitting(false);
        if (result?.success) router.refresh();
        else alert(result?.error || "Error al guardar");
    };

    const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-verde";

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Columna Local */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-bold text-oscuro mb-3 text-lg text-center border-b pb-2">{match.homeTeam}</h4>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                            <label className="text-sm font-medium text-gray-600">Tries (5 pts)</label>
                            <input type="number" min="0" value={homeTries} onChange={(e) => setHomeTries(parseInt(e.target.value) || 0)} className={inputClass} />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <label className="text-sm font-medium text-gray-600">Conversiones (2 pts)</label>
                            <input type="number" min="0" value={homeConversions} onChange={(e) => setHomeConversions(parseInt(e.target.value) || 0)} className={inputClass} />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <label className="text-sm font-medium text-gray-600">Penales (3 pts)</label>
                            <input type="number" min="0" value={homePenalties} onChange={(e) => setHomePenalties(parseInt(e.target.value) || 0)} className={inputClass} />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <label className="text-sm font-medium text-gray-600">Try Penal (8 pts)</label>
                            <input type="number" min="0" value={homeTryPenalties} onChange={(e) => setHomeTryPenalties(parseInt(e.target.value) || 0)} className={inputClass} />
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-200 text-center">
                            <span className="text-sm text-gray-500">Puntaje Total</span>
                            <p className="text-3xl font-bold text-verde">{homeScore}</p>
                        </div>
                    </div>
                </div>

                {/* Columna Visitante */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-bold text-oscuro mb-3 text-lg text-center border-b pb-2">{match.awayTeam}</h4>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                            <label className="text-sm font-medium text-gray-600">Tries (5 pts)</label>
                            <input type="number" min="0" value={awayTries} onChange={(e) => setAwayTries(parseInt(e.target.value) || 0)} className={inputClass} />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <label className="text-sm font-medium text-gray-600">Conversiones (2 pts)</label>
                            <input type="number" min="0" value={awayConversions} onChange={(e) => setAwayConversions(parseInt(e.target.value) || 0)} className={inputClass} />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <label className="text-sm font-medium text-gray-600">Penales (3 pts)</label>
                            <input type="number" min="0" value={awayPenalties} onChange={(e) => setAwayPenalties(parseInt(e.target.value) || 0)} className={inputClass} />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <label className="text-sm font-medium text-gray-600">Try Penal (8 pts)</label>
                            <input type="number" min="0" value={awayTryPenalties} onChange={(e) => setAwayTryPenalties(parseInt(e.target.value) || 0)} className={inputClass} />
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-200 text-center">
                            <span className="text-sm text-gray-500">Puntaje Total</span>
                            <p className="text-3xl font-bold text-verde">{awayScore}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-3">
                <p className="text-xs text-gray-500">El partido se marcará como finalizado al guardar.</p>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-verde text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-verde-oscuro transition disabled:opacity-50"
                >
                    {isSubmitting ? "Guardando..." : "Guardar Resultado Final"}
                </button>
            </div>
        </form>
    );
}

export default function FixtureManager({ matches }) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [expandedMatches, setExpandedMatches] = useState([]);

    const sortedMatches = [...matches].sort((a, b) => new Date(a.date) - new Date(b.date));
    const nextMatch = sortedMatches.find(m => !m.finished);

    const handleCreate = async (formData) => {
        const res = await createMatchAction(formData);
        if (res?.success) router.refresh();
        else setError(res.error);
    };

    const handleDelete = async (matchId) => {
        if (confirm("¿Eliminar este partido?")) {
            await deleteMatchAction(matchId);
            router.refresh();
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const matchesArray = jsonData.map(row => ({
                homeTeam: row["Equipo Local"],
                awayTeam: row["Equipo Visitante"],
                category: row["Categoría"] || "General",
                sport: row["Deporte (rugby/hockey)"]?.toLowerCase() || "rugby",
                date: row["Fecha (AAAA-MM-DD)"]
            }));

            const res = await bulkCreateMatchesAction(matchesArray);
            if (res?.success) {
                alert(`¡${res.count} partidos cargados correctamente!`);
                router.refresh();
            } else {
                alert(res?.error || "Error al cargar");
            }
        };
        reader.readAsArrayBuffer(file);
        e.target.value = "";
    };

    const toggleExpand = (matchId) => {
        setExpandedMatches(prev =>
            prev.includes(matchId) ? prev.filter(id => id !== matchId) : [...prev, matchId]
        );
    };

    return (
        <div className="space-y-8">
            {/* Zona de Subida de Excel */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="font-bold text-lg mb-3">📥 Carga Masiva por Excel</h3>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <a href="/api/fixture/template" download className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-700">
                        ⬇️ Descargar Plantilla
                    </a>
                    <span className="text-gray-400">o</span>
                    <label className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold cursor-pointer hover:bg-green-700">
                        📤 Subir Torneo Completo
                        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" />
                    </label>
                </div>
            </div>

            {/* Formulario manual */}
            <form action={handleCreate} className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-5 gap-4">
                <input name="homeTeam" placeholder="Equipo Local" required className="border border-gray-300 rounded-lg px-3 py-2" />
                <input name="awayTeam" placeholder="Equipo Visitante" required className="border border-gray-300 rounded-lg px-3 py-2" />
                <input name="category" placeholder="Categoría" className="border border-gray-300 rounded-lg px-3 py-2" />
                <input name="date" type="date" required className="border border-gray-300 rounded-lg px-3 py-2" />
                <select name="sport" className="border border-gray-300 rounded-lg px-3 py-2">
                    <option value="rugby">Rugby</option>
                    <option value="hockey">Hockey</option>
                </select>
                <button type="submit" className="bg-verde text-white px-4 py-2 rounded-full col-span-5">+ Crear Partido</button>
                {error && <p className="text-red-500 col-span-5">{error}</p>}
            </form>

            {/* Próximo Partido Destacado */}
            {nextMatch && (
                <div className="bg-verde text-white p-6 rounded-xl shadow-lg border-2 border-white">
                    <h2 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">🔜 Próximo Partido</h2>
                    <p className="text-2xl font-bold">
                        {nextMatch.homeTeam} <span className="text-verde-claro">vs</span> {nextMatch.awayTeam}
                    </p>
                    <p className="text-sm opacity-90 mt-1">
                        📅 {new Date(nextMatch.date).toLocaleDateString("es-AR", { weekday: 'long', day: 'numeric', month: 'long' })}
                        {" "}· {nextMatch.category} · {nextMatch.sport}
                    </p>
                </div>
            )}

            {/* Lista de Partidos (Ocultos si están finalizados) */}
            <div className="space-y-4">
                {sortedMatches.map(match => {
                    const isFinished = match.finished;
                    const isExpanded = expandedMatches.includes(match.id);

                    return (
                        <div key={match.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">
                                        {match.homeTeam} <span className="text-gray-400">vs</span> {match.awayTeam}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {new Date(match.date).toLocaleDateString("es-AR")} · {match.category}
                                    </p>
                                </div>

                                {isFinished ? (
                                    <div className="flex items-center gap-3">
                                        <span className="text-verde font-bold">Final: {match.homeScore} - {match.awayScore}</span>
                                        <button
                                            onClick={() => toggleExpand(match.id)}
                                            className="text-blue-600 hover:underline text-sm font-medium"
                                        >
                                            {isExpanded ? "Ocultar" : "Ver más"}
                                        </button>
                                        <button onClick={() => handleDelete(match.id)} className="text-red-600 text-sm">Eliminar</button>
                                    </div>
                                ) : (
                                    <button onClick={() => handleDelete(match.id)} className="text-red-600 text-sm">Eliminar</button>
                                )}
                            </div>

                            {(!isFinished || isExpanded) && (
                                <div className="mt-4">
                                    <MatchResultForm match={match} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}