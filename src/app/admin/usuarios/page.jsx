// src/app/admin/usuarios/page.jsx
import { adminDb } from "@/lib/firebase/admin";
import UserManager from "@/components/admin/UserManager";

export const dynamic = 'force-dynamic';

export default async function UsuariosPage() {
    let users = [];
    try {
        const snapshot = await adminDb.collection("users").orderBy("createdAt", "desc").get();

        // 🔥 CORRECCIÓN CRÍTICA: Convertir el Timestamp a string para que no explote
        users = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()
                    ? data.createdAt.toDate().toISOString()
                    : (data.createdAt || null),
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