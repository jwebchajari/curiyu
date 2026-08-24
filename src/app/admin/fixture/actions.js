"use server";

import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";

// Función auxiliar para convertir fecha DD-MM-AAAA a Date
function parseDateFromString(dateStr) {
  if (!dateStr) return new Date();
  // Si viene en formato ISO, devolver directamente
  if (dateStr.includes("T")) return new Date(dateStr);
  // Si viene en DD-MM-AAAA
  const [day, month, year] = dateStr.split("-").map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return new Date();
  return new Date(year, month - 1, day);
}

export async function createMatchAction(formData) {
  const sport = formData.get("sport") || "rugby";
  const category = formData.get("category") || "General";
  const gender = formData.get("gender") || "";
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
    await adminDb.collection("matches").doc(matchId).delete();
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
      const docRef = adminDb.collection("matches").doc();
      batch.set(docRef, {
        sport: match.sport || "rugby",
        category: match.category || "General",
        gender: match.gender || "",
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        date: parseDateFromString(match.date),
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
    return { error: "Error al cargar el archivo" };
  }
}