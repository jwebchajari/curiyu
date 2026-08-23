// src/lib/firebase/news.js
import { db } from "./config";
import {
	collection,
	addDoc,
	getDocs,
	getDoc,
	doc,
	updateDoc,
	deleteDoc,
	query,
	orderBy,
	Timestamp,
} from "firebase/firestore";

const COLLECTION = "news";

export async function createNews(data) {
	try {
		const docRef = await addDoc(collection(db, COLLECTION), {
			...data,
			publishedAt: Timestamp.now(),
			updatedAt: Timestamp.now(),
		});
		return { id: docRef.id, ...data };
	} catch (error) {
		console.error("Error al crear noticia:", error);
		throw error;
	}
}

export async function getAllNews() {
	try {
		const q = query(
			collection(db, COLLECTION),
			orderBy("publishedAt", "desc"),
		);
		const snapshot = await getDocs(q);
		return snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
	} catch (error) {
		console.error("Error al obtener noticias:", error);
		return [];
	}
}

export async function getNewsById(id) {
	try {
		const docRef = doc(db, COLLECTION, id);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) return null;
		return { id: docSnap.id, ...docSnap.data() };
	} catch (error) {
		console.error("Error al obtener noticia:", error);
		return null;
	}
}

export async function updateNews(id, data) {
	try {
		const docRef = doc(db, COLLECTION, id);
		await updateDoc(docRef, {
			...data,
			updatedAt: Timestamp.now(),
		});
		return { id, ...data };
	} catch (error) {
		console.error("Error al actualizar noticia:", error);
		throw error;
	}
}

export async function deleteNews(id) {
	try {
		const docRef = doc(db, COLLECTION, id);
		await deleteDoc(docRef);
		return true;
	} catch (error) {
		console.error("Error al eliminar noticia:", error);
		throw error;
	}
}
