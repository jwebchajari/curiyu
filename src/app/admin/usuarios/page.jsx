// src/app/admin/usuarios/page.jsx
import { adminDb, adminAuth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserManager from "@/components/admin/UserManager";

export const dynamic = 'force-dynamic';

export default async function UsuariosPage() {
    // Verificación de sesión y permisos
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    if (!sessionCookie?.value) redirect("/login");

    let uid;
    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie.value);
        uid = decodedClaims.uid;
    } catch {
        redirect("/login");
    }

    const userDoc = await adminDb.collection("users").doc(uid).get();
    if (!userDoc.exists) redirect("/login");
    const roles = userDoc.data()?.roles || [];

    // Solo ADMIN o SUPER_ROOT pueden ver usuarios
    if (!roles.includes("ADMIN") && !roles.includes("SUPER_ROOT")) {
        redirect("/admin");
    }

    // Obtener usuarios
    let users = [];
    try {
        const snapshot = await adminDb.collection("users").orderBy("createdAt", "desc").get();
        users = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : null,
                updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : null,
            };
        });
    } catch (error) {
        console.error("Error obteniendo usuarios:", error);
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-oscuro mb-6">Gestión de Usuarios</h1>
            <UserManager users={users} />
        </div>
    );
}