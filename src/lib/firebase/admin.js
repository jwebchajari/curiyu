// src/lib/firebase/admin.js
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getCredentials() {
	const projectId = process.env.FIREBASE_PROJECT_ID;
	const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
	const privateKey = process.env.FIREBASE_PRIVATE_KEY;

	if (!projectId || !clientEmail || !privateKey) {
		throw new Error(
			"❌ Faltan variables de entorno: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY",
		);
	}

	// 🔥 Limpieza quirúrgica: Quita comillas, convierte \n a saltos reales y quita espacios
	const cleanKey = privateKey
		.replace(/\\n/g, "\n")
		.replace(/^"|"$/g, "")
		.replace(/^'|'$/g, "")
		.trim();

	return cert({
		projectId,
		clientEmail,
		privateKey: cleanKey,
	});
}

let app;
try {
	if (!getApps().length) {
		app = initializeApp({ credential: getCredentials() });
		console.log("✅ Firebase Admin inicializado correctamente");
	} else {
		app = getApps()[0];
	}
} catch (e) {
	console.error("❌ ERROR CRÍTICO en Firebase Admin:", e.message);
	throw e; // ¡Esto es clave! Hace que el error llegue a la API
}

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
