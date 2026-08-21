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
