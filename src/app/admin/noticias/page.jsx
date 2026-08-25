// src/app/admin/noticias/page.jsx
import { getAllNews } from "@/lib/firebase/news";
import NewsList from "@/components/admin/NewsList";
import AdminTabs from "@/components/admin/AdminTabs";

const tabs = [
  { slug: "listar", label: "📋 Listar" },
  { slug: "crear", label: "➕ Crear" },
];

export default async function NoticiasPage() {
  let news = [];
  let error = null;

  try {
    const rawNews = await getAllNews();
    console.log(`[Admin Noticias] ${rawNews.length} noticias obtenidas`);

    news = rawNews.map((item) => ({
      ...item,
      publishedAt: item.publishedAt?.toDate?.()
        ? item.publishedAt.toDate().toLocaleDateString("es-ES")
        : (item.publishedAt || "Sin fecha"),
      updatedAt: item.updatedAt?.toDate?.()
        ? item.updatedAt.toDate().toLocaleDateString("es-ES")
        : (item.updatedAt || "Sin fecha"),
    }));
  } catch (err) {
    console.error("[Admin Noticias] Error:", err);
    error = err.message;
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">📰 Noticias</h2>
        <a
          href="/admin/noticias/crear"
          className="inline-flex items-center justify-center bg-verde text-white px-5 py-2.5 rounded-full text-sm sm:text-base font-medium hover:bg-verde-oscuro transition shadow-sm hover:shadow-md"
        >
          + Nueva Noticia
        </a>
      </div>

      <AdminTabs tabs={tabs} basePath="/admin/noticias" />

      <div>
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xl text-gray-600">📭 No hay noticias publicadas aún</p>
            <p className="text-sm text-gray-400 mt-2">Crea tu primera noticia desde el botón superior</p>
          </div>
        ) : (
          <NewsList news={news} canManage={true} />
        )}
      </div>
    </div>
  );
}