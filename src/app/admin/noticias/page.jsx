// src/app/admin/noticias/page.jsx
import { getAllNews } from "@/lib/firebase/news";
import NewsList from "@/components/admin/NewsList";
import AdminTabs from "@/components/admin/AdminTabs";

const tabs = [
  { slug: "listar", label: "📋 Listar" },
  { slug: "crear", label: "➕ Crear" },
];

export default async function NoticiasPage() {
  console.log("🔵 [SERVER] Cargando NoticiasPage...");

  let news = [];
  let error = null;

  try {
    const rawNews = await getAllNews();

    // Convertimos las fechas de Firestore a strings legibles
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
    console.error("❌ [SERVER] Error:", err);
    error = err.message;
  }

  // Si no hay noticias, usar datos de prueba para que el dashboard no se vea vacío
  if (news.length === 0) {
    news = [
      { id: "test-1", title: "🔵 Noticia de prueba 1", slug: "noticia-prueba-1", coverImageUrl: "", publishedAt: new Date().toLocaleDateString("es-ES"), updatedAt: new Date().toLocaleDateString("es-ES") },
      { id: "test-2", title: "🟢 Noticia de prueba 2", slug: "noticia-prueba-2", coverImageUrl: "", publishedAt: new Date().toLocaleDateString("es-ES"), updatedAt: new Date().toLocaleDateString("es-ES") }
    ];
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">📰 Noticias</h2>
        <a href="/admin/noticias/crear" className="bg-verde text-white px-4 py-2 rounded-full text-sm hover:bg-verde-oscuro transition">+ Nueva Noticia</a>
      </div>

      <AdminTabs tabs={tabs} basePath="/admin/noticias" />

      <div className="mt-4">
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        ) : (
          // 🔥 AQUÍ ESTÁ LA CLAVE: Pasamos el array `news` correctamente
          <NewsList news={news} canManage={true} />
        )}
      </div>
    </div>
  );
}