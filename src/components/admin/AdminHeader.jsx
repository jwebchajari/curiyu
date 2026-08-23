// src/components/admin/AdminHeader.jsx
"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/firebase/auth";

export default function AdminHeader({ user }) {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
            <div>
                <h1 className="text-lg font-semibold text-gray-800">
                    Bienvenido, {user?.displayName || user?.email || "Admin"}
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                    {user?.roles?.join(", ") || "Sin roles"}
                </span>
                <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                    Cerrar sesión
                </button>
            </div>
        </header>
    );
}