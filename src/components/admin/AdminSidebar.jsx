// src/components/admin/AdminSidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar({ user }) {
    const pathname = usePathname();
    const roles = user?.roles || [];

    // 🔥 ADMIN y SUPER_ROOT ven todo
    const canSeeAll = roles.includes("SUPER_ROOT") || roles.includes("ADMIN");
    // NOTERO ve Noticias y Fixture
    const isNotero = roles.includes("NOTERO");

    const links = [
        { href: "/admin", label: "Dashboard", icon: "📊", show: true }, // Todos lo ven
        { href: "/admin/noticias", label: "Noticias", icon: "📰", show: canSeeAll || isNotero },
        // 🔥 NUEVO: El Notero ahora puede acceder a Fixture
        { href: "/admin/fixture", label: "Fixture", icon: "📅", show: canSeeAll || isNotero },
        { href: "/admin/usuarios", label: "Usuarios", icon: "👥", show: canSeeAll },
    ];

    return (
        <aside className="w-64 bg-verde text-white flex flex-col h-screen">
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-display font-bold">Curiyú Admin</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {links.filter((link) => link.show).map((link) => (
                    <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === link.href ? "bg-white text-verde font-bold" : "hover:bg-white/10"}`}>
                        <span>{link.icon}</span>
                        {link.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}