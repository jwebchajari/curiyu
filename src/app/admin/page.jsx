// src/app/admin/noticias/page.jsx
import { getAllNews } from "@/lib/firebase/news";
import NewsList from "@/components/admin/NewsList";
import AdminTabs from "@/components/admin/AdminTabs";
export const dynamic = 'force-dynamic';


const tabs = [
    { slug: "listar", label: "📋 Listar" },
    { slug: "crear", label: "➕ Crear" },
];

export default async function NoticiasPage() {
    console.log("🔵 [SERVER] Cargando NoticiasPage...");

    // Obtener noticias
    let news = [];
    let error = null;

    try {
        const rawNews = await getAllNews();

        // 🛠️ CORRECCIÓN AQUÍ: Convertimos los objetos de Firestore a objetos planos
        news = rawNews.map((item) => ({
            ...item,
            // Convertimos las fechas de Firestore a strings simples
            publishedAt: item.publishedAt?.toDate?.()
                ? item.publishedAt.toDate().toLocaleDateString("es-ES")
                : (item.publishedAt || "Sin fecha"),
            updatedAt: item.updatedAt?.toDate?.()
                ? item.updatedAt.toDate().toLocaleDateString("es-ES")
                : (item.updatedAt || "Sin fecha"),
            // Si hay campos anidados con fechas, conviértelos también aquí
        }));

        console.log(`✅ [SERVER] ${news.length} noticias cargadas`);
    } catch (err) {
        console.error("❌ [SERVER] Error:", err);
        error = err.message;
    }

    // Datos de prueba si no hay noticias
    if (news.length === 0) {
        console.log("📊 [SERVER] Usando datos de prueba");
        news = [
            {
                id: "test-1",
                title: "🔵 Noticia de prueba 1",
                slug: "noticia-prueba-1",
                excerpt: "Esta es una noticia de prueba",
                content: "<p>Contenido de prueba</p>",
                coverImageUrl: "https://via.placeholder.com/400x200/22c55e/ffffff?text=Test",
                publishedAt: new Date().toLocaleDateString("es-ES"), // Ya es string
                updatedAt: new Date().toLocaleDateString("es-ES")
            },
            // ... (el segundo dato de prueba igual, con fechas string)
        ];
    }

    console.log(`📊 [SERVER] Enviando ${news.length} noticias al cliente`);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">📰 Noticias</h2>
                <a
                    href="/admin/noticias/crear"
                    className="bg-verde text-white px-4 py-2 rounded-full text-sm hover:bg-verde-oscuro transition"
                >
                    + Nueva Noticia
                </a>
            </div>

            <AdminTabs tabs={tabs} basePath="/admin/noticias" />

            <div className="mt-4">
                {error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <strong>Error:</strong> {error}
                    </div>
                ) : (
                    <NewsList news={news} canManage={true} />
                )}
            </div>
        </div>
    );
}