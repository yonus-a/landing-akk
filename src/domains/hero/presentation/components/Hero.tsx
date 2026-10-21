"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./Hero.module.css";
import { useHeroScene } from "../../application/hooks/useHeroScene";
import { LoadingScreen } from "./LoadingScreen";
import { CloudMist } from "./CloudMist";
import gsap from "gsap";
import {
  ArrowLeft,
  Sparkles,
  Plane,
  Ship,
  Truck,
} from "lucide-react";

interface LogisticsModeContent {
  id: 1 | 2 | 3;
  mode: "air" | "sea" | "land";
  label: string;
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

export function Hero() {
  const {
    canvasContainerRef,
    heroStageRef,
    cloudMistRef,
    loadingScreenRef,
    scrollWrapperRef,
    activePhase,
    scrollToPhase,
  } = useHeroScene();

  // Active displayed mode (synced with 3D camera progression: 1=Air, 2=Sea, 3=Land)
  const [currentModeId, setCurrentModeId] = useState<1 | 2 | 3>(1);
  const currentMode = LOGISTICS_MODES[currentModeId];

  // Mouse spotlight coordinates for ambient organic paper aura
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Refs for kinetic entrance & mode transition
  const heroContentRef = useRef<HTMLDivElement | null>(null);
  const modeSwitcherRef = useRef<HTMLDivElement | null>(null);
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
        modeSwitcherRef.current,
        { opacity: 0, y: -15, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: 0.1 }
      )
        .fromTo(
          badgeRef.current,
          { opacity: 0, y: 15, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7 },
          "-=0.4"
        )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.85 },
          "-=0.45"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.75 },
          "-=0.5"
        )
        .fromTo(
          [ctaGroupRef.current, statsGroupRef.current],
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.1 },
          "-=0.4"
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
          }
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
        className="sticky top-0 h-screen w-full flex items-center overflow-hidden bg-white dark:bg-zinc-950 z-10 transition-colors duration-300"
      >
        {/* 3D GRAPHITE ANIMATION LAYER */}
        <div
          ref={canvasContainerRef}
          id="canvas-container"
          className="absolute inset-y-0 left-0 w-full lg:w-[72%] h-full flex items-center justify-center pointer-events-none z-0 overflow-hidden"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            boxShadow: "none",
            maskImage: "radial-gradient(circle at center, black 75%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 75%, transparent 100%)",
          }}
        />

        {/* Cloud Mist Overlay for Airplane Dive Transition */}
        <CloudMist ref={cloudMistRef} />

        {/* Ambient Interactive Spotlight (Subtle light aura tracking cursor) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 z-1"
          style={{
            background: `radial-gradient(850px circle at ${mousePos.x}% ${mousePos.y}%, rgba(244, 244, 245, 0.4), transparent 75%)`,
          }}
        />

        {/* FOREGROUND HERO CONTENT: Pure, Borderless, Box-Free Right-Aligned Typography */}
        <div className="relative z-10 w-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 h-full flex items-center justify-start">
          
          <div
            ref={heroContentRef}
            className="w-full max-w-lg lg:max-w-[500px] xl:max-w-[540px] flex flex-col items-start text-right space-y-4 sm:space-y-5 transition-all duration-300 my-auto"
          >
            {/* Interactive Logistics Mode Tabs (Air / Sea / Land) */}
            <div
              ref={modeSwitcherRef}
              className="inline-flex items-center p-1 rounded-full bg-zinc-100/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 shadow-2xs"
            >
              {([1, 2, 3] as const).map((modeId) => {
                const item = LOGISTICS_MODES[modeId];
                const TabIcon = item.icon;
                const isActive = activePhase === modeId;
                return (
                  <button
                    key={modeId}
                    type="button"
                    onClick={() => scrollToPhase(modeId)}
                    aria-label={`انتقال به بخش ${item.label}`}
                    className={`relative inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm scale-102"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" strokeWidth={isActive ? 2.4 : 1.8} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Logistics Mode Badge */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100/90 dark:bg-zinc-900/90 border border-transparent dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold tracking-wide shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>{currentMode.badge}</span>
              <CurrentIcon className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" strokeWidth={2} />
            </div>

            {/* Dynamic High-Contrast Bold Headline */}
            <h1
              ref={headlineRef}
              className="text-3xl sm:text-4xl lg:text-[42px] font-black text-zinc-950 dark:text-white leading-[1.26] tracking-tight min-h-[78px] sm:min-h-[106px] flex items-center"
            >
              {currentMode.headline}
            </h1>

            {/* Dynamic Crisp & Legible Subtitle */}
            <p
              ref={subtitleRef}
              className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal min-h-[64px] sm:min-h-[72px]"
            >
              {currentMode.subtitle}
            </p>

            {/* Dynamic CTAs */}
            <div ref={ctaGroupRef} className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={currentMode.ctaLink}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs sm:text-sm font-bold shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>{currentMode.ctaText}</span>
                <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
              </a>

              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-transparent dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer"
              >
                <span>مشاهده خدمات</span>
              </a>
            </div>

            {/* Dynamic Mode-Specific Key Stats */}
            <div
              ref={statsGroupRef}
              className="flex items-center gap-4 sm:gap-5 pt-3 text-xs text-zinc-400 dark:text-zinc-500 font-medium flex-wrap"
            >
              {currentMode.stats.map((stat, sIdx) => (
                <React.Fragment key={stat.label}>
                  {sIdx > 0 && <span className="text-zinc-300 dark:text-zinc-700">•</span>}
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white font-mono text-sm ml-1">
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
