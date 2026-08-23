// src/app/api/create-news-collection/route.js
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function POST() {
	try {
		console.log("🔄 Verificando si existe la colección 'news'...");

		// Intentar obtener un documento de la colección para verificar si existe
		const snapshot = await adminDb.collection("news").limit(1).get();

		if (!snapshot.empty) {
			console.log("✅ La colección 'news' ya existe y tiene datos");
			return NextResponse.json({
				success: true,
				message: "La colección 'news' ya existe",
				exists: true,
				hasData: true,
			});
		}

		console.log(
			"🔄 La colección 'news' está vacía, creando documento de prueba...",
		);

		// Crear un documento de prueba para que la colección se cree
		const docRef = await adminDb.collection("news").add({
			title: "Noticia de prueba - Bienvenido al sistema de noticias",
			slug: "noticia-de-prueba-bienvenida",
			excerpt:
				"Esta es una noticia de prueba para iniciar el sistema de noticias del Club Curiyú.",
			content: `
        <h2>¡Bienvenido al sistema de noticias!</h2>
        <p>Esta es una noticia de prueba creada automáticamente por el sistema.</p>
        <p>Puedes editarla o eliminarla desde el panel de administración.</p>
        <ul>
          <li>✅ Puedes crear nuevas noticias</li>
          <li>✅ Puedes editar noticias existentes</li>
          <li>✅ Puedes eliminar noticias</li>
          <li>✅ Puedes subir imágenes a Cloudinary</li>
        </ul>
        <p><strong>¡Empieza a crear contenido!</strong></p>
      `,
			coverImageUrl:
				"https://via.placeholder.com/800x400/22c55e/ffffff?text=Curiy%C3%BA+Noticias",
			videoLink: null,
			publishedAt: new Date(),
			updatedAt: new Date(),
		});

		console.log(
			"✅ Colección 'news' creada con documento de prueba ID:",
			docRef.id,
		);

		return NextResponse.json({
			success: true,
			message: "✅ Colección 'news' creada con una noticia de prueba",
			docId: docRef.id,
			exists: true,
			hasData: true,
		});
	} catch (error) {
		console.error("❌ Error al crear la colección:", error);
		return NextResponse.json(
			{
				success: false,
				error: error.message || "Error al crear la colección",
			},
			{ status: 500 },
		);
	}
}
