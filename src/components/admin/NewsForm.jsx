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
  const [error, setError] = useState("");
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
    setError("");
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
    } catch (err) {
      console.error("Error detallado:", err);
      setError(err.message || "Error al guardar noticia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Slug (opcional)</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="se-genera-automaticamente"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Extracto (resumen)</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Contenido (HTML permitido)</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Imagen de portada</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="mt-1 block w-full"
        />
        {coverImageUrl && !coverImage && (
          <div className="mt-2">
            <img src={coverImageUrl} alt="Portada" className="h-24 w-auto object-cover rounded" />
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Video (link de Drive)</label>
        <input
          type="url"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          placeholder="https://drive.google.com/file/d/..."
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-verde text-white px-6 py-2 rounded-full hover:bg-verde-oscuro disabled:opacity-50"
        >
          {loading ? "Guardando..." : mode === "create" ? "Crear" : "Actualizar"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}