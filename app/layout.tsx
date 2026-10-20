import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cinematic 3D Aviation, Ship & Realistic Semi-Truck — Graphite Edition",
  description: "Cinematic 3D Aviation, Ship & Realistic Semi-Truck interactive graphite drawing experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="antialiased">
      <body className="min-h-screen bg-white text-zinc-900">{children}</body>
    </html>
  );
}
