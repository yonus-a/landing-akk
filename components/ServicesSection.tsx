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
  Check,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MobileCarousel } from "./MobileCarousel";

gsap.registerPlugin(ScrollTrigger);

interface Service {
  tag: string;
  title: string;
  description: string;
  icon: React.ElementType;
  accent: string;
  highlights: string[];
}

const services: Service[] = [
  {
    tag: "SOURCING & PROCUREMENT",
    title: "منبع‌یابی و خرید خارجی (Sourcing)",
    description:
      "شناسایی، استعلام و اعتبارسنجی کارخانجات و تولیدکنندگان معتبر در چین، امارات، ترکیه و اروپا. مذاکره تخصصی تجاری، چانه‌زنی حرفه‌ای، نظارت بر انطباق قراردادهای بین‌المللی Incoterms 2020 و تحویل ایمن اسناد.",
    icon: Globe2,
    accent: "#2a5ae0",
    highlights: [
      "اعتبارسنجی کارخانجات در گوانجو، شنژن و ایوو",
      "مذاکره و اخذ کمترین قیمت رقابتی کارخانه",
      "عقد قراردادهای تجاری رسمی دو زبانه",
      "تطبیق کامل با استانداردهای وارداتی ایران",
    ],
  },
  {
    tag: "AUTOMOTIVE & HEAVY FLEET",
    title: "واردات تخصصی خودرو، کشنده و قطعات یدکی",
    description:
      "تأمین و واردات قانونی انواع خودروهای سواری لوکس و اقتصادی، کامیون و کشنده‌های اروپایی و چینی، قطعات اصلی (OEM/OES) بدنه و موتوری، و ماشین‌آلات راه‌سازی و معدنی طبق آخرین آیین‌نامه‌ها و مصوبات کشوری.",
    icon: Car,
    accent: "#f59e0b",
    highlights: [
      "واردات کشنده‌های رنو، داف، ولوو و فوتون",
      "تأمین قطعات اورجینال OEM با تضمین اصالت",
      "اخذ تاییدیه خدمات پس از فروش و گارانتی",
      "تحویل پلاک ملی و تسویه اسقاط",
    ],
  },
  {
    tag: "MULTIMODAL FREIGHT",
    title: "حمل‌ونقل بین‌المللی (هوایی، دریایی، زمینی)",
    description:
      "قرارداد مستقیم و بدون واسطه با خطوط کشتیرانی کانتینری (FCL/LCL)، چارتر هوایی و کارگو اکسپرس، و ترانزیت جاده‌ای بین‌المللی از اروپا و ترکیه. رزرو سریع کانتینر با نرخ‌های رقابتی و صدور بارنامه اصلی فیاتا (FIATA).",
    icon: Ship,
    accent: "#0ea5e9",
    highlights: [
      "سرویس منظم دریایی از شانگهای و نینگبو به بندرعباس",
      "کارگو اکسپرس ۳ تا ۵ روزه از دبی و چین به فرودگاه امام",
      "ترانزیت زمینی تیرپارک (TIR) از استانبول و آلمان",
      "بیمه تمام‌خطر محموله و رصد لحظه‌ای آنلاین",
    ],
  },
  {
    tag: "CUSTOMS CLEARANCE",
    title: "ترخیص تخصصی از کلیه گمرکات کشور",
    description:
      "ترخیص سریع و بدون رسوب کالا توسط کارگزاران رسمی مقیم گمرک. تسلط کامل بر ردیف تعرفه‌ها (HS Code)، حل و فصل اختلافات گمرکی در کمیسیون‌های بدوی و تجدیدنظر، و جلوگیری از تحمیل هزینه‌های دموراژ و انبارداری.",
    icon: FileCheck2,
    accent: "#8b5cf6",
    highlights: [
      "گمرک شهید رجایی بندرعباس و بوشهر (تخصصی کانتینری)",
      "گمرک فرودگاه امام خمینی (تخصصی هوایی و قطعات حساس)",
      "گمرک بازرگان و رازی (ترانزیت زمینی اروپا و ترکیه)",
      "گمرک غرب تهران و شهریار (ترانزیت داخلی و قطعات خودرو)",
    ],
  },
  {
    tag: "REGULATORY & NTSW",
    title: "ثبت سفارش و اخذ مجوزهای قانونی",
    description:
      "انجام کلیه مراحل اداری و الکترونیکی سامانه جامع تجارت (NTSW)، اخذ مجوزهای استاندارد اجباری، وزارت صمت، سازمان راهداری، محیط زیست، وزارت بهداشت و جهاد کشاورزی تا مرحله تایید نهایی تخصیص ارز بانکی.",
    icon: ShieldCheck,
    accent: "#10b981",
    highlights: [
      "ثبت سفارش سریع کالا بدون نقص مدارک",
      "اخذ استاندارد COI و بازرسی مبدأ و مقصد",
      "پیگیری تخصیص ارز تالار اول و دوم نیما",
      "تمدید، ویرایش و انتقال کوتاژ بدون تاخیر",
    ],
  },
  {
    tag: "FX & LETTER OF CREDIT",
    title: "خدمات ارزی و گشایش اعتبار (LC)",
    description:
      "انجام حوالجات رسمی و مطمئن ارزی با کارمزد منصفانه و کمترین ریسک ممکن. پرداخت حواله یوان چین (RMB/CNY)، درهم امارات (AED)، دلار و یورو از طریق صرافی‌های دارای مجوز بانک مرکزی به حساب فروشنده یا کارخانه.",
    icon: CreditCard,
    accent: "#f43f5e",
    highlights: [
      "انتقال مستقیم حواله بانکی به حساب کارخانه در چین",
      "صدور سوئیفت (Swift Copy) معتبر و رسمی",
      "مشاوره گشایش اعتبارات اسنادی (LC) بانکی",
      "حفظ امنیت ارزی و تسویه‌حساب شفاف ریالی",
    ],
  },
];

function ServiceCard({
  service,
  cardRef,
  className = "",
}: {
  service: Service;
  cardRef?: (el: HTMLDivElement | null) => void;
  className?: string;
}) {
  const Icon = service.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      style={{ "--accent": service.accent } as React.CSSProperties}
      className={`group relative rounded-3xl p-px bg-zinc-200/80 dark:bg-zinc-800 shadow-[0_8px_30px_rgba(15,21,48,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_24px_50px_-18px_var(--accent)] transition-[box-shadow,translate] duration-500 hover:-translate-y-1 ${className}`}
    >
      {/* Accent gradient border on hover */}
      <div className="absolute inset-0 rounded-3xl bg-linear-to-bl from-(--accent) via-(--accent)/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative h-full flex flex-col justify-between overflow-hidden rounded-[calc(1.5rem-1px)] bg-white dark:bg-zinc-900 p-6">
        {/* Dot-grid texture fading down from the top */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-[0.18] group-hover:opacity-40 transition-opacity duration-500 bg-[radial-gradient(circle,var(--accent)_1px,transparent_1.5px)] bg-size-[14px_14px] mask-[linear-gradient(to_bottom,black,transparent)]"
        />

        {/* Cursor spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(320px_circle_at_var(--mx,50%)_var(--my,0%),color-mix(in_oklab,var(--accent)_14%,transparent),transparent_70%)]"
        />

        {/* Watermark icon */}
        <Icon
          aria-hidden
          strokeWidth={0.8}
          className="pointer-events-none absolute -top-8 -left-8 w-40 h-40 text-(--accent) opacity-[0.07] rotate-12 group-hover:rotate-0 group-hover:scale-110 group-hover:opacity-[0.12] transition-[rotate,scale,opacity] duration-700 ease-out"
        />

        <div className="relative">
          <div className="flex items-center justify-between gap-3 pb-4">
            <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-(--accent) shadow-[0_10px_24px_-8px_var(--accent)] group-hover:-rotate-6 group-hover:scale-105 transition-[rotate,scale] duration-500 overflow-hidden">
              <span className="absolute inset-0 bg-linear-to-br from-white/35 to-transparent" />
              <Icon className="relative w-5 h-5" strokeWidth={1.75} />
            </div>
            <span
              dir="ltr"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-[0.14em] text-(--accent) bg-(--accent)/8 border border-(--accent)/20"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-(--accent) animate-pulse" />
              {service.tag}
            </span>
          </div>

          <h3 className="text-base font-black text-zinc-950 dark:text-white mb-2 leading-snug">
            {service.title}
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
            {service.description}
          </p>

          <ul className="mt-4 space-y-2 pt-3 border-t border-dashed border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300">
            {service.highlights.slice(0, 3).map((highlight) => (
              <li key={highlight} className="flex items-center gap-2">
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-(--accent)/12 text-(--accent) shrink-0">
                  <Check className="w-2.5 h-2.5" strokeWidth={3} />
                </span>
                <span className="line-clamp-1">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-5 flex items-center justify-between">
          <a
            href="#estimator"
            className="group/cta inline-flex items-center gap-2.5 text-xs font-bold text-zinc-900 dark:text-zinc-100"
          >
            <span className="group-hover/cta:text-(--accent) transition-colors">استعلام و مشاوره</span>
            <span className="w-8 h-8 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-700 group-hover:bg-(--accent) group-hover:border-transparent group-hover:text-white transition-colors duration-300">
              <ArrowUpLeft className="w-3.5 h-3.5 group-hover/cta:-translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform" />
            </span>
          </a>
        </div>

        {/* Accent underline grows on hover */}
        <span
          aria-hidden
          className="absolute bottom-0 inset-x-0 h-1 bg-linear-to-l from-(--accent) to-(--accent)/0 origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
        />
      </div>
    </div>
  );
}

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1CardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const row2CardsRef = useRef<(HTMLDivElement | null)[]>([]);

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

        {/* Mobile Carousel */}
        <MobileCarousel label="خدمات بازرگانی" className="md:hidden my-2">
          {services.map((service) => (
            <ServiceCard key={service.tag} service={service} className="h-full" />
          ))}
        </MobileCarousel>

        {/* Tablet Flow Grid */}
        <div className="hidden md:grid grid-cols-2 lg:hidden gap-6 my-4">
          {services.map((service) => (
            <ServiceCard key={service.tag} service={service} />
          ))}
        </div>

        {/* Desktop 3D Perspective Stage */}
        <div className="hidden lg:block relative w-full min-h-[430px] my-4 [perspective:1400px] [transform-style:preserve-3d]">
          {/* Row 1 */}
          <div className="grid grid-cols-3 gap-6 absolute inset-x-0 top-0 pointer-events-none [transform-style:preserve-3d]">
            {row1Services.map((service, index) => (
              <ServiceCard
                key={service.tag}
                service={service}
                className="pointer-events-auto will-change-transform"
                cardRef={(el) => {
                  row1CardsRef.current[index] = el;
                }}
              />
            ))}
          </div>

          {/* Row 2 (3D Peel-Y Reveal) */}
          <div className="grid grid-cols-3 gap-6 absolute inset-x-0 top-0 pointer-events-none [transform-style:preserve-3d]">
            {row2Services.map((service, index) => (
              <ServiceCard
                key={service.tag}
                service={service}
                className="pointer-events-auto will-change-transform"
                cardRef={(el) => {
                  row2CardsRef.current[index] = el;
                }}
              />
            ))}
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
            className="shrink-0 text-xs font-bold tabular-nums px-4 py-2 rounded-full bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700"
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
