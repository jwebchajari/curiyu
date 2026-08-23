// src/components/admin/NewsList.jsx
"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteNewsAction } from "@/app/admin/noticias/actions";

const FALLBACK_IMAGE = "https://via.placeholder.com/400x200/cccccc/666666?text=Sin+Imagen";

export default function NewsList({ news, canManage }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (newsId) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta noticia? Esta acción no se puede deshacer.")) {
      startTransition(async () => {
        const result = await deleteNewsAction(newsId);
        if (result?.success) {
          router.refresh(); // Esto actualiza los datos en pantalla
        } else {
          alert(result?.error || "Error al eliminar la noticia.");
        }
      });
    }
  };

  // Si no hay noticias
  if (!news || !Array.isArray(news) || news.length === 0) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-md p-8 text-center">
        <p className="text-yellow-700 text-lg">📭 No hay noticias disponibles</p>
        {canManage && (
          <Link
            href="/admin/noticias/crear"
            className="inline-block mt-4 bg-verde text-white px-4 py-2 rounded-full hover:bg-verde-oscuro transition"
          >
            + Crear noticia
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <div className="bg-green-50 border-2 border-green-200 rounded-md p-2 mb-4 text-sm text-center">
        ✅ {news.length} noticias cargadas correctamente en el cliente
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {news.map((item, index) => (
            <tr key={item.id || index} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">{item.title || "Sin título"}</td>
              <td className="px-6 py-4">
                {item.coverImageUrl ? (
                  <img
                    src={item.coverImageUrl}
                    alt={item.title || "Noticia"}
                    className="h-12 w-16 object-cover rounded bg-gray-100"
                    onError={(e) => {
                      if (e.target.src === FALLBACK_IMAGE) {
                        e.target.style.display = 'none';
                      } else {
                        e.target.src = FALLBACK_IMAGE;
                      }
                    }}
                  />
                ) : (
                  <span className="text-gray-400 text-xs">Sin imagen</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.publishedAt || "Sin fecha"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {canManage && (
                  <div className="flex gap-3 items-center">
                    <Link href={`/admin/noticias/editar/${item.id}`} className="text-blue-600 hover:text-blue-800 font-medium">Editar</Link>

                    {/* Botón de Eliminar */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isPending}
                      className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}