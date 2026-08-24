README.txt - Club Curiyú (actualizado)

ESTRUCTURA DEL PROYECTO
========================
src/
├── app/
│   ├── layout.jsx                # Layout principal con metadata global (pendiente)
│   ├── page.jsx                  # Home (pendiente)
│   ├── fixture/
│   │   ├── page.jsx              # Página pública de fixture (solapas por deporte)
│   │   └── [slug]/
│   │       └── page.jsx          # Detalle de partido con metadatos dinámicos
│   └── admin/
│       └── fixture/
│           └── page.jsx          # Gestión de fixture (admin)
│
├── components/
│   ├── admin/
│   │   └── FixtureManager.jsx    # CRUD de partidos (pendiente)
│   ├── layout/
│   │   └── PageHeader.jsx        # Encabezado de página
│   └── fixture/
│       ├── PublicFixture.jsx     # Contenedor de solapas y listas
│       ├── MatchCard.jsx         # Tarjeta resumida, enlazada a detalle
│       └── MatchDetail.jsx       # Detalle completo con compartir y estadísticas
│
├── lib/
│   └── firebase/
│       └── admin.js              # Firebase Admin SDK

FUNCIONAMIENTO DE COMPONENTES CLAVE
====================================
- src/app/fixture/page.jsx: lee query param `deporte` (rugby/hockey). Consulta Firestore por fecha y filtra por deporte en memoria (temporal). Idealmente debe usar índice compuesto y filtrar en query.
- src/app/fixture/[slug]/page.jsx: obtiene partido por ID, genera metadatos dinámicos y renderiza MatchDetail.
- src/components/fixture/PublicFixture.jsx: recibe `sport`, `played`, `upcoming`. Muestra solapas con Links, y secciones solo si hay datos.
- src/components/fixture/MatchCard.jsx: tarjeta enlazada a `/fixture/[id]`. Muestra imagen, badge de deporte, marcador y "Ver más".
- src/components/fixture/MatchDetail.jsx: componente cliente. Muestra imagen grande, marcador, estadísticas de tantos con puntos totales, explicación de puntos en acordeón cerrado (try penal = 8) y botón compartir.
- src/app/admin/fixture/page.jsx: obtiene TODOS los partidos ordenados por fecha descendente y los pasa al manager.

BASE DE DATOS
=============
- Firestore (NoSQL), colección `matches`
- Campos: sport, category, homeTeam, awayTeam, date, homeScore, awayScore, finished, imageUrl,
  homeTries, awayTries, homeConversions, awayConversions, homePenalties, awayPenalties,
  homeTryPenalties, awayTryPenalties.

ÍNDICES REQUERIDOS
==================
- (sport ASC, date DESC) para últimos partidos
- (sport ASC, date ASC) para próximos partidos
(se pueden crear desde el enlace del error o consola Firebase)

SEO IMPLEMENTADO
================
- Metadata completa en /fixture y /fixture/[slug] (title, description, openGraph, twitter)
- Página de detalle genera imagen personalizada para compartir.

PENDIENTE
=========
- Crear índices compuestos en Firestore
- Definir color primary en Tailwind
- Completar SEO global (layout, sitemap, robots)
- Página de inicio