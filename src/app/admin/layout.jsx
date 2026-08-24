// src/app/admin/layout.jsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

const COOKIE_NAME = "session";

export default async function AdminLayout({ children }) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(COOKIE_NAME);

        if (!sessionCookie?.value) redirect("/login");

        let uid;
        try {
            const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie.value);
            uid = decodedClaims.uid;
        } catch (error) {
            redirect("/login");
        }

        let userDoc;
        try {
            userDoc = await adminDb.collection("users").doc(uid).get();
        } catch (error) {
            redirect("/login");
        }

        if (!userDoc.exists) redirect("/login");

        const userData = userDoc.data();

        // 🔥 CRÍTICO: Verificar roles válidos
        const allowedRoles = ["ADMIN", "SUPER_ROOT", "NOTERO"];
        const hasValidRole = userData?.roles?.some(role => allowedRoles.includes(role));

        if (!userData?.active || !hasValidRole) {
            redirect("/login");
        }

        // Limpiar fechas para que el cliente no explote
        const cleanUserData = {
            ...userData,
            createdAt: userData.createdAt?.toDate?.() ? userData.createdAt.toDate().toISOString() : null,
            updatedAt: userData.updatedAt?.toDate?.() ? userData.updatedAt.toDate().toISOString() : null,
        };

        return (
            <div className="flex flex-col h-screen bg-gray-50">
                {/* Usamos tu AdminNavbar que contiene header y navegación */}
                <AdminNavbar user={cleanUserData} />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        );
    } catch (error) {
        redirect("/login");
    }
}