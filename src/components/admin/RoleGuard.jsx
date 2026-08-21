"use client";

import { useAuth } from "@/lib/hooks/useAuth";

export default function RoleGuard({ roles = [], children, fallback = null }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-verde"></div>
            </div>
        );
    }

    if (!user) {
        return fallback || (
            <div className="text-center py-16">
                <p className="text-red-600">No autorizado. Iniciá sesión.</p>
            </div>
        );
    }

    const hasPermission = roles.length === 0 || user.roles?.some(role => roles.includes(role));

    if (!hasPermission) {
        return fallback || (
            <div className="text-center py-16">
                <p className="text-red-600">No tenés permisos para acceder a esta sección.</p>
            </div>
        );
    }

    return children;
}