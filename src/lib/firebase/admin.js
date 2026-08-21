// src/lib/firebase/admin.js
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getPrivateKey() {
	const key = process.env.FIREBASE_PRIVATE_KEY;
	if (!key) throw new Error("Falta FIREBASE_PRIVATE_KEY");
	return key.includes("\\n") ? key.replace(/\\n/g, "\n") : key;
}

function getFirebaseAdminApp() {
	if (getApps().length > 0) return getApps()[0];

	if (
		!process.env.FIREBASE_PROJECT_ID ||
		!process.env.FIREBASE_CLIENT_EMAIL ||
		!process.env.FIREBASE_PRIVATE_KEY
	) {
		throw new Error("Faltan variables de entorno de Firebase Admin");
	}

	return initializeApp({
		credential: cert({
			projectId: process.env.FIREBASE_PROJECT_ID,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			privateKey: getPrivateKey(),
		}),
	});
}

const app = getFirebaseAdminApp();

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
