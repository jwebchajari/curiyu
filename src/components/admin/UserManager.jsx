// src/components/admin/UserManager.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { createUserAction, updateUserRolesAction, deleteUserAction } from "@/app/admin/usuarios/actions";

const AVAILABLE_ROLES = ["USER", "NOTERO", "ADMIN", "SUPER_ROOT"];

export default function UserManager({ users = [] }) {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Asegurar que users sea un array
    const safeUsers = Array.isArray(users) ? users : [];

    const handleCreate = async (formData) => {
        setError("");
        setIsCreating(true);
        const result = await createUserAction(formData);
        setIsCreating(false);

        if (result?.success) {
            router.refresh();
        } else {
            setError(result?.error || "Error al crear usuario");
        }
    };

    const handleRoleChange = async (userId, role) => {
        const user = safeUsers.find(u => u.id === userId);
        const currentRoles = user?.roles || [];
        const newRoles = currentRoles.includes(role)
            ? currentRoles.filter(r => r !== role)
            : [...currentRoles, role];

        const result = await updateUserRolesAction(userId, newRoles);
        if (result?.success) router.refresh();
        else alert(result?.error);
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
        } else {
            alert(result?.error);
        }
        setModalOpen(false);
        setUserToDelete(null);
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Formulario para crear usuario */}
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-oscuro mb-4">➕ Crear Nuevo Usuario</h3>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form action={handleCreate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="email" type="email" placeholder="Email" required className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde" />
                        <input name="password" type="password" placeholder="Contraseña temporal" required className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde" />
                        <input name="displayName" type="text" placeholder="Nombre y Apellido" className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde md:col-span-2" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Roles:</label>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {AVAILABLE_ROLES.map(role => (
                                <label key={role} className="flex items-center gap-2 text-sm cursor-pointer bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-100 transition">
                                    <input type="checkbox" name="roles" value={role} className="rounded border-gray-300 text-verde focus:ring-verde" />
                                    {role}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={isCreating} className="w-full sm:w-auto bg-verde text-white px-6 py-2.5 rounded-full hover:bg-verde-oscuro disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base font-medium">
                        {isCreating ? "Creando..." : "Crear Usuario"}
                    </button>
                </form>
            </div>

            {/* Lista de usuarios existentes */}
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-oscuro mb-4">👥 Usuarios Registrados</h3>

                {safeUsers.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No hay usuarios registrados.</p>
                    </div>
                ) : (
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
                )}
            </div>

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
        </div>
    );
}