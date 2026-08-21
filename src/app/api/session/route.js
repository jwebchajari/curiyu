import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

const COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24 * 5;

export async function POST(request) {
	try {
		const { idToken } = await request.json();
		if (!idToken) {
			return NextResponse.json(
				{ error: "Token no proporcionado" },
				{ status: 400 },
			);
		}

		const decodedToken = await adminAuth.verifyIdToken(idToken);
		const uid = decodedToken.uid;

		const sessionCookie = await adminAuth.createSessionCookie(idToken, {
			expiresIn: MAX_AGE * 1000,
		});

		const response = NextResponse.json({ success: true, uid });
		response.cookies.set(COOKIE_NAME, sessionCookie, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: MAX_AGE,
			path: "/",
		});

		return response;
	} catch (error) {
		console.error("Error al crear sesión:", error);
		return NextResponse.json(
			{ error: "Token inválido o expirado" },
			{ status: 401 },
		);
	}
}

export async function DELETE() {
	const response = NextResponse.json({ success: true });
	response.cookies.delete(COOKIE_NAME);
	return response;
}
