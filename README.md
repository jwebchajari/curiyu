RESUMEN PROYECTO — Club de Rugby y Hockey Curiyú

STACK

Next.js 15 App Router + JSX (sin TypeScript)
React 19 + Tailwind CSS
Firebase Firestore + Storage + Authentication (plan Spark, gratis)
Firebase Admin SDK en servidor (sin Cloud Functions)
Deploy: Vercel

CREDENCIALES YA CONFIGURADAS

.env.local ✅
Firestore activo + reglas cargadas ✅
Authentication Email/Password activado ✅
src/lib/firebase/client.js ✅
src/lib/firebase/admin.js ✅
globals.css + tailwind.config.js ✅

ROLES

Rol Puede hacer
SUPER_ROOT Todo + asignar roles
ADMIN Noticias, partidos, categorías/horarios, ver socios
NOTERO Noticias + cargar partidos y resultados
COBRADOR Socios + pagos/cuotas

Un usuario puede tener múltiples roles.

COLECCIONES FIRESTORE

users → uid, name, email, roles[], active
categories → discipline, gender, name, trainingDays, trainingTime, coachName, order
matches → categoryId, date, isHome, opponent, venue, homeScore, awayScore, status
news → title, slug, excerpt, content, coverImageUrl, authorId, categoryId, publishedAt
members → name, dni, phone, active, joinDate
payments → memberId, amount, period, paidAt, registeredBy
siteStats → key/value (ej: socios_activos: 120, anio_fundacion: 1985)

PÁGINAS (App Router)

/ Home
/historia Historia del club
/rugby Overview rugby + categorías
/rugby/[categoria] Ej: /rugby/masculino-primera
/hockey Overview hockey + categorías
/hockey/[categoria] Ej: /hockey/femenino-primera
/noticias Listado de noticias
/noticias/[slug] Nota individual (OG dinámico para compartir)
/fixture Próximos partidos
/fixture/tabla Tabla de posiciones
/login Login con Firebase Auth
/admin Dashboard (protegido)
/admin/noticias CRUD noticias
/admin/partidos CRUD partidos + resultados
/admin/categorias CRUD categorías + horarios
/admin/socios CRUD socios
/admin/pagos CRUD cuotas
/admin/usuarios CRUD usuarios + roles (solo SUPER_ROOT)

FASES DE DESARROLLO

FASE 1 — Base visual + layout ← ARRANCAMOS ACÁ

globals.css — paleta + variables CSS
tailwind.config.js — colores + fuentes
src/app/layout.jsx — metadata base + JSON-LD SportsOrganization + fuentes
src/components/layout/Navbar.jsx — mobile-first, hamburguesa, menú desplegable rugby/hockey
src/components/layout/Footer.jsx — WhatsApp, Instagram, dirección, créditos
src/app/page.jsx — Home completa (hero, últimas 3 noticias, próximos partidos, historia breve, contador socios/años, galería)

FASE 2 — Auth completo

src/context/AuthContext.jsx — Provider con Firebase Auth client
src/lib/hooks/useAuth.js — hook para consumir contexto
src/app/login/page.jsx — formulario login
src/app/api/session/route.js — crea/destruye cookie con Admin SDK
src/app/admin/layout.jsx — protección server-side por rol
src/components/admin/RoleGuard.jsx — protección client-side por rol específico

FASE 3 — Noticias

src/lib/firebase/news.js — queries Firestore
src/app/noticias/page.jsx — listado
src/app/noticias/[slug]/page.jsx — nota + generateMetadata OG (para compartir por WhatsApp)
src/app/api/og/[slug]/route.jsx — imagen dinámica OG
src/components/news/NewsCard.jsx
src/components/news/NewsGrid.jsx
src/app/admin/noticias/page.jsx — CRUD completo con subida de imagen a Firebase Storage

FASE 4 — Rugby + Hockey

src/lib/firebase/categories.js — queries
src/app/rugby/page.jsx — overview + tabs por categoría
src/app/rugby/[categoria]/page.jsx — categoría individual
src/app/hockey/page.jsx
src/app/hockey/[categoria]/page.jsx
src/app/admin/categorias/page.jsx — CRUD categorías + horarios

FASE 5 — Fixture + Tabla

src/lib/firebase/matches.js — queries
src/app/fixture/page.jsx — próximos partidos + cargar resultados
src/app/fixture/tabla/page.jsx — tabla de posiciones interactiva
src/components/fixture/MatchCard.jsx
src/components/fixture/StandingsTable.jsx
src/app/admin/partidos/page.jsx — CRUD partidos

FASE 6 — Socios + Pagos

src/lib/firebase/members.js
src/app/admin/socios/page.jsx — CRUD socios + estado cuota
src/app/admin/pagos/page.jsx — registrar pagos + historial
src/app/admin/usuarios/page.jsx — asignar roles (solo SUPER_ROOT)

FASE 7 — Historia + SEO final

src/app/historia/page.jsx
JSON-LD NewsArticle en cada nota
src/app/sitemap.js — sitemap dinámico para Google
src/app/robots.js
Revisión metadata en todas las páginas

PARA RETOMAR EN UNA NUEVA CONVERSACIÓN

Pegá esto al inicio del chat:

"Estoy construyendo la web del Club Curiyú con Next.js 15 App Router + JSX + Tailwind + Firebase (Firestore + Storage + Auth). Stack sin TypeScript, deploy en Vercel. Ya tenemos: estructura de carpetas, .env.local, Firebase configurado con reglas, client.js, admin.js, globals.css y tailwind.config.js. Estamos en FASE [X]. El último archivo que completamos fue [archivo]. Continuá desde ahí."



# Club Curiyú — Web del Club de Rugby y Hockey

Sitio web institucional para el Club Curiyú de Chajarí, Entre Ríos, desarrollado con **Next.js 15 (App Router)**, **Tailwind CSS** y **Firebase** como backend. El proyecto busca ser la plataforma digital del club, ofreciendo información actualizada de noticias, fixture, categorías, gestión de socios y pagos, todo con un panel de administración seguro y roles diferenciados.

---

## 🚀 Tecnologías utilizadas

| Tecnología | Propósito |
|------------|-----------|
| **Next.js 15 (App Router)** | Framework React con renderizado híbrido (SSR/SSG/CSR), enrutamiento basado en archivos y optimizaciones automáticas. |
| **React 19** | Biblioteca para construir interfaces de usuario. |
| **Tailwind CSS** | Framework de CSS utilitario para estilos rápidos y consistentes. |
| **Firebase Authentication** | Autenticación de usuarios (email/contraseña). |
| **Firebase Firestore** | Base de datos NoSQL en tiempo real para almacenar noticias, partidos, socios, pagos, etc. |
| **Firebase Storage** | Almacenamiento de imágenes (escudos, fotos de noticias, etc.). |
| **Firebase Admin SDK** | SDK del lado del servidor para verificar sesiones, acceder a Firestore con privilegios administrativos y gestionar usuarios. |
| **Vercel** | Plataforma de despliegue (planificado). |

---

## 📁 Estructura de carpetas (resumida)
src/
├── app/
│ ├── admin/ # Panel de administración (protegido)
│ │ ├── categorias/
│ │ ├── noticias/
│ │ ├── pagos/
│ │ ├── partidos/
│ │ ├── socios/
│ │ ├── usuarios/
│ │ └── layout.jsx # Layout con sidebar y verificación de sesión
│ ├── api/
│ │ ├── logout/
│ │ ├── og/[slug]/ # Generación de imágenes OG para noticias
│ │ └── session/ # Endpoint para crear/destruir cookie de sesión
│ ├── fixture/
│ ├── historia/
│ ├── hockey/
│ ├── login/
│ ├── noticias/
│ ├── rugby/
│ ├── globals.css
│ ├── layout.jsx
│ └── page.jsx # Página de inicio (Home)
├── components/
│ ├── admin/
│ │ ├── AdminHeader.jsx
│ │ ├── AdminSidebar.jsx
│ │ ├── ImageUploader.jsx
│ │ └── RoleGuard.jsx # Componente para proteger partes de UI por rol
│ ├── fixture/
│ │ ├── MatchCard.jsx
│ │ └── StandingsTable.jsx
│ ├── layout/
│ │ ├── Footer.jsx
│ │ └── Navbar.jsx
│ ├── news/
│ │ ├── NewsCard.jsx
│ │ └── NewsGrid.jsx
│ └── ui/ # Componentes reutilizables (Button, Card, etc.)
├── context/
│ └── AuthContext.jsx # Proveedor de autenticación para el cliente
├── lib/
│ ├── firebase/
│ │ ├── admin.js # Inicialización de Firebase Admin SDK
│ │ ├── client.js # Inicialización de Firebase en el cliente
│ │ ├── categories.js # Funciones CRUD para categorías
│ │ ├── matches.js # Funciones CRUD para partidos
│ │ ├── members.js # Funciones CRUD para socios
│ │ └── news.js # Funciones CRUD para noticias
│ └── hooks/
│ └── useAuth.js # Hook personalizado para consumir AuthContext
├── tailwind.config.js
└── .env.local # Variables de entorno (no subir a Git)

