// src/app/admin/layout.jsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

const COOKIE_NAME = "session";

export default async function AdminLayout({ children }) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);

    if (!sessionCookie?.value) {
        redirect("/login");
    }

    let uid;
    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie.value);
        uid = decodedClaims.uid;
    } catch (error) {
        console.error("Error al verificar cookie:", error);
        redirect("/login");
    }

    const userDoc = await adminDb.collection("users").doc(uid).get();

    if (!userDoc.exists) {
        console.error(`No existe documento para UID: ${uid}`);
        redirect("/login");
    }

    const userData = userDoc.data();
    if (!userData?.active || !userData?.roles || userData.roles.length === 0) {
        console.error("Usuario inactivo o sin roles:", userData);
        redirect("/login");
    }

    // Pasar userData al header
    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader user={userData} />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}