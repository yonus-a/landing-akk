import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="fa" dir="rtl" className="antialiased scroll-smooth">
      <body className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
