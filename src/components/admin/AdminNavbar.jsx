// src/components/admin/AdminNavbar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/firebase/auth";

export default function AdminNavbar({ user }) {
    const pathname = usePathname();
    const router = useRouter();
    const roles = user?.roles || [];

    const canSeeAll = roles.includes("SUPER_ROOT") || roles.includes("ADMIN");
    const isNotero = roles.includes("NOTERO");

    const links = [
        { href: "/admin", label: "Dashboard", icon: "📊", show: true },
        { href: "/admin/noticias", label: "Noticias", icon: "📰", show: canSeeAll || isNotero },
        { href: "/admin/fixture", label: "Fixture", icon: "📅", show: canSeeAll || isNotero },
        { href: "/admin/usuarios", label: "Usuarios", icon: "👥", show: canSeeAll },
    ];

    const handleLogout = async () => {
        await signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <header className="bg-verde text-white shadow-lg sticky top-0 z-50">
            {/* Fila superior: usuario y logout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <h1 className="text-xl sm:text-2xl font-display font-bold whitespace-nowrap">Curiyú Admin</h1>
                    <span className="hidden sm:inline text-white/60">|</span>
                    <p className="text-sm sm:text-base text-white/90 truncate">
                        {user?.displayName || user?.email || "Admin"}
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs sm:text-sm bg-white/10 px-3 py-1 rounded-full">
                        {roles.join(", ") || "Sin roles"}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-white hover:text-red-200 transition bg-white/10 px-4 py-2 rounded-full hover:bg-white/20"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>

            {/* Fila inferior: enlaces de navegación */}
            <nav className="bg-verde/95 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap gap-1 sm:gap-2 overflow-x-auto">
                    {links.filter((link) => link.show).map((link) => {
                        const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition whitespace-nowrap ${isActive
                                    ? "bg-white text-verde font-bold"
                                    : "hover:bg-white/10 text-white"
                                    }`}
                            >
                                <span className="text-lg">{link.icon}</span>
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </header>
    );
}