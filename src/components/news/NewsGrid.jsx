// src/components/news/NewsGrid.jsx
"use client";

import Link from "next/link";
import Image from "next/image";

const FALLBACK_IMAGE = "https://via.placeholder.com/600x400/cccccc/666666?text=Sin+Imagen";

export default function NewsGrid({ news }) {
    if (!news || !Array.isArray(news) || news.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
                <p className="text-gray-500 text-lg">📭 No hay noticias disponibles por el momento.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {news.map((item) => (
                <Link
                    key={item.id}
                    href={`/noticias/${item.slug}`}
                    className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                    {/* Imagen: Altura adaptada para móvil */}
                    <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gray-100">
                        {item.coverImageUrl ? (
                            <img
                                src={item.coverImageUrl}
                                alt={item.title || "Noticia"}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                                onError={(e) => {
                                    if (e.target.src !== FALLBACK_IMAGE) {
                                        e.target.src = FALLBACK_IMAGE;
                                    } else {
                                        e.target.style.display = 'none';
                                    }
                                }}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-4xl opacity-50">📰</div>
                        )}
                    </div>

                    {/* Contenido */}
                    <div className="p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-verde transition-colors mb-2 line-clamp-2">
                            {item.title || "Sin título"}
                        </h2>

                        {item.excerpt && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {item.excerpt}
                            </p>
                        )}

                        <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
                            <span>📅 {item.publishedAt || "Fecha no disponible"}</span>
                            <span className="font-semibold text-verde">Leer más →</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}