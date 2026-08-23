// src/lib/firebase/admin.js
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Función para obtener las credenciales SOLO desde variables de entorno
function getCredentials() {
	const projectId = process.env.FIREBASE_PROJECT_ID;
	const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

	// 🔥 IMPORTANTE: Limpiamos la clave privada por si Vercel le agregó comillas o \n literales
	const privateKey = process.env.FIREBASE_PRIVATE_KEY
		? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n").replace(
				/^"|"$/g,
				"",
			)
		: undefined;

	if (!projectId || !clientEmail || !privateKey) {
		throw new Error(
			"Faltan variables de entorno de Firebase Admin (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)",
		);
	}

	console.log("✅ Credenciales cargadas desde variables de entorno");
	return cert({
		projectId,
		clientEmail,
		privateKey,
	});
}

const apps = getApps();
let adminApp;

if (!apps.length) {
	try {
		const credential = getCredentials();
		adminApp = initializeApp({
			credential,
		});
		console.log("✅ Firebase Admin inicializado correctamente");
	} catch (error) {
		console.error("❌ Error al inicializar Firebase Admin:", error);
		// No lanzamos el error para que el servidor no explote, pero sí logueamos
	}
} else {
	adminApp = apps[0];
}

const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);

export { adminAuth, adminDb };
