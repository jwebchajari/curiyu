/**
 * Ruta: src/lib/cloudinary-server.js
 * Resumen: Utilidades de Cloudinary para servidor (borrado y URLs optimizadas).
 * Lógica: Configura el SDK de Cloudinary con credenciales privadas. Exporta
 *         funciones para eliminar imágenes y generar URLs optimizadas con
 *         transformación automática (formato, calidad y ancho máximo).
 * Debería: Funcionar solo en el servidor y no exponer el API Secret al cliente.
 */
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Elimina una imagen de Cloudinary por public_id.
 */
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
 * Genera una URL optimizada a partir de un public_id.
 * Transformaciones: fetch_format=auto, quality=auto, crop=scale, width=800.
 */
export function getOptimizedUrl(publicId, options = {}) {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
    crop: "scale",
    width: 800,
    ...options, // Podés sobrescribir ancho, etc.
  });
}

/**
 * Convierte una URL completa de Cloudinary a una URL optimizada.
 * Útil para imágenes ya guardadas con la URL original.
 */
export function getOptimizedUrlFromUrl(url, options = {}) {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  // Extraer public_id de la URL
  const parts = url.split("/image/upload/");
  if (parts.length < 2) return url;

  const publicIdWithVersion = parts[1];
  // Quitar versión "v1234567890/" si existe
  const publicId = publicIdWithVersion.replace(/^v\d+\//, "");

  return getOptimizedUrl(publicId, options);
}