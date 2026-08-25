import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PwaRegister from "@/components/PwaRegister";
import "./globals.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Club Curiyú | Rugby y Hockey — Chajarí, Entre Ríos",
    template: "%s | Club Curiyú",
  },
  description: "Rugby y Hockey en Chajarí, Entre Ríos. Somos una familia.",
  icons: {
    icon: "/escudoi.png",
    apple: "/escudoi.png",
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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#198754",
  colorScheme: "light",
};

export const runtime = "nodejs";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
        <PwaRegister />
      </body>
    </html>
  );
}