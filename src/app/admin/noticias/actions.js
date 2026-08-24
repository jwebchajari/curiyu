"use server";

import { db } from "@/lib/firebase/config";
import {
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
  collection,
} from "firebase/firestore";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const COLLECTION = "news";

/**
 * Crea una nueva noticia en Firestore.
 * @param {FormData} formData - Datos del formulario (title, slug, excerpt, content, coverImageUrl, videoUrl)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function createNewsAction(formData) {
  const title = formData.get("title");
  const slug = formData.get("slug") || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const excerpt = formData.get("excerpt") || "";
  const content = formData.get("content") || "";
  const coverImageUrl = formData.get("coverImageUrl") || "";
  const videoUrl = formData.get("videoUrl") || ""; // Nuevo campo

  if (!title || !content) {
    return { error: "Título y contenido son obligatorios" };
  }

  try {
    await addDoc(collection(db, COLLECTION), {
      title,
      slug,
      excerpt,
      content,
      coverImageUrl,
      videoUrl, // Guardar videoUrl
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

/**
 * Elimina una noticia por ID.
 * @param {string} newsId - ID del documento
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteNewsAction(newsId) {
  if (!newsId) return { error: "ID inválido" };

  // Verificar sesión y permisos
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  if (!sessionCookie?.value) redirect("/login");

  try {
    await deleteDoc(doc(db, COLLECTION, newsId));
    revalidatePath("/noticias");
    revalidatePath("/admin/noticias");
    return { success: true };
  } catch (error) {
    console.error("Error eliminando noticia:", error);
    return {
      error: "Error al eliminar la noticia. Verifica los permisos.",
    };
  }
}

/**
 * Actualiza una noticia existente.
 * @param {string} newsId - ID de la noticia
 * @param {FormData} formData - Datos del formulario
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updateNewsAction(newsId, formData) {
  if (!newsId) return { error: "ID inválido" };

  const title = formData.get("title");
  const slug = formData.get("slug") || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const excerpt = formData.get("excerpt") || "";
  const content = formData.get("content") || "";
  const coverImageUrl = formData.get("coverImageUrl") || "";
  const videoUrl = formData.get("videoUrl") || "";

  if (!title || !content) {
    return { error: "Título y contenido son obligatorios" };
  }

  try {
    const newsRef = doc(db, COLLECTION, newsId);
    await updateDoc(newsRef, {
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