// src/components/admin/NewsForm.jsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createNews, updateNews } from "@/lib/firebase/news";
import { uploadNewsImage } from "@/lib/firebase/storage";

export default function NewsForm({ mode, initialData = {} }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData.title || "");
  const [slug, setSlug] = useState(initialData.slug || "");
  const [excerpt, setExcerpt] = useState(initialData.excerpt || "");
  const [content, setContent] = useState(initialData.content || "");
  const [videoLink, setVideoLink] = useState(initialData.videoLink || "");
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState(initialData.coverImageUrl || "");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setCoverImage(file);
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = coverImageUrl;
      if (coverImage) {
        const finalSlug = slug || generateSlug(title);
        imageUrl = await uploadNewsImage(coverImage, finalSlug);
      }
      const data = {
        title,
        slug: slug || generateSlug(title),
        excerpt,
        content,
        videoLink: videoLink || null,
        coverImageUrl: imageUrl,
      };
      if (mode === "create") {
        await createNews(data);
      } else {
        await updateNews(initialData.id, data);
      }
      router.push("/admin/noticias/listar");
      router.refresh();
    } catch (error) {
      alert("Error al guardar noticia: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 max-w-3xl bg-white p-5 sm:p-8 rounded-xl shadow-sm border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (opcional)</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="se-genera-automaticamente"
          className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Extracto (resumen)</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contenido (HTML permitido)</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          required
          className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Imagen de portada</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-verde/10 file:text-verde hover:file:bg-verde/20"
        />
        {coverImageUrl && !coverImage && (
          <div className="mt-2">
            <img src={coverImageUrl} alt="Portada" className="h-24 w-auto object-cover rounded-lg border border-gray-200" />
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Video (link de Drive)</label>
        <input
          type="url"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          placeholder="https://drive.google.com/file/d/..."
          className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde transition"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-verde text-white px-6 py-2.5 rounded-full hover:bg-verde-oscuro disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base font-medium"
        >
          {loading ? "Guardando..." : mode === "create" ? "Crear" : "Actualizar"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-auto bg-gray-200 text-gray-700 px-6 py-2.5 rounded-full hover:bg-gray-300 transition text-sm sm:text-base font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}