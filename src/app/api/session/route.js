// src/app/api/session/route.js
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

const MAX_AGE = 60 * 60 * 24 * 5; // 5 días

export async function POST(request) {
	try {
		const body = await request.json();
		const { idToken } = body;

		if (!idToken) {
			return NextResponse.json(
				{ error: "Token no proporcionado" },
				{ status: 400 },
			);
		}

		console.log("🔄 Verificando token ID...");

		let decodedToken;
		try {
			decodedToken = await adminAuth.verifyIdToken(idToken);
			console.log("✅ Token verificado para UID:", decodedToken.uid);
		} catch (error) {
			console.error("❌ Error al verificar token:", error);
			return NextResponse.json(
				{ error: "Token inválido o expirado" },
				{ status: 401 },
			);
		}

		const uid = decodedToken.uid;

		console.log("🔄 Creando cookie de sesión...");
		let sessionCookie;
		try {
			sessionCookie = await adminAuth.createSessionCookie(idToken, {
				expiresIn: MAX_AGE * 1000,
			});
			console.log("✅ Cookie de sesión creada");
		} catch (error) {
			console.error("❌ Error al crear cookie de sesión:", error);
			return NextResponse.json(
				{ error: "Error al crear sesión: " + error.message },
				{ status: 500 },
			);
		}

		const response = NextResponse.json(
			{ success: true, message: "Sesión creada" },
			{ status: 200 },
		);

		response.cookies.set("session", sessionCookie, {
			maxAge: MAX_AGE,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
		});

		console.log("✅ Sesión creada exitosamente para:", uid);
		return response;
	} catch (error) {
		console.error("❌ Error en /api/session:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor: " + error.message },
			{ status: 500 },
		);
	}
}
