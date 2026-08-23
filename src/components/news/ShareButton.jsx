// src/components/news/ShareButton.jsx
"use client";

import { useState } from "react";

export default function ShareButton({ title, url }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            alert("No se pudo copiar el enlace. Cópialo manualmente.");
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: title, url: url });
            } catch (error) {
                if (error.name !== "AbortError") handleCopy();
            }
        } else {
            handleCopy();
        }
    };

    return (
        <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 bg-verde text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-verde-oscuro transition shadow-sm w-auto shrink-0"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            {copied ? "¡Copiado!" : "Compartir"}
        </button>
    );
}