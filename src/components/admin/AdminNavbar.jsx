"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export default function AdminNavbar({ user }) {
    const pathname = usePathname();
    const router = useRouter();
    const roles = user?.roles || [];
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const canSeeAll = roles.includes("SUPER_ROOT") || roles.includes("ADMIN");
    const isNotero = roles.includes("NOTERO");

    const links = [
        { href: "/admin", label: "Dashboard", icon: "📊", show: true },
        { href: "/admin/noticias", label: "Noticias", icon: "📰", show: canSeeAll || isNotero },
        { href: "/admin/fixture", label: "Fixture", icon: "📅", show: canSeeAll || isNotero },
        { href: "/admin/usuarios", label: "Usuarios", icon: "👥", show: canSeeAll },
    ];

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
        router.refresh();
    };

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="bg-verde text-white shadow-lg sticky top-0 z-50">
            {/* Contenedor principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">

                {/* Logo y Título (compacto en móvil) */}
                <div className="flex items-center gap-2 min-w-0">
                    <h1 className="text-lg sm:text-2xl font-display font-bold whitespace-nowrap">Curiyú Admin</h1>
                    <span className="hidden md:inline text-white/60">|</span>
                    <p className="hidden md:block text-sm text-white/90 truncate max-w-[200px]">
                        {user?.displayName || user?.email || "Admin"}
                    </p>
                </div>

                {/* Botón Hamburguesa (solo visible en móvil) */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition"
                    aria-label="Abrir menú"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Zona de Usuario y Logout (solo en escritorio) */}
                <div className="hidden md:flex items-center gap-3">
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

            {/* Menú desplegable para móvil */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-verde/95 border-t border-white/10 px-4 pb-4 pt-2 space-y-1">
                    {links.filter((link) => link.show).map((link) => {
                        const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={handleLinkClick}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition ${isActive ? "bg-white text-verde font-bold" : "hover:bg-white/10 text-white"
                                    }`}
                            >
                                <span className="text-xl">{link.icon}</span>
                                {link.label}
                            </Link>
                        );
                    })}

                    {/* Información de usuario y Logout en móvil */}
                    <div className="pt-3 border-t border-white/10 mt-2 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm text-white/80 truncate">
                                {user?.displayName || user?.email || "Admin"}
                            </p>
                            <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                                {roles.join(", ") || "Sin roles"}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full text-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            )}

            {/* Navegación horizontal para escritorio */}
            <nav className="hidden md:block bg-verde/95 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex gap-1 sm:gap-2">
                    {links.filter((link) => link.show).map((link) => {
                        const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition whitespace-nowrap ${isActive ? "bg-white text-verde font-bold" : "hover:bg-white/10 text-white"
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