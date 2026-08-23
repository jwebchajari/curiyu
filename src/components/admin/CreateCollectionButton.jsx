// src/components/admin/CreateCollectionButton.jsx
"use client";

import { useState } from "react";

export default function CreateCollectionButton() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const createCollection = async () => {
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/create-news-collection", {
                method: "POST",
            });

            const data = await response.json();

            if (data.success) {
                setMessage("✅ " + data.message);
                // Recargar la página después de 2 segundos
                setTimeout(() => window.location.reload(), 2000);
            } else {
                setMessage("❌ Error: " + data.error);
            }
        } catch (error) {
            setMessage("❌ Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">
                No hay colección "news" en Firestore. Puedes crearla automáticamente:
            </p>
            <button
                onClick={createCollection}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
                {loading ? "Creando..." : "Crear colección 'news'"}
            </button>
            {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
    );
}