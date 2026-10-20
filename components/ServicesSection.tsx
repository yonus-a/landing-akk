"use client";

import React from "react";
import {
  Globe2,
  Car,
  Ship,
  FileCheck2,
  ShieldCheck,
  CreditCard,
  ArrowUpLeft,
  CheckCircle2,
} from "lucide-react";

export function ServicesSection() {
  const services = [
    {
      code: "01",
      tag: "SOURCING & PROCUREMENT",
      title: "منبع‌یابی و خرید خارجی (Sourcing)",
      description:
        "شناسایی، استعلام و اعتبارسنجی کارخانجات و تولیدکنندگان معتبر در چین، امارات، ترکیه و اروپا. مذاکره تخصصی تجاری، چانه‌زنی حرفه‌ای، نظارت بر انطباق قراردادهای بین‌المللی Incoterms 2020 و تحویل ایمن اسناد.",
      icon: Globe2,
      highlights: [
        "اعتبارسنجی کارخانجات در گوانجو، شنژن و ایوو",
        "مذاکره و اخذ کمترین قیمت رقابتی کارخانه",
        "عقد قراردادهای تجاری رسمی دو زبانه",
        "تطبیق کامل با استانداردهای وارداتی ایران",
      ],
    },
    {
      code: "02",
      tag: "AUTOMOTIVE & HEAVY FLEET",
      title: "واردات تخصصی خودرو، کشنده و قطعات یدکی",
      description:
        "تأمین و واردات قانونی انواع خودروهای سواری لوکس و اقتصادی، کامیون و کشنده‌های اروپایی و چینی، قطعات اصلی (OEM/OES) بدنه و موتوری، و ماشین‌آلات راه‌سازی و معدنی طبق آخرین آیین‌نامه‌ها و مصوبات کشوری.",
      icon: Car,
      highlights: [
        "واردات کشنده‌های رنو، داف، ولوو و فوتون",
        "تأمین قطعات اورجینال OEM با تضمین اصالت",
        "اخذ تاییدیه خدمات پس از فروش و گارانتی",
        "تحویل پلاک ملی و تسویه اسقاط",
      ],
    },
    {
      code: "03",
      tag: "MULTIMODAL FREIGHT",
      title: "حمل‌ونقل بین‌المللی (هوایی، دریایی، زمینی)",
      description:
        "قرارداد مستقیم و بدون واسطه با خطوط کشتیرانی کانتینری (FCL/LCL)، چارتر هوایی و کارگو اکسپرس، و ترانزیت جاده‌ای بین‌المللی از اروپا و ترکیه. رزرو سریع کانتینر با نرخ‌های رقابتی و صدور بارنامه اصلی فیاتا (FIATA).",
      icon: Ship,
      highlights: [
        "سرویس منظم دریایی از شانگهای و نینگبو به بندرعباس",
        "کارگو اکسپرس ۳ تا ۵ روزه از دبی و چین به فرودگاه امام",
        "ترانزیت زمینی تیرپارک (TIR) از استانبول و آلمان",
        "بیمه تمام‌خطر محموله و رصد لحظه‌ای آنلاین",
      ],
    },
    {
      code: "04",
      tag: "CUSTOMS CLEARANCE",
      title: "ترخیص تخصصی از کلیه گمرکات کشور",
      description:
        "ترخیص سریع و بدون رسوب کالا توسط کارگزاران رسمی مقیم گمرک. تسلط کامل بر ردیف تعرفه‌ها (HS Code)، حل و فصل اختلافات گمرکی در کمیسیون‌های بدوی و تجدیدنظر، و جلوگیری از تحمیل هزینه‌های دموراژ و انبارداری.",
      icon: FileCheck2,
      highlights: [
        "گمرک شهید رجایی بندرعباس و بوشهر (تخصصی کانتینری)",
        "گمرک فرودگاه امام خمینی (تخصصی هوایی و قطعات حساس)",
        "گمرک بازرگان و رازی (ترانزیت زمینی اروپا و ترکیه)",
        "گمرک غرب تهران و شهریار (ترانزیت داخلی و قطعات خودرو)",
      ],
    },
    {
      code: "05",
      tag: "REGULATORY & NTSW",
      title: "ثبت سفارش و اخذ مجوزهای قانونی",
      description:
        "انجام کلیه مراحل اداری و الکترونیکی سامانه جامع تجارت (NTSW)، اخذ مجوزهای استاندارد اجباری، وزارت صمت، سازمان راهداری، محیط زیست، وزارت بهداشت و جهاد کشاورزی تا مرحله تایید نهایی تخصیص ارز بانکی.",
      icon: ShieldCheck,
      highlights: [
        "ثبت سفارش سریع کالا بدون نقص مدارک",
        "اخذ استاندارد COI و بازرسی مبدأ و مقصد",
        "پیگیری تخصیص ارز تالار اول و دوم نیما",
        "تمدید، ویرایش و انتقال کوتاژ بدون تاخیر",
      ],
    },
    {
      code: "06",
      tag: "FX & LETTER OF CREDIT",
      title: "خدمات ارزی و گشایش اعتبار (LC)",
      description:
        "انجام حوالجات رسمی و مطمئن ارزی با کارمزد منصفانه و کمترین ریسک ممکن. پرداخت حواله یوان چین (RMB/CNY)، درهم امارات (AED)، دلار و یورو از طریق صرافی‌های دارای مجوز بانک مرکزی به حساب فروشنده یا کارخانه.",
      icon: CreditCard,
      highlights: [
        "انتقال مستقیم حواله بانکی به حساب کارخانه در چین",
        "صدور سوئیفت (Swift Copy) معتبر و رسمی",
        "مشاوره گشایش اعتبارات اسنادی (LC) بانکی",
        "حفظ امنیت ارزی و تسویه‌حساب شفاف ریالی",
      ],
    },
  ];

  return (
    <section id="services" className="relative w-full py-24 sm:py-32 bg-white" dir="rtl">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 sm:pb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-900" />
              <span className="font-mono text-xs text-zinc-500 tracking-wider">
                {"// 01 — COMMERCIAL & LOGISTICS SPECS"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 tracking-tight">
              خدمات جامع بازرگانی و ترخیص آریان خودرو
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 max-w-2xl leading-relaxed">
              ارائه زنجیره کامل و یکپارچه خدمات بازرگانی خارجی؛ از ارزیابی تأمین‌کننده در مبدأ تا ترخیص و تحویل کالا درب انبار مشتری.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            <a
              href="#estimator"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs sm:text-sm font-bold transition-all duration-200 shadow-sm"
            >
              <span>درخواست استعلام قیمت خدمات</span>
              <ArrowUpLeft className="w-4 h-4" strokeWidth={1.75} />
            </a>
          </div>
        </div>

        {/* 6-Card Soft Architectural Bento Grid (NO borders) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.code}
                className="group relative bg-zinc-50/80 hover:bg-zinc-100/90 p-7 sm:p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:-translate-y-1"
              >
                <div>
                  {/* Top Header of Card */}
                  <div className="flex items-center justify-between pb-4">
                    <span className="font-mono text-2xl font-black text-zinc-300 group-hover:text-zinc-900 transition-colors">
                      {service.code}
                    </span>
                    <div className="p-3 rounded-xl bg-white text-zinc-900 shadow-2xs group-hover:bg-zinc-950 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Technical Sub-Tag */}
                  <div className="font-mono text-[10px] text-zinc-400 mt-2 tracking-wider">
                    {service.tag}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-zinc-950 mt-1 mb-2.5">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                    {service.description}
                  </p>

                  {/* Key Highlights Bullet List */}
                  <ul className="mt-5 space-y-2 pt-3 text-xs text-zinc-700">
                    {service.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2
                          className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                          strokeWidth={1.75}
                        />
                        <span className="line-clamp-1">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action Link */}
                <div className="mt-6 pt-4 flex items-center justify-between">
                  <a
                    href="#estimator"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 group-hover:text-amber-700 transition-colors"
                  >
                    <span>استعلام و مشاوره تخصصی</span>
                    <ArrowUpLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <span className="font-mono text-[10px] text-zinc-400">
                    ARCH-SERIES
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Assurance Strip (NO borders) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <p className="text-xs sm:text-sm text-zinc-700 leading-normal">
              <strong>تضمین حقوقی و مالی:</strong> تمامی عملیات منبع‌یابی، خرید ارزی، حمل و ترخیص آریان خودرو تحت قرارداد رسمی، تضمین مکتوب هزینه‌ها و بیمه‌نامه معتبر اجرا می‌شود.
            </p>
          </div>
          <a
            href="tel:02188000000"
            className="shrink-0 text-xs font-bold font-mono px-4 py-2 rounded-full bg-white text-zinc-800 hover:bg-zinc-100 transition-colors shadow-2xs"
            dir="ltr"
          >
            021-88000000 EXT: 104
          </a>
        </div>

      </div>
    </section>
  );
}

export default ServicesSection;
