// src/app/api/test-admin/route.js
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function GET() {
	try {
		// Verificar que adminAuth funciona
		const authInfo = {
			projectId: process.env.FIREBASE_PROJECT_ID,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
		};

		// Intentar listar usuarios (solo 1 para verificar)
		let users = [];
		try {
			const listUsersResult = await adminAuth.listUsers(1);
			users = listUsersResult.users.map((u) => ({
				uid: u.uid,
				email: u.email,
			}));
		} catch (error) {
			console.error("Error listando usuarios:", error);
		}

		return NextResponse.json({
			success: true,
			authInfo,
			users,
			message: "Firebase Admin funcionando correctamente",
		});
	} catch (error) {
		console.error("❌ Error en test-admin:", error);
		return NextResponse.json(
			{
				success: false,
				error: error.message,
				stack: error.stack,
			},
			{ status: 500 },
		);
	}
}
