// src/lib/firebase/news.js
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

export async function getAllNews() {
  try {
    const q = query(collection(db, NEWS_COLLECTION), orderBy("publishedAt", "desc"));
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

export async function getNewsBySlug(slug) {
  try {
    const q = query(collection(db, NEWS_COLLECTION), where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error("Error al obtener noticia por slug:", error);
    return null;
  }
}

export async function getNewsById(id) {
  try {
    const docRef = doc(db, NEWS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error("Error al obtener noticia por ID:", error);
    return null;
  }
}

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