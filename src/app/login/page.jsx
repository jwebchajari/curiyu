"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { auth, db } from "@/lib/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Image from "next/image"; // o usa <img> si prefieres

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            // 1. Autenticar con Firebase Auth
            await signIn(email, password);
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("Usuario no autenticado");

            // 2. Verificar/crear documento en Firestore
            const userRef = doc(db, "users", currentUser.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: currentUser.email,
                    name: currentUser.displayName || "Usuario",
                    active: true,
                    roles: ["SUPER_ROOT"], // ← Asegura que tenga este rol
                    createdAt: new Date().toISOString(),
                });
                console.log("✅ Documento creado para UID:", currentUser.uid);
            } else {
                console.log("📄 Documento ya existe para UID:", currentUser.uid);
                // Opcional: actualizar el rol si es necesario
                // await updateDoc(userRef, { roles: ["SUPER_ROOT"] });
            }

            // 3. Crear cookie de sesión
            const idToken = await currentUser.getIdToken();
            const res = await fetch("/api/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Error al crear sesión");
            }

            // 4. Redirigir al panel
            router.push("/admin");
        } catch (err) {
            console.error("❌ Error de login:", err);
            const errorCode = err?.code;
            if (
                errorCode === "auth/user-not-found" ||
                errorCode === "auth/wrong-password" ||
                errorCode === "auth/invalid-credential"
            ) {
                setError("Email o contraseña incorrectos.");
            } else if (err?.message?.includes("permissions")) {
                setError("Error de permisos en Firestore. Revisá las reglas.");
            } else {
                setError("Ocurrió un error al iniciar sesión. Intentalo nuevamente.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-16">
            <div className="w-full max-w-md px-4">
                <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8">
                    <div className="text-center mb-8">
                        {/* Usa <img> si no quieres importar Image */}
                        <img
                            src="/logo2.png"
                            alt="Club Curiyú"
                            width="80"
                            height="80"
                            className="rounded-full mx-auto mb-4 object-cover"
                            style={{ width: "80px", height: "80px" }}
                        />
                        <h1 className="font-display text-3xl text-verde">Iniciar Sesión</h1>
                        <p className="text-sm text-oscuro/60 mt-1">
                            Ingresá para acceder al panel de administración
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-oscuro mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde focus:border-transparent"
                                placeholder="tu@email.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-oscuro mb-1">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-verde text-white font-semibold py-2 rounded-full hover:bg-verde-oscuro transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Ingresando..." : "Ingresar"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}