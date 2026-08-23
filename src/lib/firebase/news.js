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
	where, // 🔥 NUEVO: Importamos 'where' para buscar por slug
	limit, // 🔥 NUEVO: Importamos 'limit' para asegurar que traiga solo uno
	Timestamp,
} from "firebase/firestore";

const COLLECTION = "news";

export async function createNews(data) {
	try {
		console.log("🔄 Creando noticia en Firestore...");
		const docRef = await addDoc(collection(db, COLLECTION), {
			...data,
			publishedAt: Timestamp.now(),
			updatedAt: Timestamp.now(),
		});
		console.log("✅ Noticia creada con ID:", docRef.id);
		return { id: docRef.id, ...data };
	} catch (error) {
		console.error("❌ Error al crear noticia:", error);
		throw error;
	}
}

export async function getAllNews() {
	try {
		console.log("🔄 Obteniendo todas las noticias de Firestore...");
		console.log("📁 Colección:", COLLECTION);

		const q = query(
			collection(db, COLLECTION),
			orderBy("publishedAt", "desc"),
		);
		const snapshot = await getDocs(q);

		console.log("📊 Documentos encontrados:", snapshot.docs.length);

		const news = snapshot.docs.map((doc) => {
			const data = doc.data();
			console.log(`📄 Documento ${doc.id}:`, data.title || "sin título");
			return {
				id: doc.id,
				...data,
			};
		});

		console.log("✅ Noticias cargadas correctamente:", news.length);
		return news;
	} catch (error) {
		console.error("❌ Error al obtener noticias:", error);
		return [];
	}
}

export async function getNewsById(id) {
	try {
		console.log("🔄 Obteniendo noticia por ID:", id);
		const docRef = doc(db, COLLECTION, id);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) {
			console.log("❌ Noticia no encontrada");
			return null;
		}
		console.log("✅ Noticia encontrada");
		return { id: docSnap.id, ...docSnap.data() };
	} catch (error) {
		console.error("❌ Error al obtener noticia:", error);
		return null;
	}
}

// 🔥 NUEVA FUNCIÓN AGREGADA
export async function getNewsBySlug(slug) {
	try {
		console.log("🔄 Obteniendo noticia por slug:", slug);
		const q = query(
			collection(db, COLLECTION),
			where("slug", "==", slug),
			limit(1),
		);
		const snapshot = await getDocs(q);

		if (snapshot.empty) {
			console.log("❌ Noticia no encontrada por slug");
			return null;
		}

		const docSnap = snapshot.docs[0];
		console.log("✅ Noticia encontrada por slug");
		return { id: docSnap.id, ...docSnap.data() };
	} catch (error) {
		console.error("❌ Error al obtener noticia por slug:", error);
		return null;
	}
}

export async function updateNews(id, data) {
	try {
		console.log("🔄 Actualizando noticia:", id);
		const docRef = doc(db, COLLECTION, id);
		await updateDoc(docRef, {
			...data,
			updatedAt: Timestamp.now(),
		});
		console.log("✅ Noticia actualizada");
		return { id, ...data };
	} catch (error) {
		console.error("❌ Error al actualizar noticia:", error);
		throw error;
	}
}

export async function deleteNews(id) {
	try {
		console.log("🔄 Eliminando noticia:", id);
		const docRef = doc(db, COLLECTION, id);
		await deleteDoc(docRef);
		console.log("✅ Noticia eliminada");
		return true;
	} catch (error) {
		console.error("❌ Error al eliminar noticia:", error);
		throw error;
	}
}
