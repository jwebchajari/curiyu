// scripts/fixSuperRoot.js
const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

// Cargar variables de entorno desde .env.local
require("dotenv").config({ path: ".env.local" });

admin.initializeApp({
	credential: admin.credential.cert({
		projectId: process.env.FIREBASE_PROJECT_ID,
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
	}),
});

const auth = getAuth();
const db = getFirestore();

async function fixSuperRoot(email, password, name) {
	try {
		// 1. Buscar usuario por email en Authentication
		let userRecord;
		try {
			userRecord = await auth.getUserByEmail(email);
			console.log("Usuario ya existe en Auth, UID:", userRecord.uid);
		} catch (error) {
			if (error.code === "auth/user-not-found") {
				// Crear usuario si no existe
				userRecord = await auth.createUser({
					email,
					password,
					displayName: name,
				});
				console.log("Usuario creado en Auth, UID:", userRecord.uid);
			} else {
				throw error;
			}
		}

		// 2. Crear o actualizar documento en Firestore con ese UID
		const userRef = db.collection("users").doc(userRecord.uid);
		await userRef.set(
			{
				uid: userRecord.uid,
				name: name,
				email: email,
				roles: ["SUPER_ROOT"], // array real
				active: true,
			},
			{ merge: true },
		);

		console.log(
			"Documento Firestore actualizado correctamente con UID:",
			userRecord.uid,
		);
		console.log("Campos: roles = ['SUPER_ROOT'], active = true");
	} catch (error) {
		console.error("Error:", error);
	}
}

// Uso: node scripts/fixSuperRoot.js email password [nombre]
const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4] || "Admin Principal";

if (!email || !password) {
	console.log("Uso: node scripts/fixSuperRoot.js email password [nombre]");
	process.exit(1);
}

fixSuperRoot(email, password, name);
