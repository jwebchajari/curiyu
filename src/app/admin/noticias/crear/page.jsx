// src/app/admin/noticias/crear/page.jsx
import NewsForm from "@/components/admin/NewsForm";
export const dynamic = 'force-dynamic';

export default function CrearNoticiaPage() {
  return <NewsForm mode="create" />;
}