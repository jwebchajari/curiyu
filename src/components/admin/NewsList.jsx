// src/components/admin/NewsList.jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { deleteNewsAction } from "@/app/admin/noticias/actions";

const FALLBACK_IMAGE = "https://via.placeholder.com/400x200/cccccc/666666?text=Sin+Imagen";

export default function NewsList({ news, canManage }) {
  const [deletingId, setDeletingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);

  const handleDelete = (newsId) => {
    setNewsToDelete(newsId);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!newsToDelete) return;
    setDeletingId(newsToDelete);
    try {
      const result = await deleteNewsAction(newsToDelete);
      if (result?.success) {
        window.location.reload();
      } else {
        alert(result?.error || "Error al eliminar la noticia.");
      }
    } catch (error) {
      console.error("Error en el cliente:", error);
      alert("Error inesperado al comunicarse con el servidor.");
    } finally {
      setModalOpen(false);
      setNewsToDelete(null);
      setDeletingId(null);
    }
  };

  if (!news || !Array.isArray(news) || news.length === 0) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 sm:p-8 text-center">
        <p className="text-yellow-700 text-lg">📭 No hay noticias disponibles</p>
        {canManage && (
          <Link
            href="/admin/noticias/crear"
            className="inline-block mt-4 bg-verde text-white px-5 py-2.5 rounded-full hover:bg-verde-oscuro transition text-sm sm:text-base font-medium"
          >
            + Crear noticia
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 text-sm text-center">
          ✅ {news.length} noticias cargadas correctamente en el cliente
        </div>

        {/* Vista móvil: tarjetas */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-start gap-4">
                {item.coverImageUrl ? (
                  <img
                    src={item.coverImageUrl}
                    alt={item.title || "Noticia"}
                    className="h-16 w-20 object-cover rounded-md bg-gray-100 shrink-0"
                    onError={(e) => {
                      if (e.target.src === FALLBACK_IMAGE) {
                        e.target.style.display = 'none';
                      } else {
                        e.target.src = FALLBACK_IMAGE;
                      }
                    }}
                  />
                ) : (
                  <div className="h-16 w-20 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400 shrink-0">
                    Sin imagen
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm">{item.title || "Sin título"}</h3>
                  <p className="text-xs text-gray-500 mt-1">{item.publishedAt || "Sin fecha"}</p>
                  {canManage && (
                    <div className="flex gap-3 mt-2">
                      <Link
                        href={`/admin/noticias/editar/${item.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                      >
                        {deletingId === item.id ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vista escritorio: tabla */}
        <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
              {news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.title || "Sin título"}</td>
                  <td className="px-6 py-4">
                    {item.coverImageUrl ? (
                      <img
                        src={item.coverImageUrl}
                        alt={item.title || "Noticia"}
                        className="h-12 w-16 object-cover rounded-md bg-gray-100"
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
                        <Link
                          href={`/admin/noticias/editar/${item.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                        >
                          {deletingId === item.id ? "Eliminando..." : "Eliminar"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar noticia"
        message="¿Seguro que deseas eliminar esta noticia? Se perderá todo su contenido."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={deletingId !== null}
      />
    </>
  );
}