/**
 * Ruta: src/app/layout.jsx
 * Resumen: Layout raíz de la app. Define metadata global, viewport/PWA,
 *          providers y estructura base (Navbar + main).
 * Lógica: Usa el sistema de metadata de Next.js para SEO/Open Graph/Twitter,
 *         y un export `viewport` separado (requerido desde Next 14) para
 *         themeColor — necesario para que la PWA instalada tome el color
 *         de marca en la barra de estado del celular.
 * Debería: Envolver toda la app con AuthProvider, mostrar Navbar fijo y
 *         renderizar el contenido de cada página dentro de <main>.
 */
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";
import Footer from "@/components/layout/Footer";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Club Curiyú | Rugby y Hockey — Chajarí, Entre Ríos",
    template: "%s | Club Curiyú",
  },
  description: "Rugby y Hockey en Chajarí, Entre Ríos. Somos una familia.",
  // manifest.json/webmanifest lo genera automáticamente Next.js si existe
  // src/app/manifest.js — no hace falta referenciarlo a mano acá.
  icons: {
    icon: "/escudoi.png",
    apple: "/escudoi.png", // clave para el ícono del acceso directo en iOS
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Club Curiyú",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "Club Curiyú",
    title: "Club Curiyú | Rugby y Hockey — Chajarí, Entre Ríos",
    description: "Rugby y Hockey en Chajarí, Entre Ríos. Somos una familia.",
    images: [
      {
        url: "/escudoi.png",
        width: 800,
        height: 600,
        alt: "Escudo del Club Curiyú",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Club Curiyú | Rugby y Hockey — Chajarí, Entre Ríos",
    description: "Rugby y Hockey en Chajarí, Entre Ríos. Somos una familia.",
    images: ["/escudoi.png"],
  },
};

// Export separado (Next.js 14+): acá va todo lo relacionado a viewport/PWA.
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#198754", // mismo verde de marca (--color-verde)
  colorScheme: "light",
};

export const runtime = "nodejs"; // requerido por firebase-admin (adminDb)

// NOTA: se removió `export const dynamic = 'force-dynamic'` de acá.
// Forzarlo a nivel layout hace que TODA la app pierda cache/pre-render,
// afectando Core Web Vitals en páginas que no lo necesitan. Si el home
// (u otra ruta puntual) necesita datos siempre frescos de Firestore,
// declarar `export const dynamic = 'force-dynamic'` directamente en
// ese `page.jsx`, no acá.

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>

      </body>
    </html>
  );
}