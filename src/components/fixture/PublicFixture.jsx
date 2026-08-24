// src/components/fixture/PublicFixture.jsx
"use client";

import { useMemo, useState } from "react";

// ---------- Utilidades ----------
const isToday = (date) => {
    const today = new Date();
    const d = new Date(date);
    return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
    );
};

const formatDate = (dateStr) => {
    if (!dateStr) return "Fecha no disponible";
    return new Date(dateStr).toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

// ---------- Función para inferir gender/level si no existen ----------
const inferGenderAndLevel = (match) => {
    let gender = match.gender;
    let level = match.level;
    const cat = (match.category || "").toLowerCase();

    if (!gender) {
        if (cat.includes("femenino") || cat.includes("femenina")) gender = "Femenino";
        else if (cat.includes("masculino")) gender = "Masculino";
        else gender = "Mixto"; // o "No definido"
    }

    if (!level) {
        if (cat.includes("primera")) level = "Primera";
        else if (cat.includes("juvenil")) level = "Juveniles";
        else if (cat.includes("infantil")) level = "Infantiles";
        else if (cat.includes("veterano") || cat.includes("veterana")) level = "Veteranos";
        else level = "General";
    }

    return { gender, level };
};

// ---------- Componente ----------
export default function PublicFixture({ matches }) {
    const [activeTab, setActiveTab] = useState("proximos");
    const [sport, setSport] = useState("todos");
    const [gender, setGender] = useState("todos");
    const [level, setLevel] = useState("todos");

    // Normalizar matches con gender/level inferidos
    const normalizedMatches = useMemo(() => {
        return matches.map((m) => {
            const { gender: g, level: l } = inferGenderAndLevel(m);
            return { ...m, gender: g, level: l };
        });
    }, [matches]);

    const sports = useMemo(() => {
        const set = new Set(normalizedMatches.map((m) => m.sport).filter(Boolean));
        return ["todos", ...Array.from(set)];
    }, [normalizedMatches]);

    const genders = useMemo(() => {
        const set = new Set(normalizedMatches.map((m) => m.gender).filter(Boolean));
        return ["todos", ...Array.from(set)];
    }, [normalizedMatches]);

    const levels = useMemo(() => {
        const set = new Set(normalizedMatches.map((m) => m.level).filter(Boolean));
        return ["todos", ...Array.from(set)];
    }, [normalizedMatches]);

    const proximos = useMemo(
        () =>
            normalizedMatches
                .filter((m) => !m.finished)
                .sort((a, b) => new Date(a.date) - new Date(b.date)),
        [normalizedMatches]
    );

    const finalizados = useMemo(
        () =>
            normalizedMatches
                .filter((m) => m.finished)
                .sort((a, b) => new Date(b.date) - new Date(a.date)),
        [normalizedMatches]
    );

    const baseList = activeTab === "proximos" ? proximos : finalizados;

    const filteredList = useMemo(() => {
        return baseList.filter((m) => {
            const matchesSport = sport === "todos" || m.sport === sport;
            const matchesGender = gender === "todos" || m.gender === gender;
            const matchesLevel = level === "todos" || m.level === level;
            return matchesSport && matchesGender && matchesLevel;
        });
    }, [baseList, sport, gender, level]);

    const todayMatches = useMemo(
        () => proximos.filter((m) => isToday(m.date)),
        [proximos]
    );

    const tabButtonClass = (tab) =>
        `px-4 sm:px-6 py-2.5 rounded-full text-sm sm:text-base font-bold transition ${activeTab === tab
            ? "bg-verde text-white shadow"
            : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
        }`;

    // Reset nivel y género cuando cambia deporte
    const handleSportChange = (e) => {
        setSport(e.target.value);
        setGender("todos");
        setLevel("todos");
    };

    const handleGenderChange = (e) => {
        setGender(e.target.value);
        setLevel("todos");
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Filtros jerárquicos */}
            <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <h2 className="font-semibold text-lg text-oscuro">Filtrar partidos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Deporte */}
                    <div>
                        <label htmlFor="sport" className="block text-sm font-medium text-gray-700 mb-1">
                            Deporte
                        </label>
                        <select
                            id="sport"
                            value={sport}
                            onChange={handleSportChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-verde"
                        >
                            <option value="todos">Todos los deportes</option>
                            {sports.filter(s => s !== "todos").map((s) => (
                                <option key={s} value={s}>
                                    {s === "rugby" ? "🏉 Rugby" : s === "hockey" ? "🏑 Hockey" : s}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Género */}
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                            Género
                        </label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={handleGenderChange}
                            disabled={sport === "todos"}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-verde disabled:bg-gray-100 disabled:text-gray-400"
                        >
                            <option value="todos">Todos</option>
                            {genders.filter(g => g !== "todos").map((g) => (
                                <option key={g} value={g}>
                                    {g}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Nivel */}
                    <div>
                        <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                            Nivel
                        </label>
                        <select
                            id="level"
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            disabled={gender === "todos"}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-verde disabled:bg-gray-100 disabled:text-gray-400"
                        >
                            <option value="todos">Todos</option>
                            {levels.filter(l => l !== "todos").map((l) => (
                                <option key={l} value={l}>
                                    {l}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Pestañas Próximos / Finalizados */}
            <div className="flex gap-2 sm:gap-3 flex-wrap">
                <button
                    onClick={() => setActiveTab("proximos")}
                    className={tabButtonClass("proximos")}
                >
                    Próximos ({proximos.length})
                </button>
                <button
                    onClick={() => setActiveTab("finalizados")}
                    className={tabButtonClass("finalizados")}
                >
                    Finalizados ({finalizados.length})
                </button>
            </div>

            {/* Bloque HOY (si hay partidos hoy y pestaña próximos) */}
            {activeTab === "proximos" && todayMatches.length > 0 && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 sm:p-5 rounded-r-xl">
                    <h2 className="font-bold text-yellow-800 text-lg sm:text-xl mb-3">
                        🔥 HOY
                    </h2>
                    <div className="space-y-3">
                        {todayMatches.map((match) => (
                            <div
                                key={match.id}
                                className="bg-white p-4 rounded-lg shadow-sm border border-yellow-200"
                            >
                                <p className="font-bold text-oscuro">
                                    {match.homeTeam} vs {match.awayTeam}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {formatDate(match.date)} · {match.category} · {match.sport}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Lista de partidos */}
            {filteredList.length === 0 ? (
                <p className="text-center text-gray-500 py-12">
                    No hay partidos {activeTab === "proximos" ? "próximos" : "finalizados"} con esos filtros.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {filteredList.map((match) => (
                        <div
                            key={match.id}
                            className={`bg-white rounded-2xl p-5 sm:p-6 shadow-md border ${isToday(match.date) && !match.finished
                                ? "border-yellow-400"
                                : "border-gray-100"
                                }`}
                        >
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                {!match.finished && isToday(match.date) && (
                                    <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        HOY
                                    </span>
                                )}
                                <span className="text-xs bg-verde-suave text-verde px-2 py-1 rounded-full font-medium">
                                    {match.sport === "rugby" ? "🏉 Rugby" : "🏑 Hockey"}
                                </span>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                    {match.gender}
                                </span>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                    {match.level}
                                </span>
                            </div>

                            <p className="font-bold text-oscuro text-lg sm:text-xl">
                                {match.homeTeam} vs {match.awayTeam}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {formatDate(match.date)}
                            </p>
                            <p className="text-sm text-gray-500">
                                {match.category} · {match.sport}
                            </p>

                            {match.finished ? (
                                <div className="mt-3 flex items-center gap-3">
                                    <span className="text-verde font-bold text-xl">
                                        {match.homeScore} - {match.awayScore}
                                    </span>
                                    <span className="text-xs bg-verde-suave text-verde px-2 py-1 rounded-full">
                                        Finalizado
                                    </span>
                                </div>
                            ) : (
                                <div className="mt-3">
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                        Por jugarse
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}