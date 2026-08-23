// src/app/api/cloudinary/delete/route.js
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request) {
	try {
		const { publicId } = await request.json();

		if (!publicId) {
			return NextResponse.json(
				{ error: "publicId es requerido" },
				{ status: 400 },
			);
		}

		const result = await cloudinary.uploader.destroy(publicId);

		if (result.result === "ok") {
			return NextResponse.json({ success: true, result });
		} else {
			return NextResponse.json(
				{ error: "No se pudo eliminar la imagen" },
				{ status: 500 },
			);
		}
	} catch (error) {
		console.error("Error en API de Cloudinary:", error);
		return NextResponse.json(
			{ error: error.message || "Error al eliminar imagen" },
			{ status: 500 },
		);
	}
}
