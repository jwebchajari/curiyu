// lib/firebase-admin.ts
import { getApps, initializeApp, cert } from "firebase-admin/app";

function getPrivateKey() {
	const key = process.env.FIREBASE_PRIVATE_KEY;
	if (!key) throw new Error("FIREBASE_PRIVATE_KEY no está definida");
	// Soporta key con \n literales (Vercel) o con saltos reales (.env local)
	return key.includes("\\n") ? key.replace(/\\n/g, "\n") : key;
}

if (getApps().length === 0) {
	if (
		!process.env.FIREBASE_PROJECT_ID ||
		!process.env.FIREBASE_CLIENT_EMAIL ||
		!process.env.FIREBASE_PRIVATE_KEY
	) {
		throw new Error("Faltan variables de entorno de Firebase Admin");
	}

	initializeApp({
		credential: cert({
			projectId: process.env.FIREBASE_PROJECT_ID,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			privateKey: getPrivateKey(),
		}),
	});
}

export { getApps };
