/**
 * Ruta: src/lib/cloudinary-client.js
 * Resumen: Utilidad para construir URLs optimizadas de Cloudinary en el cliente.
 * Lógica: Toma una URL o public_id. Si es de Cloudinary, aplica transformaciones.
 *         Si es una URL local o de otro origen, devuelve la original sin modificar.
 * Debería: No exponer secretos; solo usa el cloud name público.
 */
export function getOptimizedCloudinaryUrl(urlOrPublicId, width = 800) {
  if (!urlOrPublicId) return urlOrPublicId;

  // Si no es de Cloudinary, devolver tal cual (puede ser ruta local /proximo.png, etc.)
  if (!urlOrPublicId.includes("res.cloudinary.com")) {
    return urlOrPublicId;
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return urlOrPublicId;

  // Si ya contiene transformaciones, no duplicar
  if (urlOrPublicId.includes("q_auto") || urlOrPublicId.includes("f_auto")) {
    return urlOrPublicId;
  }

  // Extraer public_id
  const parts = urlOrPublicId.split("/image/upload/");
  if (parts.length < 2) return urlOrPublicId;
  const publicId = parts[1].replace(/^v\d+\//, "");

  return `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto,c_scale,w_${width}/${publicId}`;
}