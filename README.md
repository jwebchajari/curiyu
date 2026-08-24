README.txt - Club Curiyú (actualizado)

ESTRUCTURA DEL PROYECTO (resumen)
==================================
- src/app/page.jsx: Landing page.
- src/app/fixture/page.jsx: Listado público con solapas.
- src/app/fixture/[slug]/page.jsx: Detalle de partido con banner de imagen grande.
- src/app/noticias/[slug]/page.jsx: Detalle de noticia con contenido enriquecido y SEO completo.
- src/app/admin/fixture/page.jsx: Gestión admin de fixture.
- src/app/admin/fixture/actions.js: Acciones de fixture (CRUD y bulk).
- src/app/admin/noticias/page.jsx: Listado de noticias en admin.
- src/app/admin/noticias/crear/page.jsx: Creación de noticia con editor Tiptap.
- src/app/admin/noticias/actions.js: Acciones de noticias (crear, eliminar).
- src/components/admin/RichTextEditor.jsx: Editor WYSIWYG para noticias.
- src/components/admin/FixtureManager.jsx: Componente cliente de gestión de fixture con imagen y cancelar.
- src/components/fixture/PublicFixture.jsx, MatchCard.jsx, MatchDetail.jsx.
- src/components/layout/PageHeader.jsx, Footer.jsx.
- src/lib/firebase/admin.js, news.js, config.js.
- src/lib/cloudinary-server.js, cloudinary-client.js.

FORMATO EXCEL PARA CARGA MASIVA DE FIXTURE
==========================================
Columnas: "Deporte (rugby/hockey)", "Género", "Nivel", "Equipo Local", "Equipo Visitante", "Fecha (DD-MM-AAAA)"

CLOUDINARY PARA IMÁGENES
=========================
- Variables: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_API_KEY, NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_API_SECRET.
- Upload preset: ml_default (unsigned, sin format en petición).
- Optimización en URL: q_auto,f_auto,c_scale,w_800.
- Las imágenes se muestran con URL original en detalle de noticia y con banner en detalle de partido.

PENDIENTE
=========
- Crear índices compuestos en Firestore para consultas filtradas por sport+date.
- Completar SEO global (sitemap, robots, JSON-LD).