import { db } from "./client";
import {
	collection,
	getDocs,
	getDoc,
	doc,
	query,
	orderBy,
	where,
	limit,
	addDoc,
	updateDoc,
	deleteDoc,
	serverTimestamp,
} from "firebase/firestore";

const NEWS_COLLECTION = "news";

// Obtener todas las noticias ordenadas por fecha de publicación descendente
export async function getAllNews() {
	try {
		const q = query(
			collection(db, NEWS_COLLECTION),
			orderBy("publishedAt", "desc"),
		);
		const querySnapshot = await getDocs(q);
		const news = [];
		querySnapshot.forEach((doc) => {
			news.push({ id: doc.id, ...doc.data() });
		});
		return news;
	} catch (error) {
		console.error("Error al obtener noticias:", error);
		return [];
	}
}

// Obtener una noticia por su slug
export async function getNewsBySlug(slug) {
	try {
		const q = query(
			collection(db, NEWS_COLLECTION),
			where("slug", "==", slug),
			limit(1),
		);
		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) return null;
		const docSnap = querySnapshot.docs[0];
		return { id: docSnap.id, ...docSnap.data() };
	} catch (error) {
		console.error("Error al obtener noticia por slug:", error);
		return null;
	}
}

// Crear una nueva noticia
export async function createNews(data) {
	try {
		const docRef = await addDoc(collection(db, NEWS_COLLECTION), {
			...data,
			publishedAt: serverTimestamp(),
		});
		return { id: docRef.id };
	} catch (error) {
		console.error("Error al crear noticia:", error);
		throw error;
	}
}

// Actualizar una noticia existente
export async function updateNews(id, data) {
	try {
		const docRef = doc(db, NEWS_COLLECTION, id);
		await updateDoc(docRef, data);
		return { success: true };
	} catch (error) {
		console.error("Error al actualizar noticia:", error);
		throw error;
	}
}

// Eliminar una noticia
export async function deleteNews(id) {
	try {
		const docRef = doc(db, NEWS_COLLECTION, id);
		await deleteDoc(docRef);
		return { success: true };
	} catch (error) {
		console.error("Error al eliminar noticia:", error);
		throw error;
	}
}
