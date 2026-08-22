// src/lib/firebase/storage.js
import { storage } from "./client";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import imageCompression from "browser-image-compression";

export async function uploadNewsImage(file, slug) {
  try {
    // Sanitizar slug para URL segura
    const cleanSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      fileType: "image/webp",
    };
    const compressedFile = await imageCompression(file, options);
    const path = `news/${cleanSlug}-${Date.now()}.webp`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, compressedFile);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error al subir imagen:", error);
    throw new Error(`Error al subir imagen: ${error.message}`);
  }
}

export async function deleteNewsImage(url) {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    throw error;
  }
}