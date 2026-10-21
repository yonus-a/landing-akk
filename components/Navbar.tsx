"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  ArrowLeft,
  Menu,
  X,
  Compass,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "خدمات بازرگانی", href: "#services" },
    { label: "فرآیند ۶ مرحله‌ای", href: "#workflow" },
    { label: "استعلام قیمت", href: "#estimator" },
    { label: "دفاتر و گمرکات", href: "#hubs" },
  ];

  return (
    <header
      className="fixed top-3 sm:top-5 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none flex justify-center"
      dir="rtl"
    >
      {/* Floating Island Container with Glassmorphism & Rounded Corners */}
      <div
        className={`pointer-events-auto w-full max-w-[1140px] rounded-2xl sm:rounded-full px-4 sm:px-7 py-2.5 sm:py-3 flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 dark:bg-zinc-900/85 backdrop-blur-2xl shadow-[0_16px_40px_rgba(15,21,48,0.08),0_2px_6px_rgba(15,21,48,0.03)] dark:shadow-[0_16px_40px_rgba(15,21,48,0.4)] border border-zinc-200/50 dark:border-zinc-800/80 scale-[0.99]"
            : "bg-white/65 dark:bg-zinc-900/70 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,21,48,0.05),0_1px_3px_rgba(15,21,48,0.02)] dark:shadow-[0_10px_30px_rgba(15,21,48,0.3)] border border-zinc-200/30 dark:border-zinc-800/50"
        }`}
      >
        {/* Right: Minimal Brand Identity */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-zinc-950 dark:bg-amber-500 flex items-center justify-center text-white dark:text-zinc-950 shadow-2xs transition-transform duration-200 group-hover:scale-105">
            <Compass className="w-4 h-4 text-amber-400 dark:text-zinc-950" strokeWidth={1.75} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-black text-zinc-950 dark:text-white tracking-tight leading-snug">
              بازرگانی جهان‌گستر
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-400 font-medium hidden sm:inline leading-none">
              تجارت بین‌الملل و لجستیک
            </span>
          </div>
        </a>

        {/* Center: Clean Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-1.5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 transition-all duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Left: ThemeToggle + Direct Phone + Main Action Button */}
        <div className="hidden sm:flex items-center gap-2.5">
          <ThemeToggle />

          <a
            href="tel:02188000000"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white text-xs sm:text-sm font-bold font-mono transition-colors"
            dir="ltr"
          >
            <Phone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" strokeWidth={2} />
            <span>021-88000000</span>
          </a>

          <a
            href="#estimator"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold shadow-sm transition-all duration-150 hover:-translate-y-0.5"
          >
            <span>استعلام آنلاین</span>
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <a
            href="#estimator"
            className="sm:hidden px-3 py-1.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold shadow-2xs"
          >
            استعلام
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/90 dark:hover:bg-zinc-800 transition-colors"
            aria-label="منو"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" strokeWidth={1.75} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* Floating Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto fixed top-18 sm:top-20 inset-x-4 max-w-[400px] mx-auto rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl p-5 shadow-[0_20px_50px_rgba(15,21,48,0.12)] dark:shadow-[0_20px_50px_rgba(15,21,48,0.5)] border border-zinc-200/50 dark:border-zinc-800/80 space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 flex flex-col gap-2">
            <a
              href="tel:02188000000"
              className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm font-bold font-mono"
              dir="ltr"
            >
              <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400" strokeWidth={1.75} />
              <span>021-88000000</span>
            </a>

            <a
              href="#estimator"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-sm font-bold shadow-sm"
            >
              <span>درخواست استعلام قیمت</span>
              <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
