"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Receipt,
  Scale,
  ShieldCheck,
  Check,
  X,
  ArrowUpLeft,
} from "lucide-react";

interface PillarItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  metricValue: string;
  metricLabel: string;
  comparison: {
    arian: string;
    traditional: string;
  }[];
}

export function WhyUsSection() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const pillars: PillarItem[] = [
    {
      id: "origin",
      code: "01",
      title: "حضور مستقیم در مبدأ تجارت",
      subtitle: "حذف کامل واسطه‌ها در چین، دبی و ترکیه",
      description:
        "استقرار دفاتر رسمی و انبارهای اختصاصی تجمیع بار در جبل‌علی دبی، گوانجو، ایوو، شنژن و استانبول؛ خرید، بازرسی و حمل مستقیم توسط تیم مقیم آریان خودرو انجام می‌شود.",
      icon: Building2,
      metricValue: "۳ هاب",
      metricLabel: "دفتر و انبار عملیاتی فعال",
      comparison: [
        {
          arian: "دفاتر و انبارهای اختصاصی با کارشناسان مقیم در مبدأ",
          traditional: "واگذاری بار به واسطه‌های دست دوم و سوم محلی",
        },
        {
          arian: "گزارش‌دهی مستمر آنلاین و پشتیبان اختصاصی محموله",
          traditional: "پیگیری‌های تلفنی نامنظم و بی‌اطلاعی از موقعیت بار",
        },
      ],
    },
    {
      id: "finance",
      code: "02",
      title: "شفافیت مالی و تضمین هزینه",
      subtitle: "تعیین دقیق بهای تمام‌شده پیش از خرید",
      description:
        "ارائه Cost Sheet تفصیلی پیش از ثبت سفارش، محاسبه دقیق حقوق ورودی، کارمزد و هزینه‌های لجستیک به صورت مکتوب و بدون تحمیل هزینه‌های پنهان در میانه مسیر.",
      icon: Receipt,
      metricValue: "۰٪",
      metricLabel: "هزینه پنهان یا مابه‌التفاوت",
      comparison: [
        {
          arian: "پیش‌فاکتور دقیق ریالی و تعهد کامل به ارقام قرارداد",
          traditional: "افزایش مداوم هزینه‌های دموراژ و مابه‌التفاوت‌های غیرمنتظره",
        },
        {
          arian: "حواله رسمی ارزی با کمترین نرخ کارمزد از صرافی مجاز",
          traditional: "نرخ‌های مبهم تبدیل ارز و تاخیر در انتقال وجه به فروشنده",
        },
      ],
    },
    {
      id: "customs",
      code: "03",
      title: "تسلط کامل بر قوانین گمرکی",
      subtitle: "عبور سریع و کم‌ریسک از مسیرهای گمرکی",
      description:
        "بهره‌گیری از کارگزاران رسمی گمرک، تعیین دقیق کد تعرفه (HS Code) پیش از حمل و اخذ صفر تا صد مجوزهای استاندارد، محیط زیست و ثبت سفارش در سامانه جامع تجارت.",
      icon: Scale,
      metricValue: "۵ تا ۱۰",
      metricLabel: "روز کاری میانگین زمان ترخیص",
      comparison: [
        {
          arian: "ترخیص ۵ الی ۱۰ روزه با آماده‌سازی اسناد پیش از رسیدن بار",
          traditional: "۲۰ الی ۴۵ روز رسوب کالا در بندر و معطلی اسناد",
        },
        {
          arian: "اخذ صفر تا صد مجوزهای NTSW، استاندارد و دفاع در کمیسیون",
          traditional: "ارجاع کارفرما به سازمان‌ها جهت رفع نقص و گیر مدارک",
        },
      ],
    },
    {
      id: "insurance",
      code: "04",
      title: "پوشش بیمه‌ای ۱۰۰٪ محموله‌ها",
      subtitle: "تضمین سرمایه شما از کارخانه مبدأ تا انبار مقصد",
      description:
        "تمامی محموله‌های خودرویی، کشنده‌های سنگین و قطعات حساس تحت پوشش بیمه‌نامه رسمی تمام‌خطر (All Risks - کلوز A) از لحظه تحویل در مبدأ تا تخلیه در ایران قرار می‌گیرند.",
      icon: ShieldCheck,
      metricValue: "۱۰۰٪",
      metricLabel: "تضمین سرمایه با بیمه کلوز A",
      comparison: [
        {
          arian: "بیمه‌نامه رسمی تمام‌خطر (کلوز A) بین‌المللی به ارزش واقعی",
          traditional: "حمل بدون بیمه یا با حداقل بیمه باربری پایه و سقف محدود",
        },
        {
          arian: "بازرسی فیزیکی و فنی سلامت کالا پیش از بارگیری در مبدأ",
          traditional: "عدم کنترل کیفی در مبدأ و کشف خسارت پس از ترخیص",
        },
      ],
    },
  ];

  const current = pillars[activeTab];

  return (
    <section
      id="why-us"
      className="relative w-full py-16 sm:py-20 bg-zinc-950 text-white overflow-hidden"
      dir="rtl"
    >
      {/* Minimal Ambient Glow */}
      <div className="pointer-events-none absolute top-0 right-1/3 w-[500px] h-[300px] bg-amber-500/[0.05] rounded-full blur-[120px]" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Clean Minimal Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-2.5">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              تمایز اجرایی ما در بازرگانی و ترخیص
            </h2>
          </div>

          <a
            href="#estimator"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-amber-400 transition-colors group self-start sm:self-auto"
          >
            <span>درخواست استعلام و آنالیز هزینه</span>
            <span className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-amber-400/50 group-hover:bg-amber-400/10 transition-all">
              <ArrowUpLeft className="w-3.5 h-3.5" />
            </span>
          </a>
        </div>

        {/* Unified Architectural Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-zinc-900/30 border border-white/[0.07] backdrop-blur-sm overflow-hidden">
          
          {/* Right Column: Sleek Navigation List (4 Cols) */}
          <div className="lg:col-span-4 p-3 sm:p-4 border-b lg:border-b-0 lg:border-l border-white/[0.07] flex flex-col justify-between gap-1.5 bg-zinc-900/20">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeTab === idx;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className="relative w-full p-4 rounded-2xl text-right transition-colors cursor-pointer group flex items-center gap-3.5"
                >
                  {/* Animated Active Background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeWhyUsTab"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      className="absolute inset-0 rounded-2xl bg-zinc-900 border border-white/[0.08] shadow-sm"
                    />
                  )}

                  {/* Active Indicator Line */}
                  {isActive && (
                    <motion.div
                      layoutId="activeWhyUsLine"
                      className="absolute right-0 top-3.5 bottom-3.5 w-1 rounded-l-full bg-amber-400"
                    />
                  )}

                  <div
                    className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? "bg-amber-400 text-zinc-950"
                        : "bg-zinc-900/80 text-zinc-400 group-hover:text-zinc-200 border border-white/[0.05]"
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={2} />
                  </div>

                  <div className="relative z-10 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-zinc-400 group-hover:text-zinc-200"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <span
                        className={`font-mono text-[10px] ${
                          isActive ? "text-amber-400" : "text-zinc-600"
                        }`}
                      >
                        {item.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Left Column: Spacious Spotlight Panel (8 Cols) */}
          <div className="lg:col-span-8 p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative min-h-[340px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex flex-col justify-between h-full gap-8"
              >
                {/* Top Info & Big Stat */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div className="space-y-3 max-w-lg">
                    <div className="inline-flex items-center gap-2 text-[11px] font-medium text-amber-400/90">
                      <span>مزیت رقابتی {current.code}</span>
                      <span className="text-zinc-700">•</span>
                      <span className="text-zinc-400">{current.subtitle}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">
                      {current.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {current.description}
                    </p>
                  </div>

                  {/* Minimalist Typographic KPI */}
                  <div className="sm:text-left shrink-0 px-5 py-3.5 rounded-2xl bg-zinc-900/70 border border-white/[0.06]">
                    <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
                      {current.metricValue}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      {current.metricLabel}
                    </div>
                  </div>
                </div>

                {/* Clean Comparison Split (Arian vs Traditional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-6 border-t border-white/[0.06]">
                  {/* Arian Standard */}
                  <div className="p-4 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </span>
                      <span>استاندارد آریان خودرو</span>
                    </div>
                    <ul className="space-y-2">
                      {current.comparison.map((row, i) => (
                        <li
                          key={i}
                          className="text-xs text-zinc-200 leading-relaxed flex items-start gap-2"
                        >
                          <span className="w-1 h-1 rounded-full bg-emerald-400 mt-2 shrink-0" />
                          <span>{row.arian}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Traditional Method */}
                  <div className="p-4 rounded-2xl bg-zinc-900/40 border border-white/[0.05] space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                      <span className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center">
                        <X className="w-2.5 h-2.5 text-zinc-400" strokeWidth={2.5} />
                      </span>
                      <span>روش‌های سنتی و واسطه‌ای</span>
                    </div>
                    <ul className="space-y-2">
                      {current.comparison.map((row, i) => (
                        <li
                          key={i}
                          className="text-xs text-zinc-500 leading-relaxed flex items-start gap-2"
                        >
                          <span className="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0" />
                          <span>{row.traditional}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}

export default WhyUsSection;