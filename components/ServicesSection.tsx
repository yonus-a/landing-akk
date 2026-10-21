"use client";

import React, { useRef } from "react";
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
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1CardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const row2CardsRef = useRef<(HTMLDivElement | null)[]>([]);

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

  const row1Services = services.slice(0, 3);
  const row2Services = services.slice(3, 6);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        // Desktop 3D peel flip animation with pin
        gsap.set(row2CardsRef.current, {
          yPercent: 120,
          rotationX: -40,
          z: 120,
          scale: 0.85,
          opacity: 0,
          transformOrigin: "bottom center",
          pointerEvents: "none",
        });

        gsap.set(row1CardsRef.current, {
          transformOrigin: "top center",
        });

        // Both rows are stacked; only the visible row may receive hover
        let row2Active = false;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=1800",
            scrub: 1.2,
            pin: true,
            onUpdate: (self) => {
              const next = self.progress > 0.5;
              if (next === row2Active) return;
              row2Active = next;
              gsap.set(row1CardsRef.current, { pointerEvents: next ? "none" : "auto" });
              gsap.set(row2CardsRef.current, { pointerEvents: next ? "auto" : "none" });
            },
          },
        });

        // ۱. عقب رفتن، تار شدن و محو کامل کارت‌های ردیف اول پس از اتمام جایگزینی
        tl.to(
          row1CardsRef.current,
          {
            yPercent: -20,
            rotationX: 25,
            z: -200,
            scale: 0.88,
            opacity: 0,
            filter: "blur(6px)",
            stagger: 0.04,
            ease: "power2.inOut",
            duration: 1,
          },
          0
        );

        // ۲. بالا آمدن و ورق خوردن کارت‌های ردیف دوم
        tl.to(
          row2CardsRef.current,
          {
            yPercent: 0,
            rotationX: 0,
            z: 0,
            scale: 1,
            opacity: 1,
            stagger: 0.06,
            ease: "power3.out",
            duration: 1,
          },
          0.1
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full h-auto min-h-screen py-16 sm:py-24 lg:py-0 lg:h-screen flex flex-col justify-center overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-300"
      dir="rtl"
    >
      <div className="max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
              خدمات جامع بازرگانی و ترخیص جهان‌گستر
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              ارائه زنجیره کامل و یکپارچه خدمات بازرگانی خارجی؛ از ارزیابی تأمین‌کننده در مبدأ تا ترخیص و تحویل کالا درب انبار مشتری.
            </p>
          </div>

          <div className="flex items-center gap-4 self-start md:self-end">
            <a
              href="#estimator"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs sm:text-sm font-bold transition-all duration-200 shadow-sm"
            >
              <span>درخواست استعلام قیمت خدمات</span>
              <ArrowUpLeft className="w-4 h-4" strokeWidth={1.75} />
            </a>
          </div>
        </div>

        {/* Mobile & Tablet Flow Grid (Displays all 6 cards seamlessly without clipping) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-5 sm:gap-6 my-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.code}
                className="bg-zinc-50/95 dark:bg-zinc-900/95 p-6 rounded-2xl flex flex-col justify-between shadow-sm border border-zinc-200/80 dark:border-zinc-800"
              >
                <div>
                  <div className="flex items-center justify-between pb-3">
                    <span className="font-mono text-2xl font-black text-zinc-300 dark:text-zinc-700">
                      {service.code}
                    </span>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs">
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="mt-4 space-y-1.5 pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300">
                    {service.highlights.slice(0, 3).map((highlight, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2
                          className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0"
                          strokeWidth={1.75}
                        />
                        <span className="line-clamp-1">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 pt-3 flex items-center justify-between border-t border-zinc-200/60 dark:border-zinc-800">
                  <a
                    href="#estimator"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-200 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                  >
                    <span>استعلام و مشاوره</span>
                    <ArrowUpLeft className="w-3.5 h-3.5" />
                  </a>
                  <span className="font-mono text-[10px] text-zinc-400">
                    ARCH-SERIES
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop 3D Perspective Stage */}
        <div className="hidden lg:block relative w-full min-h-[410px] my-4 [perspective:1400px] [transform-style:preserve-3d]">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 absolute inset-x-0 top-0 pointer-events-none [transform-style:preserve-3d]">
            {row1Services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.code}
                  ref={(el) => {
                    row1CardsRef.current[index] = el;
                  }}
                  className="group relative pointer-events-auto bg-zinc-50/95 dark:bg-zinc-900/95 p-6 rounded-2xl flex flex-col justify-between shadow-[0_8px_30px_rgba(15,21,48,0.04)] dark:shadow-[0_8px_30px_rgba(15,21,48,0.3)] border border-zinc-200/80 dark:border-zinc-800 will-change-transform"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3">
                      <span className="font-mono text-2xl font-black text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-amber-400 transition-colors">
                        {service.code}
                      </span>
                      <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs group-hover:bg-zinc-950 dark:group-hover:bg-amber-500 group-hover:text-white dark:group-hover:text-zinc-950 transition-colors">
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                    <ul className="mt-4 space-y-1.5 pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300">
                      {service.highlights.slice(0, 3).map((highlight, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2
                            className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0"
                            strokeWidth={1.75}
                          />
                          <span className="line-clamp-1">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 flex items-center justify-between border-t border-zinc-200/60 dark:border-zinc-800">
                    <a
                      href="#estimator"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-200 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                    >
                      <span>استعلام و مشاوره</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </a>
                    <span className="font-mono text-[10px] text-zinc-400">
                      ARCH-SERIES
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Row 2 (3D Peel-Y Reveal) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 absolute inset-x-0 top-0 pointer-events-none [transform-style:preserve-3d]">
            {row2Services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.code}
                  ref={(el) => {
                    row2CardsRef.current[index] = el;
                  }}
                  className="group relative pointer-events-auto bg-white dark:bg-zinc-900 p-6 rounded-2xl flex flex-col justify-between shadow-[0_-12px_40px_rgba(15,21,48,0.08),0_12px_30px_rgba(15,21,48,0.05)] dark:shadow-[0_12px_30px_rgba(15,21,48,0.4)] border border-zinc-200 dark:border-zinc-800 will-change-transform"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3">
                      <span className="font-mono text-2xl font-black text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-amber-400 transition-colors">
                        {service.code}
                      </span>
                      <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs group-hover:bg-zinc-950 dark:group-hover:bg-amber-500 group-hover:text-white dark:group-hover:text-zinc-950 transition-colors">
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                    <ul className="mt-4 space-y-1.5 pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300">
                      {service.highlights.slice(0, 3).map((highlight, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2
                            className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0"
                            strokeWidth={1.75}
                          />
                          <span className="line-clamp-1">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 flex items-center justify-between border-t border-zinc-200/60 dark:border-zinc-800">
                    <a
                      href="#estimator"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-200 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                    >
                      <span>استعلام و مشاوره</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </a>
                    <span className="font-mono text-[10px] text-zinc-400">
                      ARCH-SERIES
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Assurance Strip */}
        <div className="mt-8 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 border border-zinc-100 dark:border-zinc-800 relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-normal">
              <strong>تضمین حقوقی و مالی:</strong> تمامی عملیات منبع‌یابی، خرید ارزی، حمل و ترخیص تحت قرارداد رسمی اجرا می‌شود.
            </p>
          </div>
          <a
            href="tel:02188000000"
            className="shrink-0 text-xs font-bold font-mono px-4 py-2 rounded-full bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700"
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