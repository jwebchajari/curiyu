// src/components/admin/NewsList.jsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteNews } from "@/lib/firebase/news";
import { deleteNewsImage } from "@/lib/firebase/storage";

export default function NewsList({ news, canManage }) {
  const router = useRouter();

  const handleDelete = async (id, imageUrl) => {
    if (!confirm("¿Eliminar esta noticia?")) return;
    try {
      if (imageUrl) {
        await deleteNewsImage(imageUrl);
      }
      await deleteNews(id);
      router.refresh();
    } catch (error) {
      alert("Error al eliminar: " + error.message);
      console.error(error);
    }
  };

  const crearNoticiaPrueba = async () => {
    try {
      const response = await fetch('/api/test-news', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        alert("✅ Noticia de prueba creada");
        router.refresh();
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (error) {
      alert("❌ Error: " + error.message);
      console.error(error);
    }
  };

  if (!news || news.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 text-center">
        <p className="text-yellow-700">📭 No hay noticias disponibles</p>
        <div className="mt-3 space-x-3">
          {canManage && (
            <>
              <Link
                href="/admin/noticias/crear"
                className="inline-block text-verde hover:underline"
              >
                Crear la primera noticia →
              </Link>
              <button
                onClick={crearNoticiaPrueba}
                className="inline-block bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm"
              >
                🔧 Crear noticia de prueba
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Título
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Imagen
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {news.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                {item.title || "Sin título"}
              </td>
              <td className="px-6 py-4">
                {item.coverImageUrl ? (
                  <img
                    src={item.coverImageUrl}
                    alt={item.title || "Noticia"}
                    className="h-12 w-16 object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">Sin imagen</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.publishedAt?.toDate?.()?.toLocaleDateString("es-ES") || "Sin fecha"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {canManage && (
                  <div className="flex gap-2 items-center">
                    <Link
                      href={`/admin/noticias/editar/${item.id}`}
                      className="text-verde hover:underline font-medium"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id, item.coverImageUrl)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Eliminar
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