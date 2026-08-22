// src/app/admin/noticias/page.jsx
import { getAllNews } from "@/lib/firebase/news";
import NewsList from "@/components/admin/NewsList";
import AdminTabs from "@/components/admin/AdminTabs";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const tabs = [
  { slug: "listar", label: "Listar" },
  { slug: "crear", label: "Crear" },
];

export default async function NoticiasPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  if (!sessionCookie?.value) redirect("/login");

  let uid;
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie.value);
    uid = decoded.uid;
  } catch {
    redirect("/login");
  }

  const userDoc = await adminDb.collection("users").doc(uid).get();
  if (!userDoc.exists) redirect("/login");
  const userData = userDoc.data();
  const roles = userData?.roles || [];
  const canManage = roles.some(r => r === "ADMIN" || r === "NOTERO");
  if (!canManage) redirect("/admin");

  const news = await getAllNews();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Noticias</h2>
        {canManage && (
          <a href="/admin/noticias/crear" className="bg-verde text-white px-4 py-2 rounded-full text-sm hover:bg-verde-oscuro transition">
            + Nueva Noticia
          </a>
        )}
      </div>
      <AdminTabs tabs={tabs} basePath="/admin/noticias" />
      <NewsList news={news} canManage={canManage} />
    </div>
  );
}