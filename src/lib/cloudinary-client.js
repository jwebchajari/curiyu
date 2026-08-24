/**
 * Ruta: src/lib/cloudinary-client.js
 * Resumen: Utilidad para construir URLs optimizadas de Cloudinary en el cliente.
 * Lógica: Toma una URL o public_id y devuelve URL con transformaciones q_auto, f_auto, c_scale, w_800.
 *         Si la URL ya tiene transformaciones, las respeta. Si no es de Cloudinary, devuelve la original.
 * Debería: No exponer secretos; solo usa el cloud name público.
 */
export function getOptimizedCloudinaryUrl(urlOrPublicId, width = 800) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || !urlOrPublicId) return urlOrPublicId;

  let publicId = urlOrPublicId;

  // Si es una URL de Cloudinary, extraer public_id
  if (urlOrPublicId.includes("res.cloudinary.com")) {
    // Si ya contiene transformaciones (contiene q_auto, f_auto, etc.), devolver tal cual
    if (urlOrPublicId.includes("q_auto") || urlOrPublicId.includes("f_auto")) {
      return urlOrPublicId;
    }
    const parts = urlOrPublicId.split("/image/upload/");
    if (parts.length < 2) return urlOrPublicId;
    publicId = parts[1].replace(/^v\d+\//, "");
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto,c_scale,w_${width}/${publicId}`;
}