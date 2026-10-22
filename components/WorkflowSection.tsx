"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  FileText,
  BadgeCheck,
  SearchCheck,
  FileCheck2,
  Truck,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Layers,
  FileSpreadsheet,
  Building2,
} from "lucide-react";
import { RoutePattern } from "@/components/RoutePattern";

type Point = readonly [left: string, top: string];

const steps = [
  {
    ordinal: "اول",
    title: "مشاوره و برآورد بهای تمام‌شده کالا (Cost Sheet)",
    subtitle: "محاسبه دقیق کلیه هزینه‌ها قبل از خرید",
    duration: "۲۴ الی ۴۸ ساعت",
    responsible: "دپارتمان تحلیل هزینه و تعرفه گمرکی",
    document: "برگه رسمی آنالیز بهای تمام‌شده (Cost Sheet)",
    icon: Calculator,
    accent: "#f5a524",
    glows: [["18%", "22%"], ["82%", "78%"]] as Point[],
    description:
      "در گام نخست، کارشناسان جهان‌گستر مشخصات کالا، کد تعرفه گمرکی (HS Code)، حقوق ورودی، ارزش گمرکی (TSC) و هزینه‌های حمل را بررسی کرده و پیش‌بینی ۱۰۰٪ دقیقی از بهای تمام‌شده ریالی تا تحویل نهایی به خریدار ارائه می‌دهند.",
    tasks: [
      "بررسی ردیف تعرفه و بخشنامه‌های جاری گمرکی",
      "محاسبه حقوق و عوارض گمرکی، مالیات ارزش افزوده و پسماند",
      "استعلام به‌روز نرخ حمل کانتینری و کارگو هوایی",
      "تخمین کارمزد بانکی و هزینه‌های ترخیص بنادر",
    ],
  },
  {
    ordinal: "دوم",
    title: "منبع‌یابی و اخذ پیش‌فاکتور رسمی (Proforma)",
    subtitle: "اعتبارسنجی کارخانه و مذاکره تجاری",
    duration: "۳ الی ۷ روز کاری",
    responsible: "دفاتر نمایندگی گوانجو، دبی و استانبول",
    document: "پیش‌فاکتور بین‌المللی معتبر (Proforma Invoice)",
    icon: FileText,
    accent: "#38bdf8",
    glows: [["70%", "18%"], ["20%", "72%"]] as Point[],
    description:
      "تیم مقیم دفاتر خارجی جهان‌گستر به طور مستقیم با تأمین‌کننده یا کارخانه وارد مذاکره شده، کیفیت و اصالت کالا را ارزیابی نموده و پروفرمای رسمی با شرایط ترم‌های تجاری اینکوترمز (FOB, CFR, CIF یا EXW) را دریافت می‌کند.",
    tasks: [
      "تایید هویت حقوقی و سابقه کمپانی صادرکننده",
      "چانه‌زنی تخصصی در خصوص تخفیفات تیراژ و زمان تحویل",
      "بررسی بسته‌بندی، وزن و حجم پالت‌ها جهت بهینه‌سازی حمل",
      "تدوین بندهای تعهدات کیفی و بازرسی در قرارداد",
    ],
  },
  {
    ordinal: "سوم",
    title: "ثبت سفارش سامانه تجارت و حواله ارزی",
    subtitle: "تخصیص ارز قانونی و اخذ مجوزهای ورود",
    duration: "۵ الی ۱۴ روز کاری",
    responsible: "واحد امور بازرگانی و صرافی مجاز",
    document: "کد ۸ رقمی ثبت سفارش (NTSW) و تاییدیه سوئیفت",
    icon: BadgeCheck,
    accent: "#a78bfa",
    glows: [["50%", "12%"], ["85%", "60%"]] as Point[],
    description:
      "ثبت پرونده در سامانه جامع تجارت (NTSW)، ارجاع به سازمان‌های مربوطه (صمت، استاندارد، راهداری، محیط‌زیست) جهت اخذ مجوزهای پیش از ورود و پیگیری صف تخصیص ارز نیما یا حواله آزاد از طریق شبکه صرافی مطمئن به حساب فروشنده.",
    tasks: [
      "بارگذاری کامل اسناد در سامانه جامع تجارت ایران",
      "پیگیری اخذ مجوزهای فنی وزارتخانه‌ها و استانداردهای اجباری",
      "واریز ریالی و انتقال ارزی (یوان، درهم، یورو) بدون واسطه",
      "دریافت تاییدیه رسمی سوئیفت بانکی از کمپانی سازنده",
    ],
  },
  {
    ordinal: "چهارم",
    title: "بازرسی کیفی در مبدأ و حمل بین‌المللی",
    subtitle: "پوشش کامل بیمه و انتقال ایمن کالا",
    duration: "۱۰ الی ۲۵ روز (دریایی) / ۳ الی ۵ روز (هوایی)",
    responsible: "شرکت‌های بازرسی همکار و خطوط کشتیرانی",
    document: "گواهی بازرسی (COI/PSI) و بارنامه اصلی کشتیرانی (B/L)",
    icon: SearchCheck,
    accent: "#34d399",
    glows: [["15%", "65%"], ["75%", "25%"]] as Point[],
    description:
      "بازرسان فنی مستقل، کالا را در کارخانه مبدأ بازرسی فیزیکی، شمارشی و کیفی نموده و گواهی COI صادر می‌کنند. پس از بسته‌بندی پالت‌ها، کانتینرها بارگیری شده و با بارنامه رسمی خط کشتیرانی بین‌المللی به سوی بنادر ایران روانه می‌گردند.",
    tasks: [
      "بررسی سلامت فیزیکی، کارکرد و بسته‌بندی کالا در مبدأ",
      "استریپ و استافینگ استاندارد کانتینر در محوطه بنادر",
      "صدور بیمه‌نامه تمام‌خطر حمل دریایی و هوایی (کلوز A)",
      "رهگیری مستمر و ارسال گزارش روزانه موقعیت شناور/هواپیما",
    ],
  },
  {
    ordinal: "پنجم",
    title: "تنظیم اظهارنامه و ترخیص تخصصی از گمرک",
    subtitle: "تشریفات سریع گمرکی بدون رسوب و دموراژ",
    duration: "۵ الی ۱۰ روز کاری",
    responsible: "حق‌العمل‌کاران رسمی مقیم گمرکات کشور",
    document: "اظهارنامه، کوتاژ گمرکی و پروانه الکترونیکی (برگ سبز)",
    icon: FileCheck2,
    accent: "#fb7185",
    glows: [["85%", "30%"], ["30%", "85%"]] as Point[],
    description:
      "به محض ورود کشتی به بندر و اعلامیه ورود ترخیصیه، اسناد اظهارنامه در سامانه گمرکی EPL بارگذاری شده، کارشناسان مقیم اقدام به هدایت کالا در مسیرهای گمرکی، اخذ آزمون استاندارد و پرداخت حقوق گمرکی نموده و پروانه ترخیص صادر می‌گردد.",
    tasks: [
      "دریافت ترخیصیه الکترونیکی و تسویه با خطوط کشتیرانی",
      "ثبت اظهارنامه EPL و تخصیص ارزیاب و کارشناس مجازی",
      "اخذ تاییدیه آزمایشگاه استاندارد، قرنطینه یا راهداری",
      "صدور پروانه ترخیص، کد شناسه رهگیری و مجوز بارگیری",
    ],
  },
  {
    ordinal: "ششم",
    title: "بارگیری، ترانزیت داخلی و تحویل در مقصد",
    subtitle: "حمل زمینی ایمن با ناوگان سنگین تا انبار مشتری",
    duration: "۲ الی ۴ روز کاری",
    responsible: "دپارتمان حمل جاده‌ای و ناوگان کشنده‌های کفی",
    document: "بارنامه سراسری تمبردار جاده‌ای و رسید تحویل نهایی",
    icon: Truck,
    accent: "#6b93ff",
    glows: [["40%", "75%"], ["60%", "15%"]] as Point[],
    description:
      "پس از صدور درب خروج گمرک، کانتینر یا محموله روی کشنده‌های سنگین و مجهز بارگیری شده و با بیمه‌نامه داخلی و بارنامه رسمی جاده‌ای، به مقصد انبار، کارخانه یا شوروم کارفرما در هر نقطه از ایران اعزام و تخلیه می‌گردد.",
    tasks: [
      "بارگیری ایمن با جرثقیل و نظارت ناظر بار در بندر",
      "صدور بارنامه سراسری تمبردار دولتی و بیمه‌نامه زمینی",
      "ارسال پته الکترونیکی و ثبت در سامانه جامع انبارها",
      "تحویل پلمب، تحویل فیزیکی کالا و امضای صورتجلسه نهایی",
    ],
  },
];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function WorkflowSection() {
  const [activeStep, setActiveStep] = useState(0);

  const goTo = (idx: number) => {
    setActiveStep(Math.min(Math.max(idx, 0), steps.length - 1));
  };

  const currentStep = steps[activeStep];
  const StepIcon = currentStep.icon;
  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <section
      id="workflow"
      className="relative w-full py-24 sm:py-32 bg-zinc-950 text-white overflow-hidden"
      dir="rtl"
      style={{ "--accent": currentStep.accent } as React.CSSProperties}
    >
      <RoutePattern
        className="opacity-60"
        hub={{ x: 760, y: 470 }}
        origins={[
          { x: 60, y: 120 },
          { x: 1400, y: 110 },
          { x: 1380, y: 760 },
          { x: 180, y: 820 },
        ]}
      />

      {/* Step-synced backdrop */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        {currentStep.glows.map(([left, top], gidx) => (
          <motion.div
            key={gidx}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ width: gidx === 0 ? "38rem" : "28rem", height: gidx === 0 ? "38rem" : "28rem" }}
            initial={false}
            animate={{ left, top, backgroundColor: currentStep.accent, opacity: gidx === 0 ? 0.16 : 0.1 }}
            transition={{ duration: 1.6, ease: EASE_OUT }}
          />
        ))}

        <AnimatePresence initial={false}>
          <motion.div
            key={`icon-${activeStep}`}
            className="absolute -left-24 top-1/2 -translate-y-1/2 hidden md:block"
            initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
            animate={{ opacity: 0.07, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.15, rotate: 10 }}
            transition={{ duration: 1, ease: EASE_OUT }}
          >
            <StepIcon className="w-[34rem] h-[34rem]" strokeWidth={0.5} style={{ color: currentStep.accent }} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-3 pb-12 sm:pb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            فرآیند ۶ مرحله‌ای واردات و ترخیص کالا
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
            نقشه راه شفاف، گام‌به‌گام و استاندارد تجارت بین‌الملل جهان‌گستر؛ تضمین سرعت و امنیت سرمایه.
          </p>
        </motion.div>

        {/* Step navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {steps.map((s, idx) => {
            const isActive = activeStep === idx;
            const isDone = idx < activeStep;
            const Icon = s.icon;
            return (
              <motion.button
                key={s.ordinal}
                type="button"
                onClick={() => goTo(idx)}
                aria-pressed={isActive}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", stiffness: 220, damping: 25, delay: 0.2 + idx * 0.1 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                style={{ "--step-accent": s.accent } as React.CSSProperties}
                className="group relative p-4 rounded-2xl text-right cursor-pointer flex flex-col gap-3 border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-zinc-700 transition-colors duration-300 overflow-hidden"
              >
                {isActive && (
                  <motion.span
                    layoutId="workflow-active-step"
                    className="absolute inset-0 rounded-2xl border border-(--step-accent)/60 bg-(--step-accent)/10 shadow-[0_10px_40px_-12px_var(--step-accent)]"
                    transition={{ type: "spring", stiffness: 320, damping: 32 }}
                  />
                )}

                <div className="relative z-10 flex items-center justify-between">
                  <span
                    className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-500 ${
                      isActive
                        ? "bg-(--step-accent) border-transparent text-zinc-950 shadow-[0_0_24px_-4px_var(--step-accent)]"
                        : "bg-zinc-800/60 border-zinc-700/60 text-zinc-400 group-hover:text-(--step-accent) group-hover:border-(--step-accent)/40"
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.8} />
                  </span>
                  <span
                    className={`flex items-center gap-1 tabular-nums text-[11px] font-bold ${
                      isActive || isDone ? "text-(--step-accent)" : "text-zinc-500"
                    }`}
                  >
                    {isDone && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                    گام {s.ordinal}
                  </span>
                </div>

                <div
                  className={`relative z-10 text-xs font-bold truncate ${isActive ? "text-white" : "text-zinc-300"}`}
                >
                  {s.title.split(" (")[0]}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Detailed active step card */}
        <div className="relative bg-zinc-900/70 backdrop-blur-sm border border-(--accent)/20 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden transition-colors duration-700">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-linear-to-l from-transparent via-(--accent) to-transparent opacity-70 transition-colors duration-700"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Overview */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="tabular-nums text-xs px-3 py-1 rounded-full bg-(--accent)/10 border border-(--accent)/25 text-(--accent) font-bold">
                      گام {currentStep.ordinal}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">{currentStep.subtitle}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
                    <motion.span
                      initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                      className="p-2.5 rounded-xl bg-(--accent)/15 border border-(--accent)/30 text-(--accent) shadow-[0_0_30px_-8px_var(--accent)]"
                    >
                      <StepIcon className="w-5 h-5" />
                    </motion.span>
                    {currentStep.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                  {currentStep.description}
                </p>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-(--accent)" />
                    اقدامات کلیدی این گام:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-zinc-300">
                    {currentStep.tasks.map((task, tidx) => (
                      <motion.div
                        key={tidx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.15 + tidx * 0.07 }}
                        className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/60 hover:border-(--accent)/30 flex items-start gap-2.5 shadow-sm transition-colors"
                      >
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-(--accent)/15 text-(--accent) shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" strokeWidth={3} />
                        </span>
                        <span className="leading-snug">{task}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Step navigation controls */}
                <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => goTo(activeStep - 1)}
                    disabled={activeStep === 0}
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 text-xs font-bold text-zinc-200 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-disabled:translate-x-0" />
                    گام قبلی
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(activeStep + 1)}
                    disabled={activeStep === steps.length - 1}
                    className="group inline-flex items-center gap-2 px-5 py-2 rounded-full bg-(--accent) hover:brightness-110 text-xs font-bold text-zinc-950 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-[background-color,filter] duration-500 shadow-[0_8px_24px_-10px_var(--accent)]"
                  >
                    گام بعدی
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 group-disabled:translate-x-0" />
                  </button>
                  <span className="text-xs text-zinc-400 tabular-nums mr-auto">
                    پیشرفت چرخه: {Math.round(progress)}٪
                  </span>
                </div>
              </div>

              {/* Technical meta & deliverables */}
              <div className="lg:col-span-5 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-6 sm:p-7 space-y-5 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                  <span className="text-xs tabular-nums font-bold text-(--accent)">
                    مشخصات اجرایی گام {currentStep.ordinal}
                  </span>
                  <FileSpreadsheet className="w-4 h-4 text-zinc-400" />
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="text-zinc-400 mb-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-(--accent)" />
                      <span>مدت زمان تقریبی اجرا:</span>
                    </div>
                    <div className="font-bold text-white bg-zinc-900 border border-zinc-800 p-3 rounded-xl shadow-sm">
                      {currentStep.duration}
                    </div>
                  </div>

                  <div>
                    <div className="text-zinc-400 mb-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-(--accent)" />
                      <span>واحد مسئول و پاسخگو:</span>
                    </div>
                    <div className="font-bold text-white bg-zinc-900 border border-zinc-800 p-3 rounded-xl shadow-sm">
                      {currentStep.responsible}
                    </div>
                  </div>

                  <div>
                    <div className="text-zinc-400 mb-1 flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>سند نهایی تولیدشده در این گام:</span>
                    </div>
                    <div className="font-bold text-emerald-300 bg-emerald-950/30 border border-emerald-500/20 p-3 rounded-xl shadow-sm">
                      {currentStep.document}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="#estimator"
                    className="group w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors border border-zinc-700/50 shadow-sm"
                  >
                    <span>استعلام هزینه اختصاصی برای بار شما</span>
                    <ArrowLeft className="w-3.5 h-3.5 text-(--accent) transition-transform group-hover:-translate-x-1" />
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default WorkflowSection;
