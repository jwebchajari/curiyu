// src/components/admin/AdminSidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/noticias", label: "Noticias", icon: "📰" },
    { href: "/admin/rugby", label: "Rugby", icon: "🏉" },
    { href: "/admin/hockey", label: "Hockey", icon: "🏑" },
    { href: "/admin/fixture", label: "Fixture", icon: "📅" },
    { href: "/admin/usuarios", label: "Usuarios", icon: "👤" },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-verde font-display text-xl font-bold">Curiyú Admin</h2>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${pathname === item.href || pathname.startsWith(item.href + "/")
                            ? "bg-verde text-white"
                            : "text-gray-700 hover:bg-verde-suave hover:text-verde"
                            }`}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}