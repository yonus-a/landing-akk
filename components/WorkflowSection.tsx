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
  Clock,
  Layers,
  FileSpreadsheet,
} from "lucide-react";

export function WorkflowSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: "۰۱",
      title: "مشاوره و برآورد بهای تمام‌شده کالا (Cost Sheet)",
      subtitle: "محاسبه دقیق کلیه هزینه‌ها قبل از خرید",
      duration: "۲۴ الی ۴۸ ساعت",
      responsible: "دپارتمان تحلیل هزینه و تعرفه گمرکی",
      document: "برگه رسمی آنالیز بهای تمام‌شده (Cost Sheet)",
      icon: Calculator,
      description:
        "در گام نخست، کارشناسان بازرگانی آریان خودرو مشخصات کالا، کد تعرفه گمرکی (HS Code)، حقوق ورودی، ارزش گمرکی (TSC) و هزینه‌های حمل را بررسی کرده و پیش‌بینی ۱۰۰٪ دقیقی از بهای تمام‌شده ریالی تا تحویل نهایی به خریدار ارائه می‌دهند.",
      tasks: [
        "بررسی ردیف تعرفه و بخشنامه‌های جاری گمرکی",
        "محاسبه حقوق و عوارض گمرکی، مالیات ارزش افزوده و پسماند",
        "استعلام به‌روز نرخ حمل کانتینری و کارگو هوایی",
        "تخمین کارمزد بانکی و هزینه‌های ترخیص بنادر",
      ],
    },
    {
      step: "۰۲",
      title: "منبع‌یابی و اخذ پیش‌فاکتور رسمی (Proforma)",
      subtitle: "اعتبارسنجی کارخانه و مذاکره تجاری",
      duration: "۳ الی ۷ روز کاری",
      responsible: "دفاتر نمایندگی گوانجو، دبی و استانبول",
      document: "پیش‌فاکتور بین‌المللی معتبر (Proforma Invoice)",
      icon: FileText,
      description:
        "تیم مقیم دفاتر خارجی آریان خودرو به طور مستقیم با تأمین‌کننده یا کارخانه وارد مذاکره شده، کیفیت و اصالت کالا را ارزیابی نموده و پروفرمای رسمی با شرایط ترم‌های تجاری اینکوترمز (FOB, CFR, CIF یا EXW) را دریافت می‌کند.",
      tasks: [
        "تایید هویت حقوقی و سابقه کمپانی صادرکننده",
        "چانه‌زنی تخصصی در خصوص تخفیفات تیراژ و زمان تحویل",
        "بررسی بسته‌بندی، وزن و حجم پالت‌ها جهت بهینه‌سازی حمل",
        "تدوین بندهای تعهدات کیفی و بازرسی در قرارداد",
      ],
    },
    {
      step: "۰۳",
      title: "ثبت سفارش سامانه تجارت و حواله ارزی",
      subtitle: "تخصیص ارز قانونی و اخذ مجوزهای ورود",
      duration: "۵ الی ۱۴ روز کاری",
      responsible: "واحد امور بازرگانی و صرافی مجاز",
      document: "کد ۸ رقمی ثبت سفارش (NTSW) و تاییدیه سوئیفت",
      icon: BadgeCheck,
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
      step: "۰۴",
      title: "بازرسی کیفی در مبدأ و حمل بین‌المللی",
      subtitle: "پوشش کامل بیمه و انتقال ایمن کالا",
      duration: "۱۰ الی ۲۵ روز (دریایی) / ۳ الی ۵ روز (هوایی)",
      responsible: "شرکت‌های بازرسی همکار و خطوط کشتیرانی",
      document: "گواهی بازرسی (COI/PSI) و بارنامه اصلی کشتیرانی (B/L)",
      icon: SearchCheck,
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
      step: "۰۵",
      title: "تنظیم اظهارنامه و ترخیص تخصصی از گمرک",
      subtitle: "تشریفات سریع گمرکی بدون رسوب و دموراژ",
      duration: "۵ الی ۱۰ روز کاری",
      responsible: "حق‌العمل‌کاران رسمی مقیم گمرکات کشور",
      document: "اظهارنامه، کوتاژ گمرکی و پروانه الکترونیکی (برگ سبز)",
      icon: FileCheck2,
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
      step: "۰۶",
      title: "بارگیری، ترانزیت داخلی و تحویل در مقصد",
      subtitle: "حمل زمینی ایمن با ناوگان سنگین تا انبار مشتری",
      duration: "۲ الی ۴ روز کاری",
      responsible: "دپارتمان حمل جاده‌ای و ناوگان کشنده‌های کفی",
      document: "بارنامه سراسری تمبردار جاده‌ای و رسید تحویل نهایی",
      icon: Truck,
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

  const currentStep = steps[activeStep];
  const StepIcon = currentStep.icon;

  return (
    <section id="workflow" className="relative w-full py-24 sm:py-32 bg-zinc-950 text-white overflow-hidden" dir="rtl">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-3 pb-12 sm:pb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-amber-400 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>{"// 02 — WORKFLOW & LOGISTICS BLUEPRINT"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            فرآیند ۶ مرحله‌ای واردات و ترخیص کالا
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
            نقشه راه شفاف، گام‌به‌گام و استاندارد تجارت بین‌الملل آریان خودرو؛ تضمین سرعت و امنیت سرمایه.
          </p>
        </motion.div>

        {/* Step Navigation Pill Bar with Pulse Animation for Active Step */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {steps.map((s, idx) => {
            const isActive = activeStep === idx;
            return (
              <motion.button
                key={s.step}
                type="button"
                onClick={() => setActiveStep(idx)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-2xl text-right transition-all duration-300 cursor-pointer flex flex-col justify-between border relative overflow-hidden ${
                  isActive
                    ? "bg-zinc-900 border-amber-500/60 shadow-lg shadow-amber-500/10"
                    : "bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/70 hover:border-zinc-700 text-zinc-400"
                }`}
              >
                {/* Pulse Glow Effect on Active Step Button */}
                {isActive && (
                  <span className="absolute inset-0 rounded-2xl bg-amber-500/5 animate-pulse pointer-events-none" />
                )}

                <div className="flex items-center justify-between relative z-10">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isActive ? "text-amber-400" : "text-zinc-500"
                    }`}
                  >
                    STEP {s.step}
                  </span>
                  <Clock className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-zinc-600"}`} />
                </div>
                <div
                  className={`text-xs font-bold mt-3 truncate relative z-10 ${
                    isActive ? "text-white" : "text-zinc-300"
                  }`}
                >
                  {s.title.split(" (")[0]}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Detailed Active Step Card with Framer Motion Transition */}
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              
              {/* Left 7 Cols: Detailed Overview */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">
                      گام {currentStep.step}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">
                      {currentStep.subtitle}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <StepIcon className="w-5 h-5" />
                    </div>
                    {currentStep.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                  {currentStep.description}
                </p>

                {/* Tasks List */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    اقدامات کلیدی این گام:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-zinc-300">
                    {currentStep.tasks.map((task, tidx) => (
                      <div
                        key={tidx}
                        className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/60 flex items-start gap-2.5 shadow-sm"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span className="leading-snug">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Navigation Controls */}
                <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                    disabled={activeStep === 0}
                    className="px-4 py-2 rounded-full bg-zinc-800 text-xs font-bold text-zinc-200 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    ← گام قبلی
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
                    }
                    disabled={activeStep === steps.length - 1}
                    className="px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-xs font-bold text-zinc-950 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-sm"
                  >
                    گام بعدی →
                  </button>
                  <span className="text-xs text-zinc-400 font-mono mr-auto">
                    پیشرفت چرخه: {Math.round(((activeStep + 1) / steps.length) * 100)}٪
                  </span>
                </div>
              </div>

              {/* Right 5 Cols: Technical Meta & Deliverables Sheet */}
              <div className="lg:col-span-5 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-6 sm:p-7 space-y-5 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    مشخصات اجرایی گام {currentStep.step}
                  </span>
                  <FileSpreadsheet className="w-4 h-4 text-zinc-400" />
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="text-zinc-400 mb-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>مدت زمان تقریبی اجرا:</span>
                    </div>
                    <div className="font-bold text-white bg-zinc-900 border border-zinc-800 p-3 rounded-xl shadow-sm">
                      {currentStep.duration}
                    </div>
                  </div>

                  <div>
                    <div className="text-zinc-400 mb-1">واحد مسئول و پاسخگو:</div>
                    <div className="font-bold text-white bg-zinc-900 border border-zinc-800 p-3 rounded-xl shadow-sm">
                      {currentStep.responsible}
                    </div>
                  </div>

                  <div>
                    <div className="text-zinc-400 mb-1">سند نهایی تولیدشده در این گام:</div>
                    <div className="font-bold text-emerald-300 bg-emerald-950/30 border border-emerald-500/20 p-3 rounded-xl shadow-sm">
                      {currentStep.document}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="#estimator"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors border border-zinc-700/50 shadow-sm"
                  >
                    <span>استعلام هزینه اختصاصی برای بار شما</span>
                    <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
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