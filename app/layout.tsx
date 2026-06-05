import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Playlists",
  description:
    "Busque músicas, monte suas playlists e ouça prévias de 30 segundos. Um mini-player com músicas de verdade, sem cadastro.",
  applicationName: "Playlists",
  openGraph: {
    title: "Playlists",
    description: "Monte playlists e ouça prévias de músicas de verdade. Sem cadastro.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0a14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
