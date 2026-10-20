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
} from "lucide-react";

export function Hero() {
  const {
    canvasContainerRef,
    heroStageRef,
    cloudMistRef,
    loadingScreenRef,
    scrollWrapperRef,
  } = useHeroScene();

  // Mouse spotlight coordinates for ambient organic paper aura
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Refs for kinetic entrance
  const heroContentRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const ctaGroupRef = useRef<HTMLDivElement | null>(null);
  const statsGroupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.2 }
      )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.5"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(
          [ctaGroupRef.current, statsGroupRef.current],
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
          "-=0.4"
        );
    }, heroStageRef);

    return () => ctx.revert();
  }, [heroStageRef]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <section
      id="hero"
      ref={scrollWrapperRef}
      className={`${styles.heroWrapper || ""} relative w-full bg-white select-none`}
      style={{ height: "320vh" }}
      dir="rtl"
      lang="fa"
    >
      <LoadingScreen ref={loadingScreenRef} />

      {/* Pinned Sticky Stage during the 320vh scroll */}
      <div
        ref={heroStageRef}
        onMouseMove={handleMouseMove}
        className="sticky top-0 h-screen w-full flex items-center overflow-hidden bg-white z-10"
      >
        {/* 3D GRAPHITE ANIMATION LAYER: Positioned in the left/center visual field to clearly showcase Aircraft, Ship & Truck */}
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
            className="w-full max-w-lg lg:max-w-[500px] xl:max-w-[540px] flex flex-col items-start text-right space-y-5 sm:space-y-6 transition-all duration-300 my-auto"
          >
            {/* Minimal Brand Badge (NO borders) */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100/90 text-zinc-800 text-xs font-semibold tracking-wide shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>گروه بازرگانی و لجستیک بین‌المللی آریان خودرو</span>
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            </div>

            {/* High-Contrast Bold Headline */}
            <h1
              ref={headlineRef}
              className="text-3xl sm:text-4xl lg:text-[44px] font-black text-zinc-950 leading-[1.26] tracking-tight"
            >
              تجارت بین‌الملل، ترخیص تخصصی و حمل سراسری کالا
            </h1>

            {/* Crisp & Legible Subtitle */}
            <p
              ref={subtitleRef}
              className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal"
            >
              مدیریت صفر تا صد زنجیره تأمین، واردات خودرو و قطعات یدکی، حوالجات ارزی و ترخیص سریع از کلیه گمرکات کشور با کمترین بهای تمام‌شده.
            </p>

            {/* CTAs (NO borders) */}
            <div ref={ctaGroupRef} className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#estimator"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>استعلام آنلاین هزینه</span>
                <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
              </a>

              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer"
              >
                <span>مشاهده خدمات</span>
              </a>
            </div>

            {/* Minimal Inline Key Stats (NO borders) */}
            <div
              ref={statsGroupRef}
              className="flex items-center gap-5 pt-3 text-xs text-zinc-400 font-medium flex-wrap"
            >
              <div>
                <span className="font-bold text-zinc-900 font-mono text-sm ml-1">+۱۵</span>
                <span>سال سابقه</span>
              </div>
              <span className="text-zinc-300">•</span>
              <div>
                <span className="font-bold text-zinc-900 font-mono text-sm ml-1">+۸,۵۰۰</span>
                <span>کانتینر ترخیص‌شده</span>
              </div>
              <span className="text-zinc-300">•</span>
              <div>
                <span className="font-bold text-zinc-900 font-mono text-sm ml-1">۴</span>
                <span>دفتر فعال بین‌المللی</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;
