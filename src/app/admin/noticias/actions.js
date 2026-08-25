"use server";

import { adminDb } from "@/lib/firebase/admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const COLLECTION = "news";

export async function createNewsAction(formData) {
	const title = formData.get("title");
	const slug =
		formData.get("slug") || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
	const excerpt = formData.get("excerpt") || "";
	const content = formData.get("content") || "";
	const coverImageUrl = formData.get("coverImageUrl") || "";
	const videoUrl = formData.get("videoUrl") || "";

	if (!title || !content) {
		return { error: "Título y contenido son obligatorios" };
	}

	try {
		await adminDb.collection(COLLECTION).add({
			title,
			slug,
			excerpt,
			content,
			coverImageUrl,
			videoUrl,
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

export async function deleteNewsAction(newsId) {
	if (!newsId) return { error: "ID inválido" };

	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");
	if (!sessionCookie?.value) redirect("/login");

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

export async function updateNewsAction(newsId, formData) {
	if (!newsId) return { error: "ID inválido" };

	const title = formData.get("title");
	const slug =
		formData.get("slug") || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
	const excerpt = formData.get("excerpt") || "";
	const content = formData.get("content") || "";
	const coverImageUrl = formData.get("coverImageUrl") || "";
	const videoUrl = formData.get("videoUrl") || "";

	if (!title || !content) {
		return { error: "Título y contenido son obligatorios" };
	}

	try {
		await adminDb.collection(COLLECTION).doc(newsId).update({
			title,
			slug,
			excerpt,
			content,
			coverImageUrl,
			videoUrl,
			updatedAt: new Date(),
		});
		revalidatePath(`/noticias/${slug}`);
		revalidatePath("/noticias");
		revalidatePath("/admin/noticias");
		return { success: true };
	} catch (error) {
		console.error("Error actualizando noticia:", error);
		return { error: "Error al actualizar la noticia" };
	}
}
