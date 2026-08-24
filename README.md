README.txt - Club Curiyú (actualizado)

ESTRUCTURA DEL PROYECTO
========================
src/
├── app/
│   ├── layout.jsx                # Layout principal (pendiente)
│   ├── page.jsx                  # Página de inicio (MEJORADA)
│   ├── fixture/
│   │   ├── page.jsx              # Página pública de fixture
│   │   └── [slug]/
│   │       └── page.jsx          # Detalle de partido
│   └── admin/
│       └── fixture/
│           └── page.jsx          # Gestión de fixture (admin)
│
├── components/
│   ├── admin/
│   │   └── FixtureManager.jsx    # CRUD de partidos (pendiente)
│   ├── layout/
│   │   └── PageHeader.jsx        # Encabezado de página
│   ├── fixture/
│   │   ├── PublicFixture.jsx     # Contenedor de solapas y listas
│   │   ├── MatchCard.jsx         # Tarjeta resumida
│   │   └── MatchDetail.jsx       # Detalle completo
│   └── layout/
│       └── Footer.jsx            # Pie de página
│
├── lib/
│   ├── firebase/
│   │   ├── admin.js              # Firebase Admin SDK
│   │   └── news.js               # Funciones para noticias
│
└── public/
    ├── logo2.png                 # Logo por defecto para partidos
    └── foto-club.jpg             # Imagen de fondo del hero

FUNCIONAMIENTO DE COMPONENTES CLAVE
====================================
- app/page.jsx: página de inicio. Obtiene noticias y partidos. Muestra hero, últimas noticias,
  últimos resultados (con resaltado de Curiyú y Victoria/Derrota/Empate), próximos partidos,
  historia breve.
- app/fixture/page.jsx: lista partidos con solapas por deporte. Consulta por fecha y filtra.
- app/fixture/[slug]/page.jsx: detalle de partido con metadatos dinámicos.
- components/fixture/MatchCard.jsx: tarjeta enlazada a detalle.
- components/fixture/MatchDetail.jsx: detalle completo con estadísticas, acordeón de puntos y compartir.
- lib/firebase/news.js: funciones para obtener noticias.

BASE DE DATOS
=============
- Firestore (NoSQL): colecciones `matches` y `news`.
- Campos matches: sport, category, homeTeam, awayTeam, date, homeScore, awayScore, finished,
  imageUrl, homeTries, awayTries, homeConversions, awayConversions, homePenalties, awayPenalties,
  homeTryPenalties, awayTryPenalties.

ÍNDICES REQUERIDOS
==================
- Para consultas filtradas por sport + date (actualmente se evita en página home/admin usando
  consulta solo por date). Si se implementan, crear índices (sport ASC, date DESC) y (sport ASC, date ASC).

SEO IMPLEMENTADO
================
- Metadata en página de inicio, fixture y detalle.
- Open Graph y Twitter Cards con imagen personalizada en detalle.
- Falta: sitemap.xml, robots.txt, JSON-LD global.

PENDIENTE
=========
- Definir colores personalizados en Tailwind (verde, verde-claro, etc.) si no están.
- Completar SEO global (layout, sitemap, robots).
- Páginas de rugby y hockey.