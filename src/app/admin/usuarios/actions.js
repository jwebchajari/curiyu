// src/app/admin/usuarios/actions.js
"use server";

import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Helper para verificar permisos de administración
async function verifyAdmin() {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session");
	if (!sessionCookie?.value) redirect("/login");

	let uid;
	try {
		const decoded = await adminAuth.verifySessionCookie(
			sessionCookie.value,
		);
		uid = decoded.uid;
	} catch {
		redirect("/login");
	}

	const userDoc = await adminDb.collection("users").doc(uid).get();
	if (!userDoc.exists) redirect("/login");

	const roles = userDoc.data()?.roles || [];
	const canManage = roles.some(
		(r) => r === "ADMIN" || r === "SUPER_ROOT" || r === "NOTERO",
	);

	if (!canManage) redirect("/admin");
	return uid; // Retorna el UID del administrador
}

// Crear un nuevo usuario
export async function createUserAction(formData) {
	const adminUid = await verifyAdmin();

	const email = formData.get("email");
	const password = formData.get("password");
	const displayName = formData.get("displayName");
	const roles = formData.getAll("roles"); // Array de roles seleccionados

	if (!email || !password)
		return { error: "Email y contraseña son obligatorios" };

	try {
		// 1. Crear usuario en Firebase Authentication
		const userRecord = await adminAuth.createUser({
			email,
			password,
			displayName,
		});

		// 2. Crear el documento en Firestore
		await adminDb
			.collection("users")
			.doc(userRecord.uid)
			.set({
				email,
				displayName: displayName || "",
				roles: roles.length > 0 ? roles : ["USER"], // Rol por defecto
				active: true,
				createdAt: new Date(),
			});

		revalidatePath("/admin/usuarios");
		return { success: true };
	} catch (error) {
		console.error("Error creando usuario:", error);
		return { error: error.message || "Error al crear el usuario" };
	}
}

// Actualizar roles de un usuario existente
export async function updateUserRolesAction(userId, newRoles) {
	await verifyAdmin();

	if (!userId) return { error: "ID de usuario inválido" };

	try {
		await adminDb.collection("users").doc(userId).update({
			roles: newRoles,
			updatedAt: new Date(),
		});

		revalidatePath("/admin/usuarios");
		return { success: true };
	} catch (error) {
		return { error: "Error al actualizar roles" };
	}
}

// Eliminar un usuario
export async function deleteUserAction(userId) {
	const adminUid = await verifyAdmin();

	if (userId === adminUid)
		return { error: "No puedes eliminar tu propio usuario" };

	try {
		// Eliminar de Firebase Authentication
		await adminAuth.deleteUser(userId);
		// Eliminar de Firestore
		await adminDb.collection("users").doc(userId).delete();

		revalidatePath("/admin/usuarios");
		return { success: true };
	} catch (error) {
		return { error: "Error al eliminar el usuario" };
	}
}
