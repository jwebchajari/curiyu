// src/components/admin/AdminHeader.jsx
"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";

export default function AdminHeader({ user }) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            await fetch("/api/logout", { method: "POST" });
            router.push("/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    // Mostrar nombre o email
    const displayName = user?.name || user?.email || "Administrador";

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">Panel de Administración</h1>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700 font-medium">{displayName}</span>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-full text-sm hover:bg-red-700 transition-colors"
                >
                    Cerrar Sesión
                </button>
            </div>
        </header>
    );
}