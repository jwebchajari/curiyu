// src/app/api/session/route.js
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

export async function POST(request) {
	try {
		// Lee el JSON del cuerpo
		const body = await request.json();
		const idToken = body?.idToken;

		if (!idToken) {
			return NextResponse.json(
				{ error: "Token no proporcionado" },
				{ status: 400 },
			);
		}

		// Verifica el token y crea la cookie de sesión
		const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 días
		const sessionCookie = await adminAuth.createSessionCookie(idToken, {
			expiresIn,
		});

		const response = NextResponse.json({ status: "success" });
		response.cookies.set("session", sessionCookie, {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			maxAge: expiresIn,
			path: "/",
		});

		return response;
	} catch (error) {
		// Si falla cualquier cosa, retorna un JSON de error para que no se rompa el cliente
		console.error("Error en la API de sesión:", error);
		return NextResponse.json(
			{ error: "Error interno al iniciar sesión" },
			{ status: 500 },
		);
	}
}
