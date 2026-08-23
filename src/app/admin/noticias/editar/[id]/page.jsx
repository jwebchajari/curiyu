// src/app/admin/noticias/editar/[id]/page.jsx
import NewsForm from "@/components/admin/NewsForm";
import { getNewsById } from "@/lib/firebase/news";
export const dynamic = 'force-dynamic';


export default async function EditarNoticiaPage({ params }) {
  const { id } = await params;
  const news = await getNewsById(id);
  if (!news) return <div>Noticia no encontrada</div>;
  return <NewsForm mode="edit" initialData={news} />;
}