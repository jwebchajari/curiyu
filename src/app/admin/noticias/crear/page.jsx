"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { createNewsAction } from "@/app/admin/noticias/actions";

export default function CrearNoticiaPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Subir imagen a Cloudinary y obtener URL optimizada
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    setImageError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !preset) {
        throw new Error("Faltan variables de entorno de Cloudinary");
      }

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url && data.public_id) {
        // URL optimizada
        const optimizedUrl = `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto,c_scale,w_1200/${data.public_id}`;
        setCoverImageUrl(optimizedUrl);
      } else {
        setImageError(data.error?.message || "Error al subir la imagen");
      }
    } catch (err) {
      setImageError(err.message || "Error al conectar con Cloudinary");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Título y contenido son obligatorios");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    formData.append("coverImageUrl", coverImageUrl);
    formData.append("videoUrl", videoUrl); // Nuevo campo

    const result = await createNewsAction(formData);
    setIsSubmitting(false);
    if (result?.success) {
      router.push("/admin/noticias");
      router.refresh();
    } else {
      setError(result?.error || "Error al guardar");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">➕ Crear Noticia</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-verde"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (opcional)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="se-genera-automatico"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-verde"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Extracto / Descripción corta</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-verde"
            />
          </div>

          {/* Imagen de portada: subir o URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen de portada</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
              >
                {uploadingImage ? "Subiendo..." : "Subir imagen"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://... (o usá el botón para subir)"
                className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-verde"
              />
            </div>
            {coverImageUrl && (
              <div className="mt-2 w-full sm:w-64 h-40 relative">
                <img
                  src={coverImageUrl}
                  alt="Vista previa de portada"
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
            {imageError && <p className="mt-2 text-red-500 text-sm">{imageError}</p>}
          </div>

          {/* URL de video opcional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de video (opcional)</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-verde"
            />
            <p className="mt-1 text-xs text-gray-500">
              Pegá el enlace de YouTube, Vimeo u otro servicio. Se guardará para mostrarlo en la noticia.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contenido</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-verde text-white px-6 py-3 rounded-full font-bold hover:bg-verde-oscuro transition disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : "Publicar Noticia"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-bold hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}