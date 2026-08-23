// src/app/api/session/route.js
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic"; // 🔥 IMPORTANTE: Fuerza a que la API se ejecute en cada petición

export async function POST(request) {
	try {
		// Verificamos si el body viene vacío o mal formado
		let idToken;
		try {
			const body = await request.json();
			idToken = body?.idToken;
		} catch (jsonError) {
			return NextResponse.json(
				{ error: "El cuerpo de la petición no es un JSON válido" },
				{ status: 400 },
			);
		}

		if (!idToken) {
			return NextResponse.json(
				{ error: "Token no proporcionado" },
				{ status: 400 },
			);
		}

		// Crear la sesión
		const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 días
		const sessionCookie = await adminAuth.createSessionCookie(idToken, {
			expiresIn,
		});

		const response = NextResponse.json({ status: "success" });
		response.cookies.set("session", sessionCookie, {
			httpOnly: true,
			secure: true, // En producción (Vercel) siempre es true
			sameSite: "lax",
			maxAge: expiresIn,
			path: "/",
		});

		return response;
	} catch (error) {
		// 🔥 Esto es lo que te va a decir exactamente qué falla:
		console.error("Error en la API de sesión:", error);
		return NextResponse.json(
			{ error: error.message || "Error interno al iniciar sesión" },
			{ status: 500 },
		);
	}
}
