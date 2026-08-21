// src/app/layout.jsx
import { Providers } from "./providers";
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
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}