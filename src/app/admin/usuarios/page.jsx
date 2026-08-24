// src/components/admin/UserManager.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { createUserAction, updateUserRolesAction, deleteUserAction } from "@/app/admin/usuarios/actions";

const AVAILABLE_ROLES = ["USER", "NOTERO", "ADMIN", "SUPER_ROOT"];

// Componente Toast para notificaciones
function Toast({ message, type = "success", onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            <div className={`px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${type === "success" ? "bg-green-600" : "bg-red-600"
                }`}>
                {message}
            </div>
        </div>
    );
}

export default function UserManager({ users = [] }) {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Estados para el modal de credenciales
    const [showCredentials, setShowCredentials] = useState(false);
    const [newCredentials, setNewCredentials] = useState({ email: "", password: "" });

    // Estados para toast
    const [toast, setToast] = useState(null);

    // Estado para mostrar/ocultar contraseña en el formulario
    const [showPassword, setShowPassword] = useState(false);

    // Asegurar que users sea un array
    const safeUsers = Array.isArray(users) ? users : [];

    const showToast = (message, type = "success") => {
        setToast({ message, type });
    };

    const handleCreate = async (formData) => {
        setError("");
        setIsCreating(true);

        const email = formData.get("email")?.toString() || "";
        const password = formData.get("password")?.toString() || "";

        const result = await createUserAction(formData);
        setIsCreating(false);

        if (result?.success) {
            setNewCredentials({ email, password });
            setShowCredentials(true);
            router.refresh();
        } else {
            setError(result?.error || "Error al crear usuario");
            showToast(result?.error || "Error al crear usuario", "error");
        }
    };

    const handleRoleChange = async (userId, role) => {
        const user = safeUsers.find(u => u.id === userId);
        const currentRoles = user?.roles || [];
        const newRoles = currentRoles.includes(role)
            ? currentRoles.filter(r => r !== role)
            : [...currentRoles, role];

        const result = await updateUserRolesAction(userId, newRoles);
        if (result?.success) {
            router.refresh();
            showToast("Roles actualizados correctamente");
        } else {
            showToast(result?.error || "Error al actualizar roles", "error");
        }
    };

    const handleDelete = (userId) => {
        setUserToDelete(userId);
        setModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        const result = await deleteUserAction(userToDelete);
        if (result?.success) {
            router.refresh();
            showToast("Usuario eliminado correctamente");
        } else {
            showToast(result?.error || "Error al eliminar usuario", "error");
        }
        setModalOpen(false);
        setUserToDelete(null);
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            showToast("Copiado al portapapeles");
        } catch (err) {
            console.error("Error al copiar:", err);
            showToast("No se pudo copiar. Copia manualmente.", "error");
        }
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Formulario para crear usuario */}
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-oscuro mb-4">➕ Crear Nuevo Usuario</h3>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form action={handleCreate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            required
                            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde"
                        />
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Contraseña temporal"
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <input
                            name="displayName"
                            type="text"
                            placeholder="Nombre y Apellido"
                            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde md:col-span-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Roles:</label>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {AVAILABLE_ROLES.map(role => (
                                <label
                                    key={role}
                                    className="flex items-center gap-2 text-sm cursor-pointer bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-100 transition"
                                >
                                    <input
                                        type="checkbox"
                                        name="roles"
                                        value={role}
                                        className="rounded border-gray-300 text-verde focus:ring-verde"
                                    />
                                    {role}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isCreating}
                        className="w-full sm:w-auto bg-verde text-white px-6 py-2.5 rounded-full hover:bg-verde-oscuro disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base font-medium"
                    >
                        {isCreating ? "Creando..." : "Crear Usuario"}
                    </button>
                </form>
            </div>

            {/* Lista de usuarios existentes */}
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-oscuro mb-4">👥 Usuarios Registrados</h3>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Roles</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {safeUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 text-sm text-gray-900">{user.email}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{user.displayName || "-"}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                            {AVAILABLE_ROLES.map(role => (
                                                <button
                                                    key={role}
                                                    onClick={() => handleRoleChange(user.id, role)}
                                                    className={`text-xs px-2.5 py-1 rounded-full border transition whitespace-nowrap ${user.roles?.includes(role)
                                                        ? "bg-verde text-white border-verde"
                                                        : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {role}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-600 hover:text-red-800 text-sm font-medium whitespace-nowrap"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de confirmación para eliminar */}
            <ConfirmModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={confirmDelete}
                title="Eliminar usuario"
                message="¿Estás seguro de eliminar este usuario? Perderá acceso al sistema."
                confirmText="Eliminar"
                cancelText="Cancelar"
                isLoading={false}
            />

            {/* Modal para mostrar credenciales temporales */}
            {showCredentials && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowCredentials(false)}
                        aria-hidden="true"
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 border border-gray-100">
                        <div className="text-center mb-6">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Usuario creado exitosamente</h3>
                            <p className="text-sm text-gray-600 mt-2">
                                Compartí estas credenciales con el usuario. La contraseña no se volverá a mostrar.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={newCredentials.email}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(newCredentials.email)}
                                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                                        title="Copiar email"
                                    >
                                        📋
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Contraseña temporal</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={newCredentials.password}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(newCredentials.password)}
                                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                                        title="Copiar contraseña"
                                    >
                                        📋
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowCredentials(false)}
                            className="w-full mt-6 bg-verde text-white px-6 py-2.5 rounded-full font-medium hover:bg-verde-oscuro transition"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {/* Toast de notificación */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}