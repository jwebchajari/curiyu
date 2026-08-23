// src/lib/cloudinary-server.js
import { v2 as cloudinary } from "cloudinary";

// Configuración solo para el servidor
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

export function getOptimizedUrl(publicId, options = {}) {
	return cloudinary.url(publicId, {
		fetch_format: "auto",
		quality: "auto",
		...options,
	});
}
