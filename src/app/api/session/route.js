import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
	try {
		const { idToken } = await request.json();
		if (!idToken)
			return NextResponse.json(
				{ error: "Token requerido" },
				{ status: 400 },
			);

		const expiresIn = 60 * 60 * 24 * 5 * 1000;
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
		console.error("❌ Error en /api/session:", error);
		return NextResponse.json(
			{ error: error.message || "Error interno" },
			{ status: 500 },
		);
	}
}
