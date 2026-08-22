// src/components/layout/Navbar.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

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

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" onClick={close} className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="Club Curiyú"
                        width={60}
                        height={40}
                        className="hidden sm:block"
                    />
                    <span className="text-verde font-display text-3xl font-bold tracking-tight">
                        Curiyú
                    </span>
                </Link>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-1 text-sm font-medium text-oscuro">
                    <Link
                        href="/"
                        className="px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors"
                    >
                        Inicio
                    </Link>
                    <Link
                        href="/historia"
                        className="px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors"
                    >
                        Historia
                    </Link>

                    {/* Rugby dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors">
                            Rugby <ChevronIcon className="w-4 h-4" />
                        </button>
                        <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
                            {rugbyLinks.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className="block px-4 py-2 text-sm hover:bg-verde-suave hover:text-verde transition-colors"
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Hockey dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors">
                            Hockey <ChevronIcon className="w-4 h-4" />
                        </button>
                        <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
                            {hockeyLinks.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className="block px-4 py-2 text-sm hover:bg-verde-suave hover:text-verde transition-colors"
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <Link
                        href="/noticias"
                        className="px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors"
                    >
                        Noticias
                    </Link>
                    <Link
                        href="/fixture"
                        className="px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors"
                    >
                        Fixture
                    </Link>

                    {!user && (
                        <Link
                            href="/login"
                            className="ml-2 bg-verde text-white px-5 py-2 rounded-full hover:bg-verde-oscuro transition-colors shadow-sm"
                        >
                            Ingresar
                        </Link>
                    )}
                    {user && (
                        <span className="ml-2 text-sm text-gray-600">👋 {user.email}</span>
                    )}
                </div>

                {/* Hamburguesa */}
                <button
                    className="md:hidden p-2 rounded-md text-verde"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Menú"
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
                            className="px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors text-sm font-medium"
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/historia"
                            onClick={close}
                            className="px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors text-sm font-medium"
                        >
                            Historia
                        </Link>

                        <button
                            onClick={() => toggle("rugby")}
                            className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-verde-suave text-sm font-medium w-full text-left"
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
                                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-verde transition-colors"
                                    >
                                        {l.label}
                                    </Link>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => toggle("hockey")}
                            className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-verde-suave text-sm font-medium w-full text-left"
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
                                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-verde transition-colors"
                                    >
                                        {l.label}
                                    </Link>
                                ))}
                            </div>
                        )}

                        <Link
                            href="/noticias"
                            onClick={close}
                            className="px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors text-sm font-medium"
                        >
                            Noticias
                        </Link>
                        <Link
                            href="/fixture"
                            onClick={close}
                            className="px-3 py-2 rounded-md hover:bg-verde-suave hover:text-verde transition-colors text-sm font-medium"
                        >
                            Fixture
                        </Link>

                        {!user && (
                            <Link
                                href="/login"
                                onClick={close}
                                className="mt-1 bg-verde text-white text-center px-5 py-2 rounded-full text-sm font-semibold hover:bg-verde-oscuro transition-colors"
                            >
                                Ingresar
                            </Link>
                        )}
                        {user && (
                            <span className="mt-1 text-center text-sm text-gray-600">
                                👋 {user.email}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}