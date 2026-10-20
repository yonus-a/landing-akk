"use client";

import React from "react";
import {
  Compass,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpLeft,
  MessageCircle,
} from "lucide-react";

export function Footer() {
  const currentYear = 1404;

  const quickLinks = [
    { label: "صفحه اصلی", href: "#hero" },
    { label: "خدمات بازرگانی", href: "#services" },
    { label: "فرآیند واردات", href: "#workflow" },
    { label: "مزایای رقابتی", href: "#why-us" },
    { label: "استعلام قیمت آنلاین", href: "#estimator" },
    { label: "دفاتر و گمرکات", href: "#hubs" },
    { label: "سوالات متداول", href: "#faq" },
  ];

  const serviceLinks = [
    { label: "واردات تخصصی خودرو و کشنده", href: "#services" },
    { label: "ترخیص کالا از بندر شهید رجایی", href: "#services" },
    { label: "ترخیص کارگو فرودگاه امام", href: "#services" },
    { label: "حمل کانتینری FCL و LCL از چین", href: "#services" },
    { label: "منبع‌یابی و خرید کارخانه در گوانجو", href: "#services" },
    { label: "حوالجات ارزی یوان و درهم", href: "#services" },
    { label: "ثبت سفارش سامانه جامع تجارت NTSW", href: "#services" },
  ];

  return (
    <footer className="relative w-full bg-zinc-950 text-white pt-20 pb-12" dir="rtl">
      <div className="relative max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Top CTA Banner (NO borders) */}
        <div className="p-8 sm:p-11 rounded-3xl bg-zinc-900 mb-16 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="space-y-2 text-center lg:text-right">
            <span className="font-mono text-xs text-amber-400 font-bold tracking-wider">
              READY FOR GLOBAL TRADE?
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
              آماده شروع پروژه واردات یا ترخیص محموله خود هستید؟
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl font-normal leading-relaxed">
              همین حالا با کارشناسان رسمی آریان خودرو تماس حاصل فرمایید یا پیش‌فاکتور خود را جهت دریافت Cost Sheet ارسال نمایید.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#estimator"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
            >
              <span>درخواست استعلام فوری</span>
              <ArrowUpLeft className="w-4 h-4" />
            </a>

            <a
              href="https://wa.me/989120000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>مشاوره در واتس‌اپ</span>
            </a>
          </div>
        </div>

        {/* 4-Column Footer Main Grid (NO borders) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16">
          
          {/* Column 1: Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white shadow-2xs">
                <Compass className="w-5 h-5 text-amber-400" strokeWidth={1.75} />
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight">
                  بازرگانی آریان خودرو
                </span>
                <div className="text-[10px] font-mono text-zinc-500">
                  ARIAN KHODRO TRADING GROUP
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              گروه بین‌المللی بازرگانی و لجستیک آریان خودرو با بیش از ۱۵ سال سابقه مستمر، ارائه‌دهنده زنجیره صفر تا صد خدمات بازرگانی خارجی، واردات خودرو و قطعات یدکی، حمل دریایی و هوایی و ترخیص تخصصی از کلیه گمرکات کشور می‌باشد.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>عضو رسمی اتاق بازرگانی ایران و چین</span>
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-mono text-zinc-300 font-bold pb-1">
              دسترسی سریع
            </div>
            <ul className="space-y-2 text-xs">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Specialized Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-mono text-zinc-300 font-bold pb-1">
              خدمات تخصصی بازرگانی
            </div>
            <ul className="space-y-2 text-xs">
              {serviceLinks.map((service, idx) => (
                <li key={idx}>
                  <a
                    href={service.href}
                    className="text-zinc-400 hover:text-white transition-colors line-clamp-1"
                  >
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Working Hours (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-mono text-zinc-300 font-bold pb-1">
              تماس با دفتر مرکزی تهران
            </div>

            <div className="space-y-2.5 text-xs text-zinc-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  تهران، خیابان ولیعصر، نرسیده به میدان ونک، برج تجارت، طبقه ۸
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a
                  href="tel:02188000000"
                  className="font-mono text-white font-bold hover:underline"
                  dir="ltr"
                >
                  021-88000000 (۱۰ خط)
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                <span className="font-mono">info@ariankhodro-trading.com</span>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <div className="leading-snug text-[11px]">
                  <div>شنبه تا چهارشنبه: ۸:۳۰ الی ۱۷:۳۰</div>
                  <div>پنجشنبه‌ها: ۸:۳۰ الی ۱۳:۰۰</div>
                </div>
              </div>
            </div>

            {/* Trust Badges Placeholder (NO borders) */}
            <div className="pt-3 flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-zinc-900 text-[10px] text-zinc-400 text-center flex-1 shadow-2xs">
                اتاق بازرگانی ایران
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900 text-[10px] text-zinc-400 text-center flex-1 shadow-2xs">
                سامانه جامع تجارت
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900 text-[10px] text-zinc-400 text-center flex-1 shadow-2xs">
                نماد اعتماد بازرگانی
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Blueprint Specs (NO borders) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-mono">
          <div>
            © {currentYear} بازرگانی آریان خودرو. تمامی حقوق مادی و معنوی محفوظ است.
          </div>
          <div className="flex items-center gap-4 text-zinc-500">
            <span>CAD-SPEC // VER 3.2.0</span>
            <span>THREE.JS + GSAP GRAPHITE ENGINE</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
