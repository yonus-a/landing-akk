"use client";

import React from "react";
import {
  Building2,
  Receipt,
  Scale,
  ShieldCheck,
  Check,
  X,
  Sparkles,
} from "lucide-react";

export function WhyUsSection() {
  const pillars = [
    {
      title: "حضور مستقیم در مبدأ تجارت",
      description:
        "دفاتر رسمی و انبارهای اختصاصی تجمیع بار در دبی (جبل‌علی)، چین (گوانجو، ایوو و شنژن) و ترکیه (استانبول). حذف دلال‌ها و ارتباط بی‌واسطه با تولیدکنندگان تراز اول.",
      icon: Building2,
      code: "PILLAR-01",
    },
    {
      title: "شفافیت مالی و تضمین کمترین هزینه",
      description:
        "ارائه Cost Sheet تفصیلی پیش از خرید، تعیین ریالی کارمزد و هزینه‌های گمرکی، بدون تحمیل هزینه‌های غیرمنتظره و پنهان در میانه یا پایان فرآیند ترخیص.",
      icon: Receipt,
      code: "PILLAR-02",
    },
    {
      title: "تسلط کامل بر قوانین و تعرفه‌های گمرکی",
      description:
        "بهره‌گیری از کارگزاران رسمی مقیم گمرکات، شناخت به‌روز ردیف تعرفه‌ها (HS Code) و بخشنامه‌های صمت جهت عبور سریع از مسیرهای سبز و زرد و جلوگیری مطلق از دموراژ.",
      icon: Scale,
      code: "PILLAR-03",
    },
    {
      title: "پوشش بیمه‌ای ۱۰۰٪ محموله‌ها",
      description:
        "تضمین تمام‌خطر (All Risks) برای انواع خودرو، کشنده‌ها و قطعات حساس از لحظه تحویل به انبار مبدأ تا تخلیه نهایی در کارخانه یا انبار مشتری در ایران.",
      icon: ShieldCheck,
      code: "PILLAR-04",
    },
  ];

  const comparisons = [
    {
      metric: "سرعت ترخیص از بنادر",
      arian: "۵ الی ۱۰ روز کاری (برنامه‌ریزی پیش از رسیدن کشتی)",
      traditional: "۲۰ الی ۴۵ روز (رسوب کالا و معطلی اسناد)",
    },
    {
      metric: "شفافیت مالی و قرارداد",
      arian: "پیش‌فاکتور دقیق ریالی بدون تغییر و تحمیل هزینه پنهان",
      traditional: "افزایش مداوم هزینه‌های دموراژ و مابه‌التفاوت",
    },
    {
      metric: "حضور مستقیم در چین و دبی",
      arian: "دفاتر و انبارهای اختصاصی فعال با کارشناسان مقیم",
      traditional: "واگذاری به واسطه‌های دست دوم و سوم محلی",
    },
    {
      metric: "پوشش بیمه‌ای کالا",
      arian: "بیمه‌نامه رسمی تمام‌خطر (کلوز A) بین‌المللی و داخلی",
      traditional: "بدون بیمه یا حداقل بیمه باربری پایه",
    },
    {
      metric: "سامانه رهگیری محموله",
      arian: "گزارش‌دهی مستمر الکترونیکی و پشتیبان اختصاصی",
      traditional: "پیگیری‌های تلفنی نامنظم و عدم اطلاع از موقعیت",
    },
    {
      metric: "مجوزهای استاندارد و صمت",
      arian: "اخذ صفر تا صد مجوزهای NTSW و دفاع در کمیسیون",
      traditional: "ارجاع کارفرما به نهادها جهت رفع گیر مدارک",
    },
  ];

  return (
    <section id="why-us" className="relative w-full py-24 sm:py-32 bg-white" dir="rtl">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pb-12 sm:pb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 text-xs font-mono text-zinc-600 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>{"// 03 — COMPETITIVE ADVANTAGES"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 tracking-tight">
            چرا بازرگانان و صنعتگران آریان خودرو را انتخاب می‌کنند؟
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
            ترکیب سابقه ۱۵ ساله، دفاتر عملیاتی در کشورهای مبدأ، و تسلط عمیق بر رویه‌های گمرکی ایران، ما را به شریک تجاری معتمد برندها و صنایع مبدل ساخته است.
          </p>
        </div>

        {/* 2-Column Split: 4 Pillars (Left) & Comparison Matrix (Right) - NO borders */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: 4 Pillars (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.code}
                  className="p-6 rounded-2xl bg-zinc-50/80 hover:bg-zinc-100/90 transition-all duration-200 flex items-start gap-4 shadow-2xs hover:-translate-y-0.5"
                >
                  <div className="p-3 rounded-xl bg-zinc-900 text-white shrink-0 mt-0.5 shadow-2xs">
                    <Icon className="w-5 h-5 text-amber-400" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm sm:text-base font-bold text-zinc-950">
                        {pillar.title}
                      </h3>
                      <span className="font-mono text-[10px] text-zinc-400">
                        {pillar.code}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Comparison Matrix (7 cols, NO borders) */}
          <div className="lg:col-span-7 bg-zinc-50/70 rounded-3xl p-7 sm:p-9 flex flex-col justify-between shadow-[0_10px_35px_rgba(0,0,0,0.02)]">
            <div>
              <div className="flex items-center justify-between pb-4">
                <div className="space-y-1">
                  <span className="font-mono text-[11px] text-zinc-400 font-bold">
                    COMPARISON BENCHMARK
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-zinc-950">
                    مقایسه شیوه اجرایی آریان خودرو با روش‌های سنتی
                  </h3>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs font-mono text-zinc-600 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>ISO CERTIFIED</span>
                </div>
              </div>

              {/* Rows (NO borders) */}
              <div className="mt-4 space-y-2.5 text-xs">
                {comparisons.map((c, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white/80 grid grid-cols-12 gap-3 items-center shadow-2xs">
                    
                    <div className="col-span-12 sm:col-span-4 font-bold text-zinc-900">
                      {c.metric}
                    </div>

                    <div className="col-span-12 sm:col-span-4 bg-emerald-50/80 p-2.5 rounded-lg text-emerald-950 font-medium flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2} />
                      <span className="leading-snug">{c.arian}</span>
                    </div>

                    <div className="col-span-12 sm:col-span-4 bg-zinc-100/70 p-2.5 rounded-lg text-zinc-500 font-normal flex items-center gap-1.5">
                      <X className="w-4 h-4 text-zinc-400 shrink-0" strokeWidth={1.5} />
                      <span className="leading-snug">{c.traditional}</span>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Note */}
            <div className="mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
              <span>گزارش ماهانه شاخص‌های کیفی با ۹۹.۸٪ رضایت تجار و صنعتگران</span>
              <a
                href="#estimator"
                className="font-bold text-zinc-950 hover:underline"
              >
                ثبت استعلام محموله شما ←
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default WhyUsSection;
