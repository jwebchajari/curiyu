// src/components/layout/Navbar.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

const ChevronIcon = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        width="16"
        height="16"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
        />
    </svg>
);

const rugbyLinks = [
    { href: "/rugby", label: "Overview" },
    { href: "/rugby/masculino-primera", label: "Masculino Primera" },
    { href: "/rugby/femenino-primera", label: "Femenino Primera" },
    { href: "/rugby/masculino-juveniles", label: "Juveniles" },
    { href: "/rugby/masculino-infantiles", label: "Infantiles" },
    { href: "/rugby/veteranos", label: "Veteranos" },
];

const hockeyLinks = [
    { href: "/hockey", label: "Overview" },
    { href: "/hockey/femenino-primera", label: "Femenino Primera" },
    { href: "/hockey/masculino-juveniles", label: "Juveniles Masculino" },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [submenu, setSubmenu] = useState(null);
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();

    // Solo ocultar en rutas de admin
    if (pathname?.startsWith("/admin")) {
        return null;
    }

    const toggle = (name) => setSubmenu((prev) => (prev === name ? null : name));
    const close = () => {
        setMenuOpen(false);
        setSubmenu(null);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            await fetch("/api/logout", { method: "POST" });
            router.push("/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    onClick={close}
                    className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-verde rounded"
                >
                    <Image
                        src="/logo.png"
                        alt="Club Curiyú"
                        width={60}
                        height={40}
                        className="hidden sm:block"
                    />
                    <span className="text-verde font-display text-2xl md:text-3xl font-bold tracking-tight">
                        Curiyú
                    </span>
                </Link>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-1 text-sm font-medium text-oscuro">
                    <Link
                        href="/"
                        className="px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors focus:outline-none focus:ring-2 focus:ring-verde"
                    >
                        Inicio
                    </Link>
                    <Link
                        href="/historia"
                        className="px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors focus:outline-none focus:ring-2 focus:ring-verde"
                    >
                        Historia
                    </Link>

                    {/* Rugby dropdown */}
                    <div className="relative group">
                        <button
                            className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors focus:outline-none focus:ring-2 focus:ring-verde"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            Rugby <ChevronIcon className="w-4 h-4" />
                        </button>
                        <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1 z-10">
                            {rugbyLinks.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className="block px-4 py-2 text-sm hover:bg-verde-suave hover:text-verde transition-colors focus:outline-none focus:ring-2 focus:ring-verde"
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Hockey dropdown */}
                    <div className="relative group">
                        <button
                            className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors focus:outline-none focus:ring-2 focus:ring-verde"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            Hockey <ChevronIcon className="w-4 h-4" />
                        </button>
                        <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1 z-10">
                            {hockeyLinks.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className="block px-4 py-2 text-sm hover:bg-verde-suave hover:text-verde transition-colors focus:outline-none focus:ring-2 focus:ring-verde"
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <Link
                        href="/noticias"
                        className="px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors focus:outline-none focus:ring-2 focus:ring-verde"
                    >
                        Noticias
                    </Link>
                    <Link
                        href="/fixture"
                        className="px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors focus:outline-none focus:ring-2 focus:ring-verde"
                    >
                        Fixture
                    </Link>

                    {!user && (
                        <Link
                            href="/login"
                            className="ml-2 bg-verde text-white px-5 py-2 rounded-full hover:bg-verde-oscuro transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-verde focus:ring-offset-2"
                        >
                            Ingresar
                        </Link>
                    )}
                    {user && (
                        <div className="flex items-center gap-3 ml-2">
                            <span className="text-sm text-gray-600">👋 {user.email}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>

                {/* Hamburguesa */}
                <button
                    className="md:hidden p-2 rounded-md text-verde focus:outline-none focus:ring-2 focus:ring-verde"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Menú"
                    aria-expanded={menuOpen}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {menuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </nav>

            {/* Mobile */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
                    <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
                        <Link
                            href="/"
                            onClick={close}
                            className="px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-verde"
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/historia"
                            onClick={close}
                            className="px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-verde"
                        >
                            Historia
                        </Link>

                        <button
                            onClick={() => toggle("rugby")}
                            className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-verde-suave text-sm font-medium w-full text-left focus:outline-none focus:ring-2 focus:ring-verde"
                            aria-expanded={submenu === "rugby"}
                        >
                            Rugby
                            <ChevronIcon
                                className={`w-4 h-4 transition-transform ${submenu === "rugby" ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {submenu === "rugby" && (
                            <div className="pl-4 flex flex-col gap-1">
                                {rugbyLinks.map((l) => (
                                    <Link
                                        key={l.href}
                                        href={l.href}
                                        onClick={close}
                                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-verde transition-colors focus:outline-none focus:ring-2 focus:ring-verde"
                                    >
                                        {l.label}
                                    </Link>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => toggle("hockey")}
                            className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-verde-suave text-sm font-medium w-full text-left focus:outline-none focus:ring-2 focus:ring-verde"
                            aria-expanded={submenu === "hockey"}
                        >
                            Hockey
                            <ChevronIcon
                                className={`w-4 h-4 transition-transform ${submenu === "hockey" ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {submenu === "hockey" && (
                            <div className="pl-4 flex flex-col gap-1">
                                {hockeyLinks.map((l) => (
                                    <Link
                                        key={l.href}
                                        href={l.href}
                                        onClick={close}
                                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-verde transition-colors focus:outline-none focus:ring-2 focus:ring-verde"
                                    >
                                        {l.label}
                                    </Link>
                                ))}
                            </div>
                        )}

                        <Link
                            href="/noticias"
                            onClick={close}
                            className="px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-verde"
                        >
                            Noticias
                        </Link>
                        <Link
                            href="/fixture"
                            onClick={close}
                            className="px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-verde"
                        >
                            Fixture
                        </Link>

                        {!user && (
                            <Link
                                href="/login"
                                onClick={close}
                                className="mt-1 bg-verde text-white text-center px-5 py-2 rounded-full text-sm font-semibold hover:bg-verde-oscuro transition-colors focus:outline-none focus:ring-2 focus:ring-verde focus:ring-offset-2"
                            >
                                Ingresar
                            </Link>
                        )}
                        {user && (
                            <div className="mt-1 flex flex-col gap-2">
                                <span className="text-center text-sm text-gray-600">
                                    👋 {user.email}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white text-center px-5 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}