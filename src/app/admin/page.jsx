// src/app/admin/noticias/page.jsx (ejemplo de uso de tabs)
import AdminTabs from "@/components/admin/AdminTabs";

const tabs = [
    { slug: "listar", label: "Listar" },
    { slug: "crear", label: "Crear" },
    { slug: "editar", label: "Editar" },
];

export default function NoticiasPage() {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Noticias</h2>
            <AdminTabs tabs={tabs} basePath="/admin/noticias" />
            {/* Aquí renderizarías el contenido según la ruta activa */}
            <div className="mt-6">
                <p>Contenido de la pestaña actual.</p>
            </div>
        </div>
    );
}