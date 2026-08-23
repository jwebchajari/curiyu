// src/lib/firebase/storage.js
export async function uploadNewsImage(file, slug) {
	try {
		const formData = new FormData();
		formData.append("file", file);
		formData.append(
			"upload_preset",
			process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
		);
		formData.append("folder", "curiyu/noticias");
		formData.append("public_id", slug);

		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
			{
				method: "POST",
				body: formData,
			},
		);

		const data = await response.json();
		if (!response.ok)
			throw new Error(data.error?.message || "Error al subir imagen");
		return data.secure_url;
	} catch (error) {
		console.error("Error al subir imagen a Cloudinary:", error);
		throw error;
	}
}

export async function deleteNewsImage(url) {
	try {
		const urlParts = url.split("/");
		const uploadIndex = urlParts.indexOf("upload");
		const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join("/");
		const publicId = publicIdWithExtension.split(".")[0];

		const response = await fetch("/api/cloudinary/delete", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ publicId }),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Error al eliminar imagen");
		}

		return true;
	} catch (error) {
		console.error("Error al eliminar imagen de Cloudinary:", error);
		return false;
	}
}