text

---

## 🔐 Autenticación y Autorización

### Cliente (`src/lib/firebase/client.js`)
Inicializa Firebase con las variables públicas y exporta `auth` y `db`. Se usa en el frontend para login, registro y escucha del estado de autenticación.

### Admin SDK (`src/lib/firebase/admin.js`)
Inicializa Firebase Admin en el servidor usando credenciales de una cuenta de servicio (clave privada). Proporciona `adminAuth` y `adminDb` para operaciones seguras desde el backend (verificación de tokens, lectura/escritura con permisos totales).

### Contexto de autenticación (`src/context/AuthContext.jsx`)
- Provee el estado del usuario (`user`) y un indicador de carga (`loading`).
- Expone las funciones `signIn` (email/contraseña) y `logout` mediante Firebase Auth.
- Escucha cambios con `onAuthStateChanged` para mantener la sesión sincronizada.

### Hook `useAuth`
Consume el contexto de autenticación. Debe usarse dentro de un `AuthProvider` (envuelve la app en `layout.jsx`).

### Protección de rutas de administración (`src/app/admin/layout.jsx`)
- Verifica la existencia de una cookie de sesión (`session`).
- Si no existe, redirige a `/login`.
- Usa `adminAuth.verifySessionCookie()` para validar la cookie y obtener el `uid`.
- Consulta Firestore (`users/{uid}`) para comprobar que el usuario está activo y tiene al menos un rol.
- Si todo es correcto, renderiza el layout del panel (sidebar + header + contenido).

### Flujo de login
1. El usuario envía email/contraseña desde `/login`.
2. Se llama a `signInWithEmailAndPassword` (Firebase Auth cliente).
3. En el cliente se obtiene un token de ID y se envía a `/api/session` (POST).
4. El endpoint usa `adminAuth.createSessionCookie()` para generar una cookie HTTP‑only (segura).
5. Se redirige al usuario a `/admin`.
6. En `admin/layout.jsx` se valida la cookie en cada petición.

---

## 📦 Funcionalidades principales (planeadas)

### Módulos del panel de administración
- **Noticias**: CRUD con imagen de portada, slug automático, publicación programada.
- **Partidos**: Creación/edición de partidos (local/visitante, resultado, estado).
- **Categorías**: Gestión de disciplinas (Rugby/Hockey), género, horarios de entrenamiento, entrenador.
- **Socios**: Alta/baja, datos de contacto, estado de cuota.
- **Pagos**: Registro de cuotas, historial por socio.
- **Usuarios**: Asignación de roles (solo `SUPER_ROOT`).

### Frontend público
- **Home**: Hero, últimas 3 noticias, próximos partidos, historia breve, estadísticas.
- **Rugby/Hockey**: Páginas con categorías y detalles.
- **Noticias**: Listado completo y vista individual con generación de imagen OG para compartir.
- **Fixture**: Próximos partidos y tabla de posiciones.
- **Historia**: Página institucional.

---

## 🔧 Variables de entorno (`.env.local`)

```env
# Cliente (públicas)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Servidor (privadas, desde cuenta de servicio)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
Importante: La clave privada debe copiarse tal cual del archivo JSON de la cuenta de servicio, incluyendo los \n, y debe ir entre comillas dobles.

📝 Estado actual del proyecto
Fase 1 (completada): Estructura base, layout, navbar, footer, home estática con datos de ejemplo.

Fase 2 (en curso): Autenticación completa (login, protección de rutas, contexto). Ya están implementados los archivos client.js, admin.js, AuthContext, useAuth, admin/layout.jsx y el endpoint /api/session.

Próximas fases: Noticias (CRUD + visualización), Rugby/Hockey, Fixture, Socios y Pagos.

⚙️ Scripts disponibles
bash
npm run dev      # Entorno de desarrollo
npm run build    # Compilación para producción
npm run start    # Servidor en producción
npm run lint     # Ejecuta ESLint
📌 Notas adicionales
No se usa TypeScript, todo está escrito en JSX.

Las reglas de seguridad de Firestore deben configurarse para permitir acceso según el rol del usuario (se recomienda usar Claims personalizados).

El despliegue se hará en Vercel, aprovechando las variables de entorno y la integración continua.