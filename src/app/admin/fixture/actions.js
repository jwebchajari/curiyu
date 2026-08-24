// src/app/admin/fixture/actions.js
"use server";

import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";

// Crear un nuevo partido
export async function createMatchAction(formData) {
	const sport = formData.get("sport");
	const category = formData.get("category");
	const homeTeam = formData.get("homeTeam");
	const awayTeam = formData.get("awayTeam");
	const date = formData.get("date");

	if (!homeTeam || !awayTeam || !date)
		return { error: "Completa los datos básicos" };

	try {
		await adminDb.collection("matches").add({
			sport,
			category,
			homeTeam,
			awayTeam,
			date: new Date(date),
			homeScore: 0,
			awayScore: 0,
			homeTries: 0,
			awayTries: 0,
			homeConversions: 0,
			awayConversions: 0,
			homePenalties: 0,
			awayPenalties: 0,
			homeTryPenalties: 0,
			awayTryPenalties: 0,
			finished: false,
		});
		revalidatePath("/admin/fixture");
		return { success: true };
	} catch (e) {
		return { error: e.message };
	}
}

// Actualizar el resultado completo (Recibe el objeto payload desde el componente)
export async function updateMatchResultAction(matchId, data) {
	if (!matchId) return { error: "ID inválido" };

	try {
		await adminDb
			.collection("matches")
			.doc(matchId)
			.update({
				...data,
				updatedAt: new Date(),
			});
		revalidatePath("/admin/fixture");
		return { success: true };
	} catch (e) {
		return { error: e.message };
	}
}

// Eliminar partido
export async function deleteMatchAction(matchId) {
	try {
		await adminDb.collection("matches").doc(matchId).delete();
		revalidatePath("/admin/fixture");
		return { success: true };
	} catch (e) {
		return { error: e.message };
	}
}

// 🔥 NUEVO: Subir torneo completo desde Excel
export async function bulkCreateMatchesAction(matchesArray) {
	if (!matchesArray || matchesArray.length === 0)
		return { error: "No hay datos para cargar" };

	try {
		const batch = adminDb.batch();

		matchesArray.forEach((match) => {
			const docRef = adminDb.collection("matches").doc();
			batch.set(docRef, {
				sport: match.sport || "rugby",
				category: match.category || "General",
				homeTeam: match.homeTeam,
				awayTeam: match.awayTeam,
				date: new Date(match.date),
				homeScore: 0,
				awayScore: 0,
				homeTries: 0,
				awayTries: 0,
				homeConversions: 0,
				awayConversions: 0,
				homePenalties: 0,
				awayPenalties: 0,
				homeTryPenalties: 0,
				awayTryPenalties: 0,
				finished: false,
			});
		});

		await batch.commit();
		revalidatePath("/admin/fixture");
		return { success: true, count: matchesArray.length };
	} catch (error) {
		console.error("Error al cargar fixture:", error);
		return { error: "Error al cargar el archivo" };
	}
}
