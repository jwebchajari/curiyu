// src/app/api/test-news/route.js
import { adminDb } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";

export async function POST() {
	try {
		const docRef = await adminDb.collection("news").add({
			title: "Noticia de prueba",
			slug: "noticia-de-prueba",
			excerpt: "Esta es una noticia de prueba creada automáticamente",
			content:
				"<p>Contenido de la noticia de prueba. Puedes editarla o eliminarla.</p>",
			coverImageUrl:
				"https://via.placeholder.com/400x200/22c55e/ffffff?text=Curiyú",
			publishedAt: new Date(),
			updatedAt: new Date(),
		});

		return NextResponse.json({
			success: true,
			id: docRef.id,
			message: "Noticia de prueba creada exitosamente",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 },
		);
	}
}
