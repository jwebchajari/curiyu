// src/app/admin/layout.jsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
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
        if (!userData?.active || !userData?.roles || userData.roles.length === 0) {
            redirect("/login");
        }

        // Convertimos las fechas para que el cliente no explote
        const cleanUserData = {
            ...userData,
            createdAt: userData.createdAt?.toDate?.() ? userData.createdAt.toDate().toISOString() : null,
            updatedAt: userData.updatedAt?.toDate?.() ? userData.updatedAt.toDate().toISOString() : null,
        };

        return (
            <div className="flex h-screen bg-gray-50">
                <AdminSidebar user={cleanUserData} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <AdminHeader user={cleanUserData} />
                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
        );
    } catch (error) {
        redirect("/login");
    }
}