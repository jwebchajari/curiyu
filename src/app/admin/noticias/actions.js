// src/app/admin/noticias/actions.js
"use server";

import { db } from "@/lib/firebase/config";
import { doc, deleteDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COLLECTION = "news";

export async function deleteNewsAction(newsId) {
	if (!newsId) return { error: "ID inválido" };

	// Verificar sesión y permisos
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");
	if (!sessionCookie?.value) redirect("/login");

	try {
		// 🔥 Usamos deleteDoc con el db del cliente para borrar en la BD correcta
		await deleteDoc(doc(db, COLLECTION, newsId));

		return { success: true };
	} catch (error) {
		return {
			error: "Error al eliminar la noticia. Verifica los permisos.",
		};
	}
}
