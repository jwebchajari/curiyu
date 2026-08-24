"use server";

import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";
import { deleteFromCloudinary } from "@/lib/cloudinary-server";

// Función auxiliar para convertir fecha a Date (soporta ISO con espacio y DD-MM-AAAA)
function parseDateFromString(dateStr) {
	if (!dateStr) return new Date();
	if (dateStr instanceof Date) return dateStr; // ya es Date

	// Si es string ISO con 'T' o espacio
	if (typeof dateStr === "string") {
		// Elimina espacios y comprueba formato ISO
		const trimmed = dateStr.trim();
		if (trimmed.includes("T") || trimmed.includes(" ")) {
			const d = new Date(trimmed);
			if (!isNaN(d.getTime())) return d;
		}
		// Formato DD-MM-AAAA
		const parts = trimmed.split("-");
		if (parts.length === 3) {
			const day = parseInt(parts[0], 10);
			const month = parseInt(parts[1], 10) - 1;
			const year = parseInt(parts[2], 10);
			if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
				return new Date(year, month, day);
			}
		}
	}
	return new Date(); // fallback
}

// Extraer public_id de una URL de Cloudinary
function extractPublicIdFromUrl(url) {
	if (!url || !url.includes("res.cloudinary.com")) return null;
	const parts = url.split("/image/upload/");
	if (parts.length < 2) return null;
	return parts[1].replace(/^v\d+\//, "");
}

export async function createMatchAction(formData) {
	const sport = formData.get("sport") || "rugby";
	const category = formData.get("category") || "General";
	const gender = formData.get("gender") || "";
	const level = formData.get("level") || "General";
	const homeTeam = formData.get("homeTeam");
	const awayTeam = formData.get("awayTeam");
	const dateInput = formData.get("date");

	if (!homeTeam || !awayTeam || !dateInput)
		return { error: "Completa los datos básicos" };

	try {
		const date = parseDateFromString(dateInput);
		await adminDb.collection("matches").add({
			sport,
			category,
			gender,
			level,
			homeTeam,
			awayTeam,
			date,
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
			imageUrl: "",
		});
		revalidatePath("/admin/fixture");
		return { success: true };
	} catch (e) {
		return { error: e.message };
	}
}

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

export async function deleteMatchAction(matchId) {
	try {
		const docRef = adminDb.collection("matches").doc(matchId);
		const doc = await docRef.get();

		if (doc.exists) {
			const imageUrl = doc.data().imageUrl;
			if (imageUrl) {
				const publicId = extractPublicIdFromUrl(imageUrl);
				if (publicId) {
					try {
						await deleteFromCloudinary(publicId);
					} catch (imgError) {
						console.error(
							"Error eliminando imagen de Cloudinary:",
							imgError,
						);
					}
				}
			}
		}

		await docRef.delete();
		revalidatePath("/admin/fixture");
		return { success: true };
	} catch (e) {
		return { error: e.message };
	}
}

export async function bulkCreateMatchesAction(matchesArray) {
	if (!matchesArray || matchesArray.length === 0)
		return { error: "No hay datos para cargar" };

	try {
		const batch = adminDb.batch();
		matchesArray.forEach((match) => {
			// Asegurar que todos los campos necesarios existen
			const docRef = adminDb.collection("matches").doc();
			batch.set(docRef, {
				sport: match.sport || "rugby",
				category: match.category || "General",
				gender: match.gender || "",
				level: match.level || "General",
				homeTeam: match.homeTeam,
				awayTeam: match.awayTeam,
				date: parseDateFromString(match.date), // ← ahora soporta el formato del Excel
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
				imageUrl: "",
			});
		});
		await batch.commit();
		revalidatePath("/admin/fixture");
		return { success: true, count: matchesArray.length };
	} catch (error) {
		console.error("Error en bulkCreateMatchesAction:", error);
		return { error: error.message }; // ← ahora devuelve el mensaje real
	}
}
