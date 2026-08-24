/**
 * Ruta: src/lib/cloudinary-server.js
 * Resumen: Utilidades de Cloudinary para servidor (borrado y URLs optimizadas).
 * Lógica: Configura el SDK con credenciales privadas. Exporta funciones para
 *         eliminar imágenes y generar URLs optimizadas con formato y calidad auto.
 * Debería: Usarse solo en el servidor (no exponer API Secret al cliente).
 */
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
}

/**
 * Genera URL optimizada a partir de un public_id.
 * Transformaciones: fetch_format=auto, quality=auto, crop=scale, width=800.
 */
export function getOptimizedUrl(publicId, options = {}) {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
    crop: "scale",
    width: 800,
    ...options,
  });
}

/**
 * Convierte una URL completa de Cloudinary a una URL optimizada.
 * Extrae el public_id y aplica las mismas transformaciones.
 */
export function getOptimizedUrlFromUrl(url, options = {}) {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  const parts = url.split("/image/upload/");
  if (parts.length < 2) return url;
  const publicIdWithVersion = parts[1];
  const publicId = publicIdWithVersion.replace(/^v\d+\//, "");
  return getOptimizedUrl(publicId, options);
}