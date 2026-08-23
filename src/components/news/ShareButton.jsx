"use client";
import { useState } from "react";

export default function ShareButton({ title, url }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    // fallback to copy
                    handleCopy();
                }
            }
        } else {
            handleCopy();
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            alert("No se pudo copiar el enlace");
        }
    };

    return (
        <button
            onClick={handleShare}
            className="bg-verde text-white px-4 py-2 rounded-full hover:bg-verde-oscuro transition"
        >
            {copied ? "¡Enlace copiado!" : "Compartir"}
        </button>
    );
}