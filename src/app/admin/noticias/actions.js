// src/app/admin/noticias/actions.js
"use server";

import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function deleteNewsAction(newsId) {
	if (!newsId) return { error: "ID inválido" };

	// Verificar sesión y permisos
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");
	if (!sessionCookie?.value) redirect("/login");

	let uid;
	try {
		const decoded = await adminAuth.verifySessionCookie(
			sessionCookie.value,
		);
		uid = decoded.uid;
	} catch {
		redirect("/login");
	}

	const userDoc = await adminDb.collection("users").doc(uid).get();
	if (!userDoc.exists) redirect("/login");

	const userData = userDoc.data();
	const roles = userData?.roles || [];
	const canManage = roles.some((r) => r === "ADMIN" || r === "NOTERO");

	if (!canManage) redirect("/admin");

	// Eliminar el documento de Firestore
	try {
		await adminDb.collection("news").doc(newsId).delete();

		// Refresca la caché de la página para que la lista se actualice sin recargar manualmente
		revalidatePath("/admin/noticias");
		return { success: true };
	} catch (error) {
		console.error("Error eliminando noticia:", error);
		return { error: "Error al eliminar la noticia." };
	}
}
