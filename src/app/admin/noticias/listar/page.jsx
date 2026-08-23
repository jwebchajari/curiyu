// src/app/admin/noticias/listar/page.jsx
import { redirect } from "next/navigation";

export default function ListarNoticiasPage() {
  // Redirigir a la página principal de noticias
  redirect("/admin/noticias");
}