RESUMEN DEL PROYECTO — CLUB CURIYÚ
=======================================

1. STACK TECNOLÓGICO
--------------------
- Next.js 15 (App Router) — enrutamiento y renderizado híbrido.
- React 19 + JSX (sin TypeScript).
- Tailwind CSS — estilos utilitarios.
- Firebase: Authentication (email/password), Firestore (base de datos), Storage (solo para uso interno, no se usa para imágenes).
- Cloudinary — almacenamiento de imágenes (subida directa desde el cliente).
- Vercel — despliegue.

2. AUTENTICACIÓN Y SESIONES
---------------------------
- Login con email/contraseña vía Firebase Auth.
- Cookie de sesión HTTP‑only generada con Firebase Admin SDK (creada en /api/session).
- Verificación de cookie en layouts de servidor (admin/layout.jsx, admin/noticias/page.jsx).
- Contexto de autenticación (AuthContext) en cliente con onAuthStateChanged, y hook useAuth.
- Roles: ADMIN, NOTERO, COBRADOR, SUPER_ROOT. Se guardan en Firestore (colección users).
- Protección de rutas admin: si el usuario no tiene roles activos, redirige a /login.

3. PANEL DE ADMINISTRACIÓN
---------------------------
- Layout con sidebar (AdminSidebar) y header (AdminHeader) con botón de logout.
- Sidebar: enlaces a Dashboard, Noticias, Rugby, Hockey, Fixture, Usuarios.
- Header: muestra nombre/email del usuario y botón de cierre de sesión.
- Protección por roles: se verifica en cada página del panel.

4. MÓDULO DE NOTICIAS (completado)
----------------------------------
- CRUD completo: listar, crear, editar, eliminar.
- Roles requeridos: ADMIN o NOTERO.
- Campos de la noticia:
   - Título (obligatorio)
   - Slug (se genera automáticamente si no se proporciona)
   - Extracto (resumen corto)
   - Contenido (HTML permitido)
   - Imagen de portada (se sube a Cloudinary, se convierte a WebP con compresión)
   - Video (enlace de Google Drive, solo texto)
- Listado de noticias en /admin/noticias/listar con tabla.
- Formulario de creación/edición en /admin/noticias/crear y /admin/noticias/editar/[id].
- Eliminación: borra la imagen de Cloudinary y el documento de Firestore.
- Tabs en la interfaz para navegar entre listar y crear.

5. SUBIDA DE IMÁGENES (Cloudinary)
-----------------------------------
- Se usa Cloudinary como servicio de almacenamiento de imágenes.
- Subida directa desde el cliente (sin pasar por servidor) usando un upload preset unsigned.
- Compresión automática a WebP (máx. 1200px, < 0.5 MB) mediante la librería browser-image-compression.
- La URL de la imagen se guarda en el campo coverImageUrl de la noticia en Firestore.
- Las credenciales se almacenan en .env (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET).

6. ESTRUCTURA DE CARPETAS (resumida)
-------------------------------------
src/
├── app/
│   ├── admin/
│   │   ├── noticias/
│   │   │   ├── page.jsx          (listado con tabs)
│   │   │   ├── crear/page.jsx
│   │   │   └── editar/[id]/page.jsx
│   │   └── layout.jsx            (verificación de sesión y roles)
│   ├── api/
│   │   ├── session/route.js      (crea cookie)
│   │   └── logout/route.js       (elimina cookie)
│   └── login/page.jsx            (formulario de login)
├── components/
│   ├── admin/
│   │   ├── AdminHeader.jsx
│   │   ├── AdminSidebar.jsx
│   │   ├── AdminTabs.jsx
│   │   ├── NewsList.jsx
│   │   ├── NewsForm.jsx
│   │   └── RoleGuard.jsx
│   └── layout/
│       ├── Navbar.jsx            (oculto en rutas /admin)
│       └── Footer.jsx
├── lib/
│   ├── firebase/
│   │   ├── client.js             (inicialización Firebase en cliente)
│   │   ├── admin.js              (inicialización Admin SDK)
│   │   ├── news.js               (CRUD de noticias en Firestore)
│   │   └── storage.js            (funciones de subida/eliminación a Cloudinary)
│   ├── cloudinary.js             (configuración de Cloudinary)
│   └── hooks/
│       └── useAuth.js
├── context/
│   └── AuthContext.jsx           (proveedor de autenticación)
└── .env.local                    (variables de entorno)

7. VARIABLES DE ENTORNO (.env.local)
-------------------------------------
# Firebase cliente (públicas)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin (privadas)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=news_preset

8. DEPENDENCIAS PRINCIPALES
----------------------------
- firebase, firebase-admin
- next, react, react-dom
- tailwindcss
- browser-image-compression (para comprimir antes de subir)
- cloudinary (SDK para Node, aunque solo se usa la configuración)
- (No se usa @cloudinary/react ni @cloudinary/url-gen)

9. ESTADO ACTUAL Y PRÓXIMOS PASOS
----------------------------------
- Fase 1 y 2 completas: estructura, autenticación, protección de rutas.
- Fase 3 completada: CRUD de noticias con Cloudinary.
- Pendiente: Rugby/Hockey (categorías, horarios), Fixture (partidos, tabla), Socios y Pagos, Historia, SEO, etc.
- El código está en JSX (sin TypeScript) y utiliza el App Router de Next.js.

10. CÓMO FUNCIONA EL FLUJO DE UNA NOTICIA
-------------------------------------------
1. El usuario autenticado con rol ADMIN/NOTERO accede a /admin/noticias/crear.
2. Completa el formulario y selecciona una imagen.
3. Al enviar:
   - Si hay imagen, se comprime con browser-image-compression a WebP.
   - Se sube a Cloudinary mediante fetch directo (upload preset unsigned).
   - Se obtiene la URL segura (secure_url).
   - Se crea el documento en Firestore con todos los datos, incluyendo coverImageUrl.
4. La noticia aparece en el listado (/admin/noticias/listar).
5. Se puede editar (cambiar imagen, campos) o eliminar (borra imagen y documento).

11. NOTAS IMPORTANTES
----------------------
- El Navbar público se oculta automáticamente en rutas /admin (por la condición en Navbar.jsx).
- La cookie de sesión tiene una duración de 5 días (configurable en MAX_AGE).
- Las reglas de Firestore y Cloudinary deben permitir escritura/lectura a usuarios autenticados con roles.
- La imagen de portada no es obligatoria; el video es opcional.
- El slug se genera a partir del título si no se proporciona manualmente.

12. COMANDOS ÚTILES
-------------------
npm run dev         # desarrollo
npm run build       # compilar para producción
npm start           # ejecutar en producción
npm run lint        # ESLint (revisa el código)

---
Documentación actualizada al 22/08/2026.