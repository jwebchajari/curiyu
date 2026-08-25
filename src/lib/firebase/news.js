// src/lib/firebase/news.js
import { adminDb } from "./admin";

const COLLECTION = "news";

/**
 * Obtiene todas las noticias ordenadas por fecha de publicación descendente.
 * @returns {Promise<Array>} Array de documentos con id incluido.
 */
export async function getAllNews() {
	try {
		const snapshot = await adminDb
			.collection(COLLECTION)
			.orderBy("publishedAt", "desc")
			.get();

		console.log(
			`[getAllNews] ${snapshot.docs.length} documentos encontrados`,
		);

		return snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
	} catch (error) {
		console.error("[getAllNews] Error al obtener noticias:", error);
		return [];
	}
}

/**
 * Obtiene una noticia por su ID.
 * @param {string} id - ID del documento.
 * @returns {Promise<Object|null>} Datos de la noticia o null.
 */
export async function getNewsById(id) {
	try {
		const docRef = adminDb.collection(COLLECTION).doc(id);
		const docSnap = await docRef.get();
		if (!docSnap.exists) return null;
		return { id: docSnap.id, ...docSnap.data() };
	} catch (error) {
		console.error("[getNewsById] Error:", error);
		return null;
	}
}

/**
 * Obtiene una noticia por su slug.
 * @param {string} slug - Slug de la noticia.
 * @returns {Promise<Object|null>} Datos de la noticia o null.
 */
export async function getNewsBySlug(slug) {
	try {
		const snapshot = await adminDb
			.collection(COLLECTION)
			.where("slug", "==", slug)
			.limit(1)
			.get();

		if (snapshot.empty) return null;
		const doc = snapshot.docs[0];
		return { id: doc.id, ...doc.data() };
	} catch (error) {
		console.error("[getNewsBySlug] Error:", error);
		return null;
	}
}
