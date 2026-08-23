// src/app/login/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            console.log("🔄 Iniciando login para:", email);

            // 1. Autenticar con Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("✅ Usuario autenticado:", userCredential.user.uid);

            const idToken = await userCredential.user.getIdToken();
            console.log("✅ Token ID obtenido");

            // 2. Crear cookie de sesión
            console.log("🔄 Creando sesión...");
            const response = await fetch("/api/session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ idToken }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("❌ Error en /api/session:", data);
                throw new Error(data.error || "Error al crear sesión");
            }

            console.log("✅ Sesión creada exitosamente");

            // 3. Redirigir al admin
            router.push("/admin");
            router.refresh();
        } catch (error) {
            console.error("❌ Error de login:", error);
            setError(error.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="flex justify-center">
                        <Image
                            src="/logo.png"
                            alt="Curiyú Club"
                            width={120}
                            height={120}
                            className="h-24 w-auto"
                            priority
                        />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Iniciar Sesión
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ingresá para acceder al panel de administración
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-verde focus:border-verde focus:z-10 sm:text-sm"
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-verde focus:border-verde focus:z-10 sm:text-sm"
                                placeholder="Contraseña"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-verde hover:bg-verde-oscuro focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde disabled:opacity-50"
                        >
                            {loading ? "Iniciando sesión..." : "Ingresar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}