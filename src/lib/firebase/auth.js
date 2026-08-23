// src/lib/firebase/auth.js
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./config";

export async function signOut() {
	try {
		await firebaseSignOut(auth);
		// Limpiar cookie de sesión
		await fetch("/api/auth/logout", { method: "POST" });
	} catch (error) {
		console.error("Error al cerrar sesión:", error);
		throw error;
	}
}
