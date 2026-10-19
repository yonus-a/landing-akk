import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cinematic 3D Aviation, Ship & Realistic Semi-Truck — Enhanced",
  description: "Cinematic 3D Aviation, Ship & Realistic Semi-Truck interactive landing experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
