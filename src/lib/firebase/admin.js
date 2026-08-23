// src/lib/firebase/admin.js
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getCredentials() {
	const projectId = process.env.FIREBASE_PROJECT_ID;
	const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
	const privateKey = process.env.FIREBASE_PRIVATE_KEY;

	if (!projectId || !clientEmail || !privateKey) {
		throw new Error("Faltan variables de entorno para Firebase Admin");
	}

	// Limpieza total de la clave
	const cleanKey = privateKey
		.replace(/\\n/g, "\n")
		.replace(/^"|"$/g, "")
		.replace(/^'|'$/g, "")
		.trim();

	return cert({ projectId, clientEmail, privateKey: cleanKey });
}

let app;
try {
	if (!getApps().length) {
		app = initializeApp({ credential: getCredentials() });
	} else {
		app = getApps()[0];
	}
} catch (error) {
	console.error("❌ Error CRÍTICO en Firebase Admin:", error.message);
	throw error;
}

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
