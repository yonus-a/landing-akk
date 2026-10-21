"use client";

import React from "react";
import {
  Building2,
  MapPin,
  Anchor,
  Plane,
  Truck,
  Layers,
} from "lucide-react";

export function GlobalHubsSection() {
  const internationalHubs = [
    {
      city: "دفتر مرکزی تهران",
      country: "ایران",
      address: "خیابان ولیعصر، نرسیده به میدان ونک، برج تجارت، طبقه ۸، واحد ۸۰۴",
      phone: "+98 21 88000000",
      role: "مدیریت قراردادها، امور بانکی و ارزی، سامانه جامع تجارت و هماهنگی کل شعب",
      coords: "35.7575° N, 51.4100° E",
      type: "دفتر مرکزی",
    },
    {
      city: "دفتر و انبار امارات (دبی)",
      country: "امارات متحده عربی",
      address: "Dubai, Business Bay, The Bay Gate Tower & JAFZA Freezone Logistics Hub",
      phone: "+971 4 000 0000",
      role: "انبار تجمیع کالا در جبل‌علی، ترانزیت هوایی و دریایی، حوالجات درهم و خدمات ری‌اکسپورت",
      coords: "25.1972° N, 55.2744° E",
      type: "هاب عملیاتی",
    },
    {
      city: "دفتر و انبار چین (گوانجو و ایوو)",
      country: "جمهوری خلق چین",
      address: "Guangzhou, Tianhe District, Poly Plaza & Yiwu International Trade City Warehouse",
      phone: "+86 20 0000 0000",
      role: "منبع‌یابی کارخانجات، بازرسی فنی و کیفی کالا، صدور بارنامه کانتینری و حواله یوان مستقیم",
      coords: "23.1291° N, 113.2644° E",
      type: "مرکز منبع‌یابی و تجمیع",
    },
    {
      city: "دفتر و هاب ترانزیت ترکیه (استانبول)",
      country: "ترکیه",
      address: "Istanbul, Beylikdüzü Trade Center & Mersin Port Logistics Depot",
      phone: "+90 212 000 0000",
      role: "خرید قطعات خودرو و ماشین‌آلات صنعتی، هماهنگی کاروان تیر زمینی (TIR) به مقصد گمرک بازرگان",
      coords: "41.0082° N, 28.9784° E",
      type: "هاب ترانزیت اروپا",
    },
  ];

  const customsHubs = [
    {
      name: "گمرک شهید رجایی بندرعباس",
      specialty: "بزرگترین بندر کانتینری کشور، ترخیص FCL و کانتینرهای سنگین، خودرو و قطعات یدکی",
      icon: Anchor,
      tag: "بندر کانتینری",
      time: "۵ الی ۸ روز کاری",
    },
    {
      name: "گمرک فرودگاه بین‌المللی امام خمینی (ره)",
      specialty: "کارگو هوایی، ترخیص فوری نمونه کالاها، قطعات حساس الکترونیکی و دارو و لوازم پزشکی",
      icon: Plane,
      tag: "کارگو هوایی",
      time: "۲ الی ۴ روز کاری",
    },
    {
      name: "گمرک بوشهر",
      specialty: "تخصصی خودروهای سبک، کشنده‌ها، لوازم خانگی و کالاهای مشمول تخفیف ۲۰ درصدی ملوانی",
      icon: Anchor,
      tag: "بندر تخصصی خودرو",
      time: "۶ الی ۹ روز کاری",
    },
    {
      name: "گمرک بازرگان و رازی",
      specialty: "دروازه ترانزیت زمینی اروپا و ترکیه، پذیرش کامیون‌های چادری و تریلرهای کشنده جاده‌ای",
      icon: Truck,
      tag: "ترانزیت زمینی",
      time: "۳ الی ۵ روز کاری",
    },
    {
      name: "گمرک خرمشهر و منطقه آزاد اروند",
      specialty: "ترخیص ماشین‌آلات راه‌سازی و معدنی، فولاد، قطعات سنگین و مزایای معافیت‌های منطقه آزاد",
      icon: Anchor,
      tag: "بندر منطقه آزاد",
      time: "۵ الی ۷ روز کاری",
    },
    {
      name: "گمرک غرب تهران و شهریار",
      specialty: "ترخیص ترانزیت داخلی، انبار اختصاصی قطعات یدکی خودرو و تسویه در قلب پایتخت",
      icon: Layers,
      tag: "گمرک پایتخت",
      time: "۳ الی ۵ روز کاری",
    },
  ];

  return (
    <section id="hubs" className="relative w-full py-24 sm:py-32 bg-white dark:bg-zinc-950 transition-colors duration-300" dir="rtl">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pb-12 sm:pb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
            دفاتر بین‌المللی و گمرکات تحت پوشش مستقیم
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
            استقرار شعب فعال در ۴ مرکز کلیدی تجارت جهانی در کنار کارگزاران رسمی و مقیم در ۶ گمرک تراز اول کشور.
          </p>
        </div>

        {/* BLOCK 1: International Operating Hubs */}
        <div className="space-y-4 mb-16">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-zinc-700 dark:text-amber-400" />
              <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                دفاتر عملیاتی و انبارهای لجستیکی خارجی
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              ۴ هاب عملیاتی فعال
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {internationalHubs.map((hub, idx) => (
              <div
                key={idx}
                className="bg-zinc-50/80 dark:bg-zinc-900/80 border border-transparent dark:border-zinc-800/80 rounded-2xl p-6 hover:bg-zinc-100/90 dark:hover:bg-zinc-800/90 transition-all duration-200 flex flex-col justify-between shadow-2xs hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">
                      {hub.type}
                    </span>
                    <MapPin className="w-4 h-4 text-zinc-400" />
                  </div>

                  <h4 className="text-sm font-bold text-zinc-950 dark:text-white mb-1">
                    {hub.city}
                  </h4>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium mb-3">
                    {hub.country}
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal mb-4">
                    {hub.role}
                  </p>
                </div>

                <div className="pt-3 space-y-1 font-mono text-[10px] text-zinc-400">
                  <div className="truncate">GPS: {hub.coords}</div>
                  <div className="text-zinc-700 dark:text-zinc-300 font-bold" dir="ltr">
                    {hub.phone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BLOCK 2: Direct Customs Ports */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Anchor className="w-4 h-4 text-zinc-700 dark:text-amber-400" />
              <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                گمرکات تخصصی تحت پوشش مستقیم با کارگزاران مقیم
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              کارگزاران رسمی مقیم
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customsHubs.map((customs, idx) => {
              const Icon = customs.icon;

              return (
                <div
                  key={idx}
                  className="bg-zinc-50/80 dark:bg-zinc-900/80 border border-transparent dark:border-zinc-800/80 rounded-2xl p-5 hover:bg-zinc-100/90 dark:hover:bg-zinc-800/90 transition-all duration-200 flex items-start gap-3.5 shadow-2xs hover:-translate-y-0.5"
                >
                  <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shrink-0 shadow-2xs">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-400">
                        {customs.tag}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-transparent dark:border-emerald-800/40 font-bold">
                        میانگین: {customs.time}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white">
                      {customs.name}
                    </h4>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                      {customs.specialty}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

export default GlobalHubsSection;
