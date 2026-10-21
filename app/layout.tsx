import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "جهان‌گستر | پیشرو در تجارت بین‌الملل، لجستیک و ترخیص کالا",
  description:
    "گروه بازرگانی و لجستیک بین‌المللی جهان‌گستر؛ مدیریت صفر تا صد واردات و صادرات، حمل کانتینری دریایی، کارگو هوایی، ترانزیت جاده‌ای و ترخیص سریع کالا از کلیه گمرکات کشور.",
  keywords: [
    "جهان‌گستر",
    "لجستیک بین‌الملل",
    "ترخیص کالا",
    "حمل کانتینری",
    "کارگو هوایی",
    "گمرک شهید رجایی",
    "ثبت سفارش NTSW",
    "حواله ارزی درهم یوان",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white transition-colors duration-300">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
