"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { RoutePattern } from "@/components/RoutePattern";
import {
  Building2,
  Receipt,
  Scale,
  ShieldCheck,
  Check,
  X,
  ArrowUpLeft,
} from "lucide-react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

function RadarMotif() {
  const pins = [
    [190, 210],
    [410, 250],
    [330, 430],
  ];
  return (
    <svg viewBox="0 0 600 600" fill="none" stroke="currentColor" className="w-full h-full">
      {[70, 140, 210, 280].map((r, i) => (
        <motion.circle
          key={r}
          cx={300}
          cy={300}
          r={r}
          strokeWidth={1.2}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: i * 0.1, ease: EASE_OUT }}
        />
      ))}
      <line x1={20} y1={300} x2={580} y2={300} strokeWidth={0.8} strokeDasharray="4 8" />
      <line x1={300} y1={20} x2={300} y2={580} strokeWidth={0.8} strokeDasharray="4 8" />
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 7, ease: "linear", repeat: Infinity }}>
        <circle cx={300} cy={300} r={290} stroke="none" />
        <path d="M300 300 L300 20 A280 280 0 0 1 498 102 Z" fill="currentColor" fillOpacity={0.18} stroke="none" />
        <line x1={300} y1={300} x2={300} y2={20} strokeWidth={2} />
      </motion.g>
      {pins.map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={5} fill="currentColor" stroke="none" />
          <motion.circle
            cx={cx}
            cy={cy}
            strokeWidth={1.5}
            initial={{ r: 5, opacity: 0.9 }}
            animate={{ r: 26, opacity: 0 }}
            transition={{ duration: 2.2, delay: i * 0.6, repeat: Infinity, ease: "easeOut" }}
          />
        </g>
      ))}
    </svg>
  );
}

