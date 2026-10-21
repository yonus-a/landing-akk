import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "بازرگانی آریان خودرو | پیشرو در تجارت بین‌الملل، واردات خودرو و ترخیص کالا",
  description:
    "گروه بازرگانی و لجستیک بین‌المللی آریان خودرو؛ مدیریت صفر تا صد واردات تخصصی خودرو، کشنده و قطعات یدکی، حمل کانتینری و کارگو هوایی و ترخیص سریع از کلیه گمرکات کشور.",
  keywords: [
    "بازرگانی آریان خودرو",
    "واردات خودرو",
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
