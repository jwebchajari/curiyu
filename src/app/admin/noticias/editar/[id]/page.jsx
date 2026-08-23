// src/app/admin/noticias/editar/[id]/page.jsx
import { getNewsById } from "@/lib/firebase/news";
import NewsForm from "@/components/admin/NewsForm"; // Asegúrate de que esta ruta sea correcta

export default async function EditarNoticiaPage({ params }) {
  const { id } = await params; // Necesario en Next.js 15/16 para acceder a params
  const rawNews = await getNewsById(id);

  if (!rawNews) return <div>Noticia no encontrada</div>;

  // 🛠️ CORRECCIÓN: Convertimos los Timestamps a strings planos para el cliente
  const news = {
    ...rawNews,
    // Convertimos a ISO String para que el input de fecha del formulario funcione
    publishedAt: rawNews.publishedAt?.toDate?.()
      ? rawNews.publishedAt.toDate().toISOString()
      : rawNews.publishedAt || "",
    updatedAt: rawNews.updatedAt?.toDate?.()
      ? rawNews.updatedAt.toDate().toISOString()
      : rawNews.updatedAt || "",
  };

  return <NewsForm mode="edit" initialData={news} />;
}