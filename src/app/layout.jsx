import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";


export const metadata = {
  title: "Club Curiyú",
  description: "Rugby y Hockey en Chajarí, Entre Ríos",
};



// src/app/layout.jsx
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}