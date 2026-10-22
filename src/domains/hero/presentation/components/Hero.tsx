"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./Hero.module.css";
import { useHeroScene } from "../../application/hooks/useHeroScene";
import { LoadingScreen } from "./LoadingScreen";
import { CloudMist } from "./CloudMist";
import gsap from "gsap";
import { ArrowLeft, Sparkles, Plane, Ship, Truck } from "lucide-react";

interface LogisticsModeContent {
  id: 1 | 2 | 3;
  mode: "air" | "sea" | "land";
  label: string;
  shortLabel: string;
  badge: string;
  headline: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  icon: typeof Plane;
  stats: Array<{ value: string; label: string }>;
}

const LOGISTICS_MODES: Record<1 | 2 | 3, LogisticsModeContent> = {
  1: {
    id: 1,
    mode: "air",
    label: "باربری هوایی",
    shortLabel: "هوایی",
    badge: "کارگو هوایی و ترانزیت اکسپرس بین‌المللی",
    headline: "کارگو هوایی سریع، ترخیص فوری و واردات قطعات حساس",
    subtitle:
      "مدیریت پروازهای منظم کارگو و مسافری از چین، امارات و اروپا به فرودگاه امام خمینی؛ کوتاه‌ترین زمان تحویل برای نمونه‌های تجاری، قطعات الکترونیک و محموله‌های ارزشمند.",
    ctaText: "استعلام هزینه کارگو هوایی",
    ctaLink: "#estimator",
    icon: Plane,
    stats: [
      { value: "۳ الی ۵ روز", label: "میانگین ترانزیت هوایی" },
      { value: "+۴۸", label: "خط پروازی بین‌المللی" },
      { value: "۱۰۰٪", label: "پوشش کامل بیمه بار" },
    ],
  },
  2: {
    id: 2,
    mode: "sea",
    label: "کشتیرانی دریایی",
    shortLabel: "دریایی",
    badge: "کشتیرانی بین‌المللی و خطوط کانتینری مستقیم",
    headline: "کشتیرانی اقیانوسی، کانتینرهای دربست و خرده‌بار تجمیعی",
    subtitle:
      "ارسال مستقیم کانتینرهای ۲۰ و ۴۰ فوت استاندارد و یخچالی (FCL/LCL) از بنادر شانگهای، گوانجو، شنژن و جبل‌علی به بندرعباس و بوشهر با نازل‌ترین نرخ کرایه حمل دریایی.",
    ctaText: "استعلام حمل کانتینری دریایی",
    ctaLink: "#estimator",
    icon: Ship,
    stats: [
      { value: "+۸,۵۰۰", label: "کانتینر ترخیص‌شده سالانه" },
      { value: "۱۸ الی ۲۴ روز", label: "متوسط زمان دریانوردی" },
      { value: "FCL / LCL", label: "کانتینر کامل و خرده‌بار" },
    ],
  },
  3: {
    id: 3,
    mode: "land",
    label: "ترانزیت زمینی",
    shortLabel: "زمینی",
    badge: "ناوگان سنگین جاده‌ای و ترانزیت تحت کارنه تیر (TIR)",
    headline: "ترانزیت جاده‌ای TIR، ترخیص تخصصی و تحویل سراسری کالا",
    subtitle:
      "ناوگان مجهز کشنده‌های مدرن اروپایی، حمل تخصصی ترانزیتی از گمرکات بازرگان و سرخس، تشریفات اسقاط و شماره‌گذاری و تحویل مستقیم به انبار مشتری با پوشش کامل بیمه CMR.",
    ctaText: "استعلام ترانزیت جاده‌ای",
    ctaLink: "#estimator",
    icon: Truck,
    stats: [
      { value: "+۱۵ سال", label: "سابقه ترانزیت جاده‌ای" },
      { value: "کارنه تیر (TIR)", label: "ترانزیت بدون توقف مرزی" },
      { value: "سراسر کشور", label: "تحویل مستقیم درب انبار" },
    ],
  },
};

// Right-to-left brand gradient: navy → brand blue → ocean blue (lightened variant for dark mode)
// Background-colored halo keeps the gradient glyph edges legible over the blue ocean sketch
const HEADING_GRADIENT =
  "bg-linear-to-l from-brand via-brand-accent to-[#2b9bd6] dark:from-white dark:via-[#b9cbff] dark:to-[#6fa8ff] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_0_12px_rgba(30,41,90,0.95)]";

export function Hero() {
  const {
    canvasContainerRef,
    heroStageRef,
    cloudMistRef,
    loadingScreenRef,
    scrollWrapperRef,
    activePhase,
  } = useHeroScene();

  // Active displayed mode (synced with 3D camera progression: 1=Air, 2=Sea, 3=Land)
  const [currentModeId, setCurrentModeId] = useState<1 | 2 | 3>(1);
  const currentMode = LOGISTICS_MODES[currentModeId];

  // Mouse spotlight coordinates for ambient organic paper aura
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Refs for kinetic entrance & mode transition
  const heroContentRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const ctaGroupRef = useRef<HTMLDivElement | null>(null);
  const statsGroupRef = useRef<HTMLDivElement | null>(null);

  // Initial kinetic entrance animation on page load
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 15, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: 0.1 },
      )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.85 },
          "-=0.45",
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.75 },
          "-=0.5",
        )
        .fromTo(
          [ctaGroupRef.current, statsGroupRef.current],
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.1 },
          "-=0.4",
        );
    }, heroStageRef);

    return () => ctx.revert();
  }, [heroStageRef]);

  // Smooth kinetic text transition when 3D camera transitions between Air -> Sea -> Land
  useEffect(() => {
    if (activePhase === currentModeId) return;

    const animTargets = [
      badgeRef.current,
      headlineRef.current,
      subtitleRef.current,
      statsGroupRef.current,
    ].filter(Boolean);

    gsap.to(animTargets, {
      opacity: 0,
      y: -8,
      duration: 0.18,
      stagger: 0.02,
      ease: "power2.in",
      onComplete: () => {
        setCurrentModeId(activePhase);
        gsap.fromTo(
          animTargets,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.32,
            stagger: 0.04,
            ease: "power2.out",
          },
        );
      },
    });
  }, [activePhase, currentModeId]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const CurrentIcon = currentMode.icon;

  return (
    <section
      id="hero"
      ref={scrollWrapperRef}
      className={`${styles.heroWrapper || ""} relative w-full bg-white dark:bg-zinc-950 select-none transition-colors duration-300`}
      style={{ height: "320vh" }}
      dir="rtl"
      lang="fa"
    >
      <LoadingScreen ref={loadingScreenRef} />

      {/* Pinned Sticky Stage during the 320vh scroll */}
      <div
        ref={heroStageRef}
        onMouseMove={handleMouseMove}
        className="sticky top-0 h-screen h-[100dvh] w-full flex flex-col lg:flex-row items-center justify-between lg:justify-start overflow-hidden bg-white dark:bg-zinc-950 z-10 transition-colors duration-300 pt-14 pb-3 sm:pt-18 sm:pb-5 lg:py-0"
      >
        {/* 3D GRAPHITE ANIMATION LAYER */}
        <div
          ref={canvasContainerRef}
          id="canvas-container"
          className="relative lg:absolute lg:inset-y-0 lg:left-0 w-full flex-1 min-h-[34dvh] lg:min-h-0 lg:h-full lg:w-[72%] flex items-center justify-center pointer-events-none z-0 overflow-hidden"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            boxShadow: "none",
            maskImage:
              "radial-gradient(circle at center, black 72%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 72%, transparent 100%)",
          }}
        />

        {/* Cloud Mist Overlay for Airplane Dive Transition */}
        <CloudMist ref={cloudMistRef} />

        {/* Ambient Interactive Spotlight (Subtle light aura tracking cursor) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 z-1"
          style={{
            background: `radial-gradient(850px circle at ${mousePos.x}% ${mousePos.y}%, rgba(236, 239, 248, 0.4), transparent 75%)`,
          }}
        />

        {/* FOREGROUND HERO CONTENT: Pure, Borderless, Box-Free Right-Aligned Typography */}
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 xl:px-16 shrink-0 lg:flex-1 flex flex-col justify-end lg:justify-center items-start lg:h-full pointer-events-none pb-2 sm:pb-4 lg:pb-0">
          <div
            ref={heroContentRef}
            className="relative isolate w-full max-w-lg lg:max-w-[500px] xl:max-w-[540px] flex flex-col items-start text-right space-y-2.5 sm:space-y-4 lg:space-y-5 transition-all duration-300 pointer-events-auto bg-gradient-to-t from-white via-white/95 to-transparent dark:from-zinc-950 dark:via-zinc-950/95 dark:to-transparent lg:bg-none pt-3 sm:pt-4 lg:pt-0"
          >
              {/* Feathered frosted scrim: softens the sketch behind the copy without a visible panel edge */}
              <div
                aria-hidden="true"
                className="hidden lg:block absolute  -inset-x-20 -z-10 pointer-events-none bg-white/75 dark:bg-zinc-950/75 backdrop-blur-[6px] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_72%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_72%)]"
              />
              {/* Dynamic Logistics Mode Badge */}
              <div
                ref={badgeRef}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-zinc-100/90 dark:bg-zinc-900/90 border border-transparent dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-[11px] sm:text-xs font-semibold tracking-wide shadow-2xs"
              >
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{currentMode.badge}</span>
                <CurrentIcon
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400 dark:text-zinc-500"
                  strokeWidth={2}
                />
              </div>

              {/* Company Identity */}
              <p className="text-sm sm:text-base lg:text-lg font-black tracking-tight leading-none">
                <span className={HEADING_GRADIENT}>{"جهان\u200Cگستر"}</span>
                <span className="text-zinc-400 dark:text-zinc-500 font-medium text-xs sm:text-sm lg:text-base mr-2">
                  تجارت بین‌الملل و لجستیک
                </span>
              </p>

              {/* Dynamic Gradient Headline */}
              <h1
                ref={headlineRef}
                className="text-xl sm:text-2xl md:text-3xl lg:text-[42px] font-black leading-tight lg:leading-[1.26] tracking-tight min-h-[48px] sm:min-h-[68px] lg:min-h-[106px] flex items-center"
              >
                <span className={HEADING_GRADIENT}>{currentMode.headline}</span>
              </h1>

              {/* Dynamic Crisp & Legible Subtitle */}
              <p
                ref={subtitleRef}
                className="text-xs sm:text-sm lg:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal line-clamp-2 sm:line-clamp-3 lg:line-clamp-none min-h-[36px] sm:min-h-[48px] lg:min-h-[72px]"
              >
                {currentMode.subtitle}
              </p>

              {/* Dynamic CTAs */}
              <div
                ref={ctaGroupRef}
                className="flex flex-wrap items-center gap-2 sm:gap-3 pt-0.5 sm:pt-1"
              >
                <a
                  href={currentMode.ctaLink}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs sm:text-sm font-bold shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>{currentMode.ctaText}</span>
                  <ArrowLeft
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    strokeWidth={1.75}
                  />
                </a>

                <a
                  href="#services"
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-3 rounded-full bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-transparent dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer"
                >
                  <span>مشاهده خدمات</span>
                </a>
              </div>

              {/* Dynamic Mode-Specific Key Stats */}
              <div
                ref={statsGroupRef}
                className="flex items-center gap-2.5 sm:gap-4 lg:gap-5 pt-1 sm:pt-3 text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-medium flex-wrap"
              >
                {currentMode.stats.map((stat, sIdx) => (
                  <React.Fragment key={stat.label}>
                    {sIdx > 0 && (
                      <span className="text-zinc-300 dark:text-zinc-700">
                        •
                      </span>
                    )}
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-white tabular-nums text-xs sm:text-sm ml-1">
                        {stat.value}
                      </span>
                      <span>{stat.label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}

export default Hero;
