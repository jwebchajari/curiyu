// src/app/admin/noticias/actions.js
"use server";

import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function deleteNewsAction(newsId) {
	if (!newsId) return { error: "ID inválido" };

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

	try {
		await adminDb.collection("news").doc(newsId).delete();
		// 🔥 CAMBIO CLAVE: Revalidamos la página real que se está mostrando (/admin)
		revalidatePath("/admin");
		return { success: true };
	} catch (error) {
		return { error: "Error al eliminar la noticia." };
	}
}
