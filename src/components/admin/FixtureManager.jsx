//src/components/admin/FixtureManager.jsx
"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import ConfirmModal from "@/components/admin/ConfirmModal";
import {
    createMatchAction,
    updateMatchResultAction,
    deleteMatchAction,
    bulkCreateMatchesAction,
} from "@/app/admin/fixture/actions";

// ---------- Utilidades ----------
function isToday(date) {
    const today = new Date();
    const d = new Date(date);
    return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
    );
}

function parseExcelDate(value) {
    if (!value) return new Date();
    if (value instanceof Date && !isNaN(value.getTime())) return value;
    if (typeof value === "number") {
        const excelEpoch = new Date(Date.UTC(1899, 11, 30));
        return new Date(excelEpoch.getTime() + value * 86400000);
    }
    if (typeof value === "string") {
        const trimmed = value.trim();
        const match = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
        if (match) {
            const [, day, month, year] = match;
            const d = new Date(Number(year), Number(month) - 1, Number(day));
            if (!isNaN(d.getTime())) return d;
        }
        const parsed = new Date(trimmed);
        if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
}

function inferGenderAndLevel(match) {
    let gender = match.gender;
    let level = match.level;
    const cat = (match.category || "").toLowerCase();

    if (!gender) {
        if (cat.includes("femenino") || cat.includes("femenina")) gender = "Femenino";
        else if (cat.includes("masculino")) gender = "Masculino";
        else gender = "Mixto";
    }
    if (!level) {
        if (cat.includes("primera")) level = "Primera";
        else if (cat.includes("juvenil")) level = "Juveniles";
        else if (cat.includes("infantil")) level = "Infantiles";
        else if (cat.includes("veterano") || cat.includes("veterana")) level = "Veteranos";
        else level = "General";
    }
    return { gender, level };
}

// ---------- Subcomponente: formulario de resultado ----------
function MatchResultForm({ match }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUrl, setImageUrl] = useState(match.imageUrl || "");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageError, setImageError] = useState("");
    const fileInputRef = useRef(null);

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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingImage(true);
        setImageError("");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

        try {
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

            if (!cloudName || !preset) {
                throw new Error("Faltan variables de entorno de Cloudinary");
            }

            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.secure_url && data.public_id) {
                // Construir URL optimizada con transformaciones:
                // - q_auto: calidad automática
                // - f_auto: formato automático (WebP si el navegador lo soporta)
                // - c_scale,w_800: redimensionar a 800px de ancho (se adapta al contenedor)
                const optimizedUrl = `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto,c_scale,w_800/${data.public_id}`;
                setImageUrl(optimizedUrl);
            } else {
                setImageError(data.error?.message || "Error al subir la imagen");
            }
        } catch (err) {
            setImageError(err.message || "Error al conectar con Cloudinary");
        } finally {
            setUploadingImage(false);
        }
    };

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
            imageUrl,
            finished: true,
        });
        setIsSubmitting(false);
        if (result?.success) router.refresh();
        else alert(result?.error || "Error al guardar");
    };

    const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-center text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde transition";

    return (
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Local */}
                <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm">
                    <h4 className="font-bold text-oscuro mb-4 text-lg sm:text-xl text-center border-b pb-2">{match.homeTeam}</h4>
                    <div className="space-y-4">
                        {[
                            { label: "Tries (5 pts)", value: homeTries, setter: setHomeTries },
                            { label: "Conversiones (2 pts)", value: homeConversions, setter: setHomeConversions },
                            { label: "Penales (3 pts)", value: homePenalties, setter: setHomePenalties },
                            { label: "Try Penal (8 pts)", value: homeTryPenalties, setter: setHomeTryPenalties },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-600">{item.label}</label>
                                <input type="number" min="0" value={item.value} onChange={(e) => item.setter(parseInt(e.target.value) || 0)} className={inputClass} />
                            </div>
                        ))}
                        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                            <span className="text-sm text-gray-500">Puntaje Total</span>
                            <p className="text-2xl sm:text-3xl font-bold text-verde">{homeScore}</p>
                        </div>
                    </div>
                </div>

                {/* Visitante */}
                <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm">
                    <h4 className="font-bold text-oscuro mb-4 text-lg sm:text-xl text-center border-b pb-2">{match.awayTeam}</h4>
                    <div className="space-y-4">
                        {[
                            { label: "Tries (5 pts)", value: awayTries, setter: setAwayTries },
                            { label: "Conversiones (2 pts)", value: awayConversions, setter: setAwayConversions },
                            { label: "Penales (3 pts)", value: awayPenalties, setter: setAwayPenalties },
                            { label: "Try Penal (8 pts)", value: awayTryPenalties, setter: setAwayTryPenalties },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-600">{item.label}</label>
                                <input type="number" min="0" value={item.value} onChange={(e) => item.setter(parseInt(e.target.value) || 0)} className={inputClass} />
                            </div>
                        ))}
                        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                            <span className="text-sm text-gray-500">Puntaje Total</span>
                            <p className="text-2xl sm:text-3xl font-bold text-verde">{awayScore}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subida de Imagen con conversión a WebP */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">📸 Foto del Partido (opcional, se convertirá a WebP)</label>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                    >
                        {uploadingImage ? "Subiendo..." : "Subir imagen"}
                    </button>
                    <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
                    {imageUrl && (
                        <img src={imageUrl} alt="Foto del partido" className="h-16 w-24 object-cover rounded-lg border border-gray-200" />
                    )}
                </div>
                {imageError && <p className="mt-2 text-red-500 text-sm">{imageError}</p>}
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-2">
                <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">El partido se marcará como finalizado al guardar.</p>
                <button type="submit" disabled={isSubmitting || uploadingImage} className="w-full sm:w-auto bg-verde text-white px-6 sm:px-8 py-3 rounded-full font-bold shadow-lg hover:bg-verde-oscuro transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
                    {isSubmitting ? "Guardando..." : "Guardar Resultado Final"}
                </button>
            </div>
        </form>
    );
}