function LedgerMotif() {
  const bars = [110, 170, 140, 230, 200, 290, 350];
  const baseY = 480;
  const tops = bars.map((h, i) => [96 + i * 66 + 18, baseY - h] as const);
  const trend = tops.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y - 24}`).join(" ");
  return (
    <svg viewBox="0 0 600 600" fill="none" stroke="currentColor" className="w-full h-full">
      {[180, 260, 340, 420].map((y) => (
        <line key={y} x1={60} y1={y} x2={560} y2={y} strokeWidth={0.8} strokeDasharray="4 8" />
      ))}
      <line x1={60} y1={baseY} x2={560} y2={baseY} strokeWidth={1.5} />
      {bars.map((h, i) => (
        <motion.rect
          key={i}
          x={96 + i * 66}
          y={baseY - h}
          width={36}
          height={h}
          rx={6}
          fill="currentColor"
          fillOpacity={0.12}
          strokeWidth={1.2}
          style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease: EASE_OUT }}
        />
      ))}
      <motion.path
        d={trend}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.7, ease: "easeInOut" }}
      />
      {tops.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y - 24}
          r={5}
          fill="currentColor"
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 + i * 0.15 }}
        />
      ))}
    </svg>
  );
}

function SealMotif() {
  return (
    <svg viewBox="0 0 600 600" fill="none" stroke="currentColor" className="w-full h-full">
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 40, ease: "linear", repeat: Infinity }}>
        <circle cx={300} cy={300} r={260} strokeWidth={1.5} strokeDasharray="2 12" strokeLinecap="round" />
        <circle cx={300} cy={300} r={236} strokeWidth={1} />
      </motion.g>
      <motion.g animate={{ rotate: -360 }} transition={{ duration: 28, ease: "linear", repeat: Infinity }}>
        <circle cx={300} cy={300} r={196} strokeWidth={6} strokeDasharray="34 14" />
      </motion.g>
      <circle cx={300} cy={300} r={150} strokeWidth={1.5} fill="currentColor" fillOpacity={0.08} />
      <motion.path
        d="M235 302 L283 350 L372 252"
        strokeWidth={14}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      />
    </svg>
  );
}

function ShieldMotif() {
  const shield = "M300 60 L500 140 V300 C500 420 410 510 300 550 C190 510 100 420 100 300 V140 Z";
  return (
    <svg viewBox="0 0 600 600" fill="none" stroke="currentColor" className="w-full h-full">
      <motion.path
        d={shield}
        strokeWidth={1}
        transform="translate(300 305) scale(1.08) translate(-300 -305)"
        initial={{ opacity: 0.15 }}
        animate={{ opacity: [0.15, 0.6, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {[1, 0.74, 0.48].map((scale, i) => (
        <g key={scale} transform={`translate(300 305) scale(${scale}) translate(-300 -305)`}>
          <motion.path
            d={shield}
            strokeWidth={2 / scale}
            fill="currentColor"
            fillOpacity={0.05}
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.3, delay: i * 0.25, ease: "easeInOut" }}
          />
        </g>
      ))}
    </svg>
  );
}

interface PillarItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  motif: React.ComponentType;
  accent: string;
  glow: readonly [left: string, top: string];
  metricValue: string;
  metricLabel: string;
  comparison: {
    arian: string;
    traditional: string;
  }[];
}

const pillars: PillarItem[] = [
  {
    id: "origin",
    title: "حضور مستقیم در مبدأ تجارت",
    subtitle: "حذف کامل واسطه‌ها در چین، دبی و ترکیه",
    description:
      "استقرار دفاتر رسمی و انبارهای اختصاصی تجمیع بار در جبل‌علی دبی، گوانجو، ایوو، شنژن و استانبول؛ خرید، بازرسی و حمل مستقیم توسط تیم مقیم جهان‌گستر انجام می‌شود.",
    icon: Building2,
    motif: RadarMotif,
    accent: "#f5a524",
    glow: ["22%", "30%"],
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
    title: "شفافیت مالی و تضمین هزینه",
    subtitle: "تعیین دقیق بهای تمام‌شده پیش از خرید",
    description:
      "ارائه Cost Sheet تفصیلی پیش از ثبت سفارش، محاسبه دقیق حقوق ورودی، کارمزد و هزینه‌های لجستیک به صورت مکتوب و بدون تحمیل هزینه‌های پنهان در میانه مسیر.",
    icon: Receipt,
    motif: LedgerMotif,
    accent: "#34d399",
    glow: ["35%", "75%"],
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
    title: "تسلط کامل بر قوانین گمرکی",
    subtitle: "عبور سریع و کم‌ریسک از مسیرهای گمرکی",
    description:
      "بهره‌گیری از کارگزاران رسمی گمرک، تعیین دقیق کد تعرفه (HS Code) پیش از حمل و اخذ صفر تا صد مجوزهای استاندارد، محیط زیست و ثبت سفارش در سامانه جامع تجارت.",
    icon: Scale,
    motif: SealMotif,
    accent: "#a78bfa",
    glow: ["70%", "25%"],
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
    title: "پوشش بیمه‌ای ۱۰۰٪ محموله‌ها",
    subtitle: "تضمین سرمایه شما از کارخانه مبدأ تا انبار مقصد",
    description:
      "تمامی محموله‌های خودرویی، کشنده‌های سنگین و قطعات حساس تحت پوشش بیمه‌نامه رسمی تمام‌خطر (All Risks - کلوز A) از لحظه تحویل در مبدأ تا تخلیه در ایران قرار می‌گیرند.",
    icon: ShieldCheck,
    motif: ShieldMotif,
    accent: "#38bdf8",
    glow: ["80%", "70%"],
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

export function WhyUsSection() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const current = pillars[activeTab];
  const Motif = current.motif;

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="why-us"
        className="relative w-full py-16 sm:py-20 bg-zinc-950 text-white overflow-hidden"
        dir="rtl"
        style={{ "--accent": current.accent } as React.CSSProperties}
      >
        <RoutePattern
          className="opacity-50"
          hub={{ x: 1120, y: 300 }}
          origins={[
            { x: 80, y: 160 },
            { x: 240, y: 820 },
            { x: 820, y: 880 },
            { x: 1420, y: 820 },
          ]}
        />

        {/* Pillar-synced ambient glow */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute w-[42rem] h-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
          initial={false}
          animate={{ left: current.glow[0], top: current.glow[1], backgroundColor: current.accent }}
          transition={{ duration: 1.4, ease: EASE_OUT }}
          style={{ opacity: 0.14 }}
        />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="space-y-2.5">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                تمایز اجرایی ما در بازرگانی و ترخیص
              </h2>
            </div>

            <a
              href="#estimator"
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-(--accent) transition-colors group self-start sm:self-auto"
            >
              <span>درخواست استعلام و آنالیز هزینه</span>
              <span className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-(--accent)/50 group-hover:bg-(--accent)/10 transition-all">
                <ArrowUpLeft className="w-3.5 h-3.5" />
              </span>
            </a>
          </div>

          {/* Frame */}
          <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-zinc-900/30 border border-(--accent)/15 backdrop-blur-sm overflow-hidden transition-colors duration-700">
            {/* Navigation list */}
            <div className="lg:col-span-4 p-3 sm:p-4 border-b lg:border-b-0 lg:border-l border-white/[0.07] flex flex-col justify-between gap-1.5 bg-zinc-900/20">
              {pillars.map((item, idx) => {
                const Icon = item.icon;
                const isActive = activeTab === idx;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    aria-pressed={isActive}
                    style={{ "--item-accent": item.accent } as React.CSSProperties}
                    className="relative w-full p-4 rounded-2xl text-right transition-colors cursor-pointer group flex items-center gap-3.5"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeWhyUsTab"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                        className="absolute inset-0 rounded-2xl bg-(--item-accent)/[0.08] border border-(--item-accent)/25 shadow-[0_10px_40px_-16px_var(--item-accent)]"
                      />
                    )}

                    {isActive && (
                      <motion.div
                        layoutId="activeWhyUsLine"
                        className="absolute right-0 top-3.5 bottom-3.5 w-1 rounded-l-full bg-(--item-accent)"
                      />
                    )}

                    <div
                      className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                        isActive
                          ? "bg-(--item-accent) text-zinc-950 shadow-[0_0_24px_-4px_var(--item-accent)]"
                          : "bg-zinc-900/80 text-zinc-400 group-hover:text-(--item-accent) border border-white/[0.05] group-hover:border-(--item-accent)/30"
                      }`}
                    >
                      <Icon className="w-4 h-4" strokeWidth={2} />
                    </div>

                    <div className="relative z-10 flex-1 min-w-0">
                      <h3
                        className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                          isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Spotlight panel */}
            <div className="lg:col-span-8 p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative min-h-[340px] overflow-hidden">
              <div aria-hidden className="pointer-events-none absolute inset-0">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={current.id}
                    className="absolute -left-28 top-1/2 -translate-y-1/2 w-[30rem] h-[30rem] sm:w-[34rem] sm:h-[34rem]"
                    style={{ color: current.accent }}
                    initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
                    animate={{ opacity: 0.16, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 1.08, rotate: 6 }}
                    transition={{ duration: 0.9, ease: EASE_OUT }}
                  >
                    <Motif />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-linear-to-l from-zinc-950/60 via-zinc-950/20 to-transparent" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="relative flex flex-col justify-between h-full gap-8"
                >
                  {/* Info & KPI */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                    <div className="space-y-3 max-w-lg">
                      <div className="inline-flex items-center gap-2 text-[11px] font-medium text-(--accent)">
                        <span>مزیت رقابتی</span>
                        <span className="text-zinc-700">•</span>
                        <span className="text-zinc-400">{current.subtitle}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white">{current.title}</h3>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{current.description}</p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                      className="sm:text-left shrink-0 px-5 py-3.5 rounded-2xl bg-(--accent)/[0.06] border border-(--accent)/25 shadow-[0_12px_40px_-18px_var(--accent)] backdrop-blur-sm"
                    >
                      <div className="text-2xl sm:text-3xl font-black text-(--accent) tracking-tight">
                        {current.metricValue}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{current.metricLabel}</div>
                    </motion.div>
                  </div>

                  {/* Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-6 border-t border-white/[0.06]">
                    <div className="p-4 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 space-y-2.5 backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" strokeWidth={3} />
                        </span>
                        <span>استاندارد جهان‌گستر</span>
                      </div>
                      <ul className="space-y-2">
                        {current.comparison.map((row, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.15 + i * 0.1, ease: EASE_OUT }}
                            className="text-xs text-zinc-200 leading-relaxed flex items-start gap-2"
                          >
                            <span className="w-1 h-1 rounded-full bg-emerald-400 mt-2 shrink-0" />
                            <span>{row.arian}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/[0.05] space-y-2.5 backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                        <span className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center">
                          <X className="w-2.5 h-2.5 text-zinc-400" strokeWidth={2.5} />
                        </span>
                        <span>روش‌های سنتی و واسطه‌ای</span>
                      </div>
                      <ul className="space-y-2">
                        {current.comparison.map((row, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.25 + i * 0.1, ease: EASE_OUT }}
                            className="text-xs text-zinc-500 leading-relaxed flex items-start gap-2"
                          >
                            <span className="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0" />
                            <span>{row.traditional}</span>
                          </motion.li>
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
    </MotionConfig>
  );
}

export default WhyUsSection;
