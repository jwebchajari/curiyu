// src/components/admin/ConfirmModal.jsx
"use client";

import { useEffect } from "react";

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "¿Estás seguro?",
    message = "Esta acción no se puede deshacer.",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isLoading = false,
}) {
    // Cerrar con tecla Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            // Bloquear scroll del body mientras el modal está abierto
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Fondo oscuro */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Contenedor del modal */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 border border-gray-100"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* Icono de advertencia */}
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <svg
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                <h3
                    id="modal-title"
                    className="text-lg sm:text-xl font-bold text-center text-gray-900 mb-2"
                >
                    {title}
                </h3>

                <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
                    {message}
                </p>

                <div className="flex flex-col-reverse sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`w-full sm:w-auto flex-1 px-4 py-2.5 rounded-full font-medium text-white transition disabled:opacity-50 ${isLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                            }`}
                    >
                        {isLoading ? "Procesando..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}