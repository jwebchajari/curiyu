// src/components/admin/UserManager.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserAction, updateUserRolesAction, deleteUserAction } from "@/app/admin/usuarios/actions";

const AVAILABLE_ROLES = ["USER", "NOTERO", "ADMIN", "SUPER_ROOT"];

export default function UserManager({ users }) {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");

    const handleCreate = async (formData) => {
        setError("");
        setIsCreating(true);
        const result = await createUserAction(formData);
        setIsCreating(false);

        if (result?.success) {
            router.refresh();
            // Limpiar formulario (opcional, recargando automáticamente)
        } else {
            setError(result?.error || "Error al crear usuario");
        }
    };

    const handleRoleChange = async (userId, role) => {
        // Toggle del rol en el array
        const user = users.find(u => u.id === userId);
        const currentRoles = user?.roles || [];
        const newRoles = currentRoles.includes(role)
            ? currentRoles.filter(r => r !== role)
            : [...currentRoles, role];

        const result = await updateUserRolesAction(userId, newRoles);
        if (result?.success) router.refresh();
        else alert(result?.error);
    };

    const handleDelete = async (userId) => {
        if (confirm("¿Estás seguro de eliminar este usuario?")) {
            const result = await deleteUserAction(userId);
            if (result?.success) router.refresh();
            else alert(result?.error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Formulario para crear usuario */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-bold text-oscuro mb-4">➕ Crear Nuevo Usuario</h3>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

                <form action={handleCreate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="email" type="email" placeholder="Email" required className="input" />
                        <input name="password" type="password" placeholder="Contraseña temporal" required className="input" />
                        <input name="displayName" type="text" placeholder="Nombre y Apellido" className="input md:col-span-2" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Roles:</label>
                        <div className="flex flex-wrap gap-3">
                            {AVAILABLE_ROLES.map(role => (
                                <label key={role} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" name="roles" value={role} className="rounded border-gray-300 text-verde focus:ring-verde" />
                                    {role}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={isCreating} className="bg-verde text-white px-6 py-2 rounded-full hover:bg-verde-oscuro disabled:opacity-50">
                        {isCreating ? "Creando..." : "Crear Usuario"}
                    </button>
                </form>
            </div>

            {/* Lista de usuarios existentes */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 overflow-x-auto">
                <h3 className="text-xl font-bold text-oscuro mb-4">👥 Usuarios Registrados</h3>

                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Roles</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-4 py-3 text-sm text-gray-900">{user.email}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{user.displayName || "-"}</td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-2">
                                        {AVAILABLE_ROLES.map(role => (
                                            <button
                                                key={role}
                                                onClick={() => handleRoleChange(user.id, role)}
                                                className={`text-xs px-2 py-1 rounded-full border transition ${user.roles?.includes(role)
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
                                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}