"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Receipt,
  Scale,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

export function WhyUsSection() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const pillars = [
    {
      title: "حضور مستقیم در مبدأ تجارت",
      description:
        "دفاتر رسمی و انبارهای اختصاصی تجمیع بار در دبی (جبل‌علی)، چین (گوانجو، ایوو و شنژن) و ترکیه (استانبول). حذف دلال‌ها.",
      icon: Building2,
      code: "01",
    },
    {
      title: "شفافیت مالی و تضمین هزینه",
      description:
        "ارائه Cost Sheet تفصیلی پیش از خرید، تعیین ریالی کارمزد و هزینه‌های گمرکی، بدون تحمیل هزینه‌های پنهان.",
      icon: Receipt,
      code: "02",
    },
    {
      title: "تسلط کامل بر قوانین گمرکی",
      description:
        "بهره‌گیری از کارگزاران رسمی، شناخت به‌روز ردیف تعرفه‌ها (HS Code) جهت عبور سریع از مسیرهای گمرکی.",
      icon: Scale,
      code: "03",
    },
    {
      title: "پوشش بیمه‌ای ۱۰۰٪ محموله‌ها",
      description:
        "تضمین تمام‌خطر (All Risks) برای انواع خودرو، کشنده‌ها و قطعات حساس از مبدأ تا انبار مشتری در ایران.",
      icon: ShieldCheck,
      code: "04",
    },
  ];

  const comparisons = [
    {
      metric: "سرعت ترخیص از بنادر",
      arian: "۵ الی ۱۰ روز کاری (برنامه‌ریزی پیش‌از‌رسیدن)",
      traditional: "۲۰ الی ۴۵ روز (رسوب کالا و معطلی اسناد)",
    },
    {
      metric: "شفافیت مالی و قرارداد",
      arian: "پیش‌فاکتور دقیق ریالی بدون تغییر و هزینه پنهان",
      traditional: "افزایش مداوم هزینه‌های دموراژ و مابه‌التفاوت",
    },
    {
      metric: "حضور مستقیم در چین و دبی",
      arian: "دفاتر و انبارهای اختصاصی فعال با کارشناسان مقیم",
      traditional: "واگذاری به واسطه‌های دست دوم و سوم محلی",
    },
    {
      metric: "پوشش بیمه‌ای کالا",
      arian: "بیمه‌نامه رسمی تمام‌خطر (کلوز A) بین‌المللی",
      traditional: "بدون بیمه یا حداقل بیمه باربری پایه",
    },
    {
      metric: "سامانه رهگیری محموله",
      arian: "گزارش‌دهی مستمر الکترونیکی و پشتیبان اختصاصی",
      traditional: "پیگیری‌های تلفنی نامنظم و عدم اطلاع از موقعیت",
    },
    {
      metric: "مجوزهای استاندارد و صمت",
      arian: "اخذ صفر تا صد مجوزهای NTSW و دفاع در کمیسیون",
      traditional: "ارجاع کارفرما به نهادها جهت رفع گیر مدارک",
    },
  ];

  return (
    <section id="why-us" className="relative w-full py-20 bg-zinc-950 text-white overflow-hidden" dir="rtl">
      {/* Background Glow Elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto space-y-3 mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-amber-400 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>{"// 03 — COMPETITIVE ADVANTAGES"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            چرا بازرگانان و صنعتگران آریان خودرو را انتخاب می‌کنند؟
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            ترکیب سابقه ۱۵ ساله، دفاتر عملیاتی در کشورهای مبدأ، و تسلط عمیق بر رویه‌های گمرکی ایران.
          </p>
        </motion.div>

        {/* Main Grid: 4 Pillars & Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Pillars (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const isActive = activeTab === idx;
              return (
                <motion.div
                  key={pillar.code}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  onClick={() => setActiveTab(idx)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border relative overflow-hidden group ${
                    isActive 
                      ? "bg-zinc-900/90 border-amber-500/50 shadow-lg shadow-amber-500/5" 
                      : "bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/70 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl transition-colors duration-300 ${
                      isActive ? "bg-amber-500 text-zinc-950 font-bold" : "bg-zinc-800 text-amber-400 group-hover:bg-zinc-700"
                    }`}>
                      <Icon className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                          {pillar.title}
                        </h3>
                        <span className="font-mono text-[10px] text-zinc-500">
                          {pillar.code}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed line-clamp-2">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Comparison Matrix (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl"
          >
            <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80">
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-amber-400 tracking-wider font-bold">
                  COMPARISON BENCHMARK
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  مقایسه شیوه اجرایی آریان خودرو با روش‌های سنتی
                </h3>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/50 text-[11px] font-mono text-zinc-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>ISO CERTIFIED</span>
              </div>
            </div>

            {/* Comparison Rows */}
            <div className="mt-4 space-y-3">
              {comparisons.map((c, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/50 grid grid-cols-12 gap-3 items-center hover:border-zinc-700 transition-all"
                >
                  <div className="col-span-12 sm:col-span-4 font-semibold text-xs text-zinc-200">
                    {c.metric}
                  </div>

                  <div className="col-span-12 sm:col-span-4 bg-emerald-950/30 border border-emerald-500/20 p-2.5 rounded-lg text-emerald-300 text-[11px] font-medium flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2.5} />
                    <span className="leading-snug">{c.arian}</span>
                  </div>

                  <div className="col-span-12 sm:col-span-4 bg-zinc-900/60 border border-zinc-800 p-2.5 rounded-lg text-zinc-400 text-[11px] flex items-center gap-2">
                    <X className="w-3.5 h-3.5 text-zinc-500 shrink-0" strokeWidth={2} />
                    <span className="leading-snug">{c.traditional}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Footer Note */}
            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
              <span className="text-[11px]">گزارش ماهانه شاخص‌های کیفی با ۹۹.۸٪ رضایت تجار و صنعتگران</span>
              <a
                href="#estimator"
                className="font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors group text-xs"
              >
                <span>ثبت استعلام محموله شما</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              </a>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}

export default WhyUsSection;