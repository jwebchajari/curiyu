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
        if (!userData?.active || !userData?.roles || userData.roles.length === 0) {
            redirect("/login");
        }

        const cleanUserData = {
            ...userData,
            createdAt: userData.createdAt?.toDate?.() ? userData.createdAt.toDate().toISOString() : null,
            updatedAt: userData.updatedAt?.toDate?.() ? userData.updatedAt.toDate().toISOString() : null,
        };

        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <AdminNavbar user={cleanUserData} />
                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    {children}
                </main>
            </div>
        );
    } catch (error) {
        redirect("/login");
    }
}