// src/lib/firebase/admin.js
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { join } from "path";

// Función para obtener las credenciales desde el archivo
function getCredentials() {
	try {
		// Intentar cargar desde el archivo service-account-key.json
		const keyPath = join(process.cwd(), "service-account-key.json");
		const keyFile = readFileSync(keyPath, "utf8");
		const credentials = JSON.parse(keyFile);
		console.log("✅ Credenciales cargadas desde service-account-key.json");
		return cert(credentials);
	} catch (error) {
		console.log(
			"⚠️ No se pudo cargar el archivo de credenciales:",
			error.message,
		);
		// Fallback a variables de entorno
		const projectId = process.env.FIREBASE_PROJECT_ID;
		const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
		const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(
			/\\n/g,
			"\n",
		).replace(/^"|"$/g, "");

		if (projectId && clientEmail && privateKey) {
			console.log("✅ Credenciales cargadas desde variables de entorno");
			return cert({
				projectId,
				clientEmail,
				privateKey,
			});
		}

		// Si no hay credenciales, lanzar error
		throw new Error("No se encontraron credenciales de Firebase Admin");
	}
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
		throw error;
	}
} else {
	adminApp = apps[0];
	console.log("✅ Firebase Admin ya estaba inicializado");
}

const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);

export { adminAuth, adminDb };