// ---------- Fila de partido ----------
function MatchRow({ match, isExpanded, onToggle, onDelete }) {
    const isFinished = match.finished;

    return (
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold text-lg sm:text-xl">
                        {match.homeTeam} <span className="text-gray-400">vs</span> {match.awayTeam}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        📅 {new Date(match.date).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                        {" · "}<span className="uppercase">{match.sport}</span> · {match.gender} · {match.level}
                    </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    {isFinished && (
                        <span className="text-verde font-bold bg-verde/10 px-3 py-1 rounded-full text-sm">
                            {match.homeScore} - {match.awayScore}
                        </span>
                    )}
                    <button onClick={onToggle} className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-sm font-medium">
                        {isExpanded ? "Ocultar" : isFinished ? "Ver / Editar" : "Cargar resultado"}
                    </button>
                    <button onClick={onDelete} className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition text-sm font-medium">
                        Eliminar
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="mt-4 sm:mt-5">
                    <MatchResultForm match={match} />
                </div>
            )}
        </div>
    );
}

// ---------- Componente principal ----------
const PAGE_SIZE = 15;

export default function FixtureManager({ matches }) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [expandedMatches, setExpandedMatches] = useState([]);
    const [activeTab, setActiveTab] = useState("proximos");
    const [search, setSearch] = useState("");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [showManualForm, setShowManualForm] = useState(false);

    const [sportFilter, setSportFilter] = useState("todos");
    const [genderFilter, setGenderFilter] = useState("todos");
    const [levelFilter, setLevelFilter] = useState("todos");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [matchToDelete, setMatchToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const normalizedMatches = useMemo(() => {
        return matches.map((m) => {
            const { gender, level } = inferGenderAndLevel(m);
            return { ...m, gender, level };
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

    const proximos = useMemo(() => normalizedMatches.filter((m) => !m.finished).sort((a, b) => new Date(a.date) - new Date(b.date)), [normalizedMatches]);
    const finalizados = useMemo(() => normalizedMatches.filter((m) => m.finished).sort((a, b) => new Date(b.date) - new Date(a.date)), [normalizedMatches]);

    const baseList = activeTab === "proximos" ? proximos : finalizados;

    const filteredList = useMemo(() => {
        return baseList.filter((m) => {
            const matchesSport = sportFilter === "todos" || m.sport === sportFilter;
            const matchesGender = genderFilter === "todos" || m.gender === genderFilter;
            const matchesLevel = levelFilter === "todos" || m.level === levelFilter;
            const term = search.trim().toLowerCase();
            const matchesSearch = !term || m.homeTeam?.toLowerCase().includes(term) || m.awayTeam?.toLowerCase().includes(term);
            return matchesSport && matchesGender && matchesLevel && matchesSearch;
        });
    }, [baseList, sportFilter, genderFilter, levelFilter, search]);

    const visibleList = filteredList.slice(0, visibleCount);
    const todayMatches = useMemo(() => proximos.filter((m) => isToday(m.date)), [proximos]);
    const upcomingMatch = useMemo(() => {
        const now = new Date();
        return proximos.find((m) => !isToday(m.date) && new Date(m.date) > now) || null;
    }, [proximos]);

    const handleTabChange = (tab) => { setActiveTab(tab); setVisibleCount(PAGE_SIZE); setExpandedMatches([]); };
    const handleCreate = async (formData) => { const res = await createMatchAction(formData); if (res?.success) router.refresh(); else setError(res.error); };
    const handleDelete = (matchId) => { setMatchToDelete(matchId); setDeleteModalOpen(true); };
    const confirmDelete = async () => { if (!matchToDelete) return; setIsDeleting(true); try { await deleteMatchAction(matchToDelete); router.refresh(); setDeleteModalOpen(false); } catch (error) { setError("No se pudo eliminar el partido."); } finally { setIsDeleting(false); setMatchToDelete(null); } };

    // ---------- Plantilla descargable ----------
    const downloadTemplate = () => {
        const templateData = [
            { "Deporte (rugby/hockey)": "rugby", "Género": "Masculino", "Nivel": "Primera", "Equipo Local": "Curiyú", "Equipo Visitante": "Central", "Fecha (DD-MM-AAAA)": "15-03-2026" },
            { "Deporte (rugby/hockey)": "hockey", "Género": "Femenino", "Nivel": "Juveniles", "Equipo Local": "Curiyú", "Equipo Visitante": "Rowing", "Fecha (DD-MM-AAAA)": "22-03-2026" }
        ];
        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
        XLSX.writeFile(wb, "plantilla_fixture.xlsx");
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array", cellDates: true });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const matchesArray = jsonData.map((row) => {
                const rawDate = row["Fecha (DD-MM-AAAA)"];
                const category = row["Categoría"] || "General";
                const sport = row["Deporte (rugby/hockey)"]?.toLowerCase() || "rugby";
                const gender = row["Género"] || inferGenderAndLevel({ category }).gender;
                const level = row["Nivel"] || inferGenderAndLevel({ category }).level;
                return { homeTeam: row["Equipo Local"], awayTeam: row["Equipo Visitante"], category, sport, gender, level, date: parseExcelDate(rawDate) };
            });

            const res = await bulkCreateMatchesAction(matchesArray);
            if (res?.success) { alert(`¡${res.count} partidos cargados correctamente!`); router.refresh(); } else { alert(res?.error || "Error al cargar"); }
        };
        reader.readAsArrayBuffer(file);
        e.target.value = "";
    };

    const toggleExpand = (matchId) => {
        setExpandedMatches((prev) => prev.includes(matchId) ? prev.filter((id) => id !== matchId) : [...prev, matchId]);
    };

    const tabButtonClass = (tab) => `px-4 sm:px-6 py-2.5 rounded-full text-sm sm:text-base font-bold transition ${activeTab === tab ? "bg-verde text-white shadow" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"}`;
    const handleSportFilterChange = (e) => { setSportFilter(e.target.value); setGenderFilter("todos"); setLevelFilter("todos"); };
    const handleGenderFilterChange = (e) => { setGenderFilter(e.target.value); setLevelFilter("todos"); };

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg sm:text-xl mb-4">📥 Carga Masiva por Excel</h3>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                    <button onClick={downloadTemplate} className="w-full sm:w-auto inline-flex justify-center items-center bg-blue-600 text-white px-5 py-3 rounded-full text-sm sm:text-base font-bold hover:bg-blue-700 transition">⬇️ Descargar Plantilla</button>
                    <span className="text-gray-400 hidden sm:inline">o</span>
                    <label className="w-full sm:w-auto inline-flex justify-center items-center bg-green-600 text-white px-5 py-3 rounded-full text-sm sm:text-base font-bold cursor-pointer hover:bg-green-700 transition">📤 Subir Torneo Completo<input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" /></label>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <button onClick={() => setShowManualForm((v) => !v)} className="w-full text-left px-5 sm:px-6 py-4 font-bold flex justify-between items-center rounded-xl"><span className="text-base sm:text-lg">+ Cargar partido manual</span><span className="text-gray-400">{showManualForm ? "▲" : "▼"}</span></button>
                {showManualForm && (
                    <form action={handleCreate} className="p-5 sm:p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="homeTeam" placeholder="Equipo Local" required className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde" />
                        <input name="awayTeam" placeholder="Equipo Visitante" required className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde" />
                        <select name="sport" required className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde"><option value="">Deporte</option><option value="rugby">🏉 Rugby</option><option value="hockey">🏑 Hockey</option></select>
                        <select name="gender" required className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde"><option value="">Género</option><option value="Masculino">Masculino</option><option value="Femenino">Femenino</option><option value="Mixto">Mixto</option></select>
                        <select name="level" required className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde"><option value="">Nivel</option><option value="Primera">Primera</option><option value="Juveniles">Juveniles</option><option value="Infantiles">Infantiles</option><option value="Veteranos">Veteranos</option><option value="General">General</option></select>
                        <input name="category" placeholder="Categoría (opcional)" className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde" />
                        <input name="date" type="date" required className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde" />
                        <button type="submit" className="md:col-span-2 bg-verde text-white px-6 py-3 rounded-full font-bold hover:bg-verde-oscuro transition text-sm sm:text-base">+ Crear Partido</button>
                        {error && <p className="text-red-500 md:col-span-2 text-sm">{error}</p>}
                    </form>
                )}
            </div>

            {todayMatches.length > 0 && (<div className="bg-yellow-500 text-white p-5 sm:p-6 rounded-xl shadow-lg border-2 border-yellow-300"><h2 className="text-sm sm:text-base font-bold uppercase tracking-widest opacity-80 mb-2">🔥 HOY</h2>{todayMatches.map((match) => (<div key={match.id} className="mb-2 last:mb-0"><p className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">{match.homeTeam} <span className="text-yellow-100">vs</span> {match.awayTeam}</p><p className="text-sm sm:text-base opacity-90 mt-1">📅 {new Date(match.date).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })} {" "}· {match.sport} · {match.gender} · {match.level}</p></div>))}</div>)}

            {upcomingMatch && (<div className="bg-verde text-white p-5 sm:p-6 rounded-xl shadow-lg border-2 border-white"><h2 className="text-sm sm:text-base font-bold uppercase tracking-widest opacity-80 mb-2">🔜 Próximo Partido</h2><p className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">{upcomingMatch.homeTeam} <span className="text-verde-claro">vs</span> {upcomingMatch.awayTeam}</p><p className="text-sm sm:text-base opacity-90 mt-2">📅 {new Date(upcomingMatch.date).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })} {" "}· {upcomingMatch.sport} · {upcomingMatch.gender} · {upcomingMatch.level}</p></div>)}

            <div className="flex gap-2 sm:gap-3 flex-wrap">
                <button onClick={() => handleTabChange("proximos")} className={tabButtonClass("proximos")}>Próximos ({proximos.length})</button>
                <button onClick={() => handleTabChange("finalizados")} className={tabButtonClass("finalizados")}>Finalizados ({finalizados.length})</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <select value={sportFilter} onChange={handleSportFilterChange} className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde"><option value="todos">Todos los deportes</option>{sports.filter(s => s !== "todos").map(s => (<option key={s} value={s}>{s === "rugby" ? "🏉 Rugby" : s === "hockey" ? "🏑 Hockey" : s}</option>))}</select>
                <select value={genderFilter} onChange={handleGenderFilterChange} disabled={sportFilter === "todos"} className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde disabled:bg-gray-100 disabled:text-gray-400"><option value="todos">Todos los géneros</option>{genders.filter(g => g !== "todos").map(g => (<option key={g} value={g}>{g}</option>))}</select>
                <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} disabled={genderFilter === "todos"} className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde disabled:bg-gray-100 disabled:text-gray-400"><option value="todos">Todos los niveles</option>{levels.filter(l => l !== "todos").map(l => (<option key={l} value={l}>{l}</option>))}</select>
                <input type="text" placeholder="Buscar por equipo..." value={search} onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }} className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde" />
            </div>

            <div className="space-y-4">
                {visibleList.length === 0 && (<p className="text-gray-500 text-center py-8 text-sm sm:text-base">No hay partidos que coincidan con los filtros.</p>)}
                {visibleList.map((match) => (<MatchRow key={match.id} match={match} isExpanded={expandedMatches.includes(match.id)} onToggle={() => toggleExpand(match.id)} onDelete={() => handleDelete(match.id)} />))}
            </div>

            {visibleCount < filteredList.length && (<div className="text-center"><button onClick={() => setVisibleCount((v) => v + PAGE_SIZE)} className="bg-white border border-gray-300 px-6 py-2.5 rounded-full font-bold hover:bg-gray-50 transition text-sm sm:text-base">Cargar más ({filteredList.length - visibleCount} restantes)</button></div>)}

            <ConfirmModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={confirmDelete} title="Eliminar partido" message="¿Estás seguro de que deseas eliminar este partido? Esta acción no se puede deshacer." confirmText="Eliminar" cancelText="Cancelar" isLoading={isDeleting} />
        </div>
    );
}