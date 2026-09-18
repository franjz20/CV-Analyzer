import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CV Analyzer",
  description: "Analizá y mejora tu CV con IA",
};

export default function RootLayout({
  children,    
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}