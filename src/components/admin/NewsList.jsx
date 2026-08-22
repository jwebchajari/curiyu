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
      alert("Error al eliminar");
      console.error(error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {news.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.publishedAt?.toDate?.().toLocaleDateString() || "Sin fecha"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {canManage && (
                  <div className="flex gap-2">
                    <Link href={`/admin/noticias/editar/${item.id}`} className="text-verde hover:underline">Editar</Link>
                    <button onClick={() => handleDelete(item.id, item.coverImageUrl)} className="text-red-600 hover:underline">
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