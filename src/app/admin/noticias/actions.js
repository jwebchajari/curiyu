"use server";

import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COLLECTION = "news";

// Crear una noticia
export async function createNewsAction(data) {
	const { title, slug, excerpt, content, coverImageUrl, videoUrl } = data;

	if (!title || !content) {
		return { error: "Título y contenido son obligatorios" };
	}

	const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

	try {
		await adminDb.collection(COLLECTION).add({
			title,
			slug: finalSlug,
			excerpt: excerpt || "",
			content,
			coverImageUrl: coverImageUrl || "",
			videoUrl: videoUrl || "",
			publishedAt: new Date(),
			updatedAt: new Date(),
		});

		revalidatePath("/noticias");
		revalidatePath("/admin/noticias");
		return { success: true };
	} catch (error) {
		console.error("Error creando noticia:", error);
		return { error: "Error al crear la noticia" };
	}
}

// Actualizar una noticia existente
export async function updateNewsAction(newsId, data) {
	if (!newsId) return { error: "ID inválido" };

	const { title, slug, excerpt, content, coverImageUrl, videoUrl } = data;

	if (!title || !content) {
		return { error: "Título y contenido son obligatorios" };
	}

	const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

	try {
		await adminDb
			.collection(COLLECTION)
			.doc(newsId)
			.update({
				title,
				slug: finalSlug,
				excerpt: excerpt || "",
				content,
				coverImageUrl: coverImageUrl || "",
				videoUrl: videoUrl || "",
				updatedAt: new Date(),
			});

		revalidatePath(`/noticias/${finalSlug}`);
		revalidatePath("/noticias");
		revalidatePath("/admin/noticias");
		return { success: true };
	} catch (error) {
		console.error("Error actualizando noticia:", error);
		return { error: "Error al actualizar la noticia" };
	}
}

// Eliminar una noticia (requiere sesión)
export async function deleteNewsAction(newsId) {
	if (!newsId) return { error: "ID inválido" };

	// Verificación de sesión (opcional pero recomendable)
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");
	if (!sessionCookie?.value) {
		redirect("/login");
	}

	try {
		await adminDb.collection(COLLECTION).doc(newsId).delete();
		revalidatePath("/noticias");
		revalidatePath("/admin/noticias");
		return { success: true };
	} catch (error) {
		console.error("Error eliminando noticia:", error);
		return { error: "Error al eliminar la noticia" };
	}
}
