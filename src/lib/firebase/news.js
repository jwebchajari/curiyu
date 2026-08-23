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
	where,
	limit,
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

		const news = snapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				...data,
			};
		});

		return news;
	} catch (error) {
		return [];
	}
}

export async function getNewsById(id) {
	try {
		const docRef = doc(db, COLLECTION, id);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) {
			return null;
		}
		return { id: docSnap.id, ...docSnap.data() };
	} catch (error) {
		return null;
	}
}

export async function getNewsBySlug(slug) {
	try {
		const q = query(
			collection(db, COLLECTION),
			where("slug", "==", slug),
			limit(1),
		);
		const snapshot = await getDocs(q);

		if (snapshot.empty) {
			return null;
		}

		const docSnap = snapshot.docs[0];
		return { id: docSnap.id, ...docSnap.data() };
	} catch (error) {
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
		throw error;
	}
}

export async function deleteNews(id) {
	try {
		const docRef = doc(db, COLLECTION, id);
		await deleteDoc(docRef);
		return true;
	} catch (error) {
		throw error;
	}
}
