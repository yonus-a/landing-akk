"use client";

import React, { useState } from "react";
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

  return (
    <section id="workflow" className="relative w-full py-24 sm:py-32 bg-zinc-50/50" dir="rtl">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pb-12 sm:pb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs font-mono text-zinc-600 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
            <span>{"// 02 — WORKFLOW & LOGISTICS BLUEPRINT"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 tracking-tight">
            فرآیند ۶ مرحله‌ای واردات و ترخیص کالا
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
            نقشه راه شفاف، گام‌به‌گام و استاندارد تجارت بین‌الملل آریان خودرو؛ تضمین سرعت، امنیت سرمایه و به حداقل رساندن هزینه‌های انبارداری و دموراژ.
          </p>
        </div>

        {/* Step Navigation Pill Bar (NO borders) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-10">
          {steps.map((s, idx) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`p-3.5 rounded-2xl text-right transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                activeStep === idx
                  ? "bg-zinc-950 text-white shadow-md scale-[1.02]"
                  : "bg-white hover:bg-zinc-100/80 text-zinc-700 shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-mono text-xs font-bold ${
                    activeStep === idx ? "text-amber-400" : "text-zinc-400"
                  }`}
                >
                  STEP {s.step}
                </span>
                <Clock className="w-3.5 h-3.5 opacity-60" />
              </div>
              <div
                className={`text-xs font-bold mt-2 truncate ${
                  activeStep === idx ? "text-white" : "text-zinc-900"
                }`}
              >
                {s.title.split(" (")[0]}
              </div>
            </button>
          ))}
        </div>

        {/* Detailed Active Step Card (NO borders) */}
        <div className="bg-white rounded-3xl p-7 sm:p-10 shadow-[0_10px_35px_rgba(0,0,0,0.03)] relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Cols: Detailed Overview */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold">
                    گام {steps[activeStep].step}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">
                    {steps[activeStep].subtitle}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950">
                  {steps[activeStep].title}
                </h3>
              </div>

              <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                {steps[activeStep].description}
              </p>

              {/* Tasks List (NO borders) */}
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-zinc-600" />
                  اقدامات کلیدی این گام:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-700">
                  {steps[activeStep].tasks.map((task, tidx) => (
                    <div
                      key={tidx}
                      className="p-3 rounded-xl bg-zinc-50 flex items-start gap-2 shadow-2xs"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 mt-1.5 shrink-0" />
                      <span className="leading-snug">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Navigation Controls (NO borders) */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                  disabled={activeStep === 0}
                  className="px-4 py-2 rounded-full bg-zinc-100 text-xs font-bold text-zinc-700 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  ← گام قبلی
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
                  }
                  disabled={activeStep === steps.length - 1}
                  className="px-5 py-2 rounded-full bg-zinc-950 hover:bg-zinc-800 text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                >
                  گام بعدی →
                </button>
                <span className="text-xs text-zinc-400 font-mono mr-auto">
                  پیشرفت چرخه: {Math.round(((activeStep + 1) / steps.length) * 100)}٪
                </span>
              </div>
            </div>

            {/* Right 5 Cols: Technical Meta & Deliverables Sheet (NO borders) */}
            <div className="lg:col-span-5 bg-zinc-50 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xs">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-mono font-bold text-zinc-500">
                  مشخصات اجرایی گام {steps[activeStep].step}
                </span>
                <FileSpreadsheet className="w-4 h-4 text-zinc-600" />
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="text-zinc-500 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-600" />
                    <span>مدت زمان تقریبی اجرا:</span>
                  </div>
                  <div className="font-bold text-zinc-900 bg-white p-3 rounded-xl shadow-2xs">
                    {steps[activeStep].duration}
                  </div>
                </div>

                <div>
                  <div className="text-zinc-500 mb-1">واحد مسئول و پاسخگو:</div>
                  <div className="font-bold text-zinc-900 bg-white p-3 rounded-xl shadow-2xs">
                    {steps[activeStep].responsible}
                  </div>
                </div>

                <div>
                  <div className="text-zinc-500 mb-1">سند نهایی تولیدشده در این گام:</div>
                  <div className="font-bold text-emerald-900 bg-emerald-50 p-3 rounded-xl shadow-2xs">
                    {steps[activeStep].document}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#estimator"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <span>استعلام هزینه اختصاصی برای بار شما</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default WorkflowSection;
