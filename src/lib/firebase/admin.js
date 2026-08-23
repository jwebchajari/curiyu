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
			"Faltan variables de entorno: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY",
		);
	}

	// Limpieza total de la clave privada (quita comillas, convierte \n a salto real, quita espacios sobrantes)
	const cleanedPrivateKey = privateKey
		.replace(/\\n/g, "\n")
		.replace(/^"|"$/g, "") // Quita comillas dobles al inicio y final
		.replace(/^'|'$/g, "") // Quita comillas simples al inicio y final
		.trim();

	return cert({ projectId, clientEmail, privateKey: cleanedPrivateKey });
}

let adminApp;
if (!getApps().length) {
	try {
		adminApp = initializeApp({ credential: getCredentials() });
		console.log("✅ Firebase Admin inicializado correctamente");
	} catch (error) {
		console.error("❌ Error al inicializar Firebase Admin:", error);
		throw error; // Esto hará que la API devuelva un error claro
	}
} else {
	adminApp = getApps()[0];
}

const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);

export { adminAuth, adminDb };
