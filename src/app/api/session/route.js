// src/app/api/session/route.js
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function POST(request) {
	try {
		let idToken;
		try {
			const body = await request.json();
			idToken = body?.idToken;
		} catch (jsonError) {
			return NextResponse.json(
				{ error: "Cuerpo de la petición inválido" },
				{ status: 400 },
			);
		}

		if (!idToken) {
			return NextResponse.json(
				{ error: "Token no proporcionado" },
				{ status: 400 },
			);
		}

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
		// 🔥 Ahora el error se muestra en pantalla en lugar de morir en silencio
		console.error("❌ Error en /api/session:", error);
		return NextResponse.json(
			{ error: error.message || "Error interno al iniciar sesión" },
			{ status: 500 },
		);
	}
}
