"use client";

import React, { useState } from "react";
import { ChevronDown, ArrowUpLeft, MessageCircle } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "مدت زمان حمل و ترخیص کالا از چین و دبی چقدر است؟",
      answer:
        "مدت زمان با توجه به شیوه حمل متفاوت است: در حمل دریایی کانتینری از بنادر چین (شانگهای، شنژن، نینگبو) تا بندر شهید رجایی حدود ۱۸ تا ۲۲ روز دریانوردی زمان می‌برد و فرآیند ترخیص گمرکی بین ۵ تا ۸ روز کاری انجام می‌پذیرد. در حمل از دبی، لنج‌ها و شناورهای کانتینری بین ۳ تا ۵ روز به بنادر جنوب می‌رسند. در صورت استفاده از کارگو هوایی اکسپرس، محموله ظرف ۳ الی ۵ روز در گمرک فرودگاه امام خمینی تحویل و ترخیص فوری می‌شود.",
    },
    {
      question: "شرایط و مراحل واردات خودرو، کشنده و قطعات یدکی توسط آریان خودرو چگونه است؟",
      answer:
        "آریان خودرو کلیه مراحل ثبت سفارش در سامانه جامع تجارت، اخذ تاییدیه استاندارد، مجوز محیط زیست، تخصیص ارز و ترخیص گمرکی خودروهای سواری، کشنده‌ها و قطعات را بر عهده می‌گیرد. برای کشنده‌های اروپایی (رنو، داف، ولوو)، تشریفات اسقاط و پلاک‌گذاری نیز طبق آخرین ضوابط سازمان راهداری و وزارت صمت پیگیری و تحویل مشتری می‌گردد. کلیه قطعات یدکی دارای گواهی اصالت OEM و استاندارد COI هستند.",
    },
    {
      question: "چگونه قبل از اقدام به خرید، هزینه دقیق گمرک و بهای تمام‌شده کالا را محاسبه کنیم؟",
      answer:
        "کافی است پیش‌فاکتور (Proforma Invoice) یا کاتالوگ فنی و کد تعرفه (HS Code) کالای خود را از طریق فرم استعلام آنلاین یا واتس‌اپ برای ما ارسال فرمایید. تیم کارشناسی تعرفه ما ظرف حداکثر ۲ ساعت کاری، جدول جامع آنالیز هزینه (Cost Sheet) شامل ارزش گمرکی بر اساس سوابق TSC، حقوق ورودی، عوارض هلال احمر، مالیات ارزش افزوده، هزینه‌های انبارداری و نرخ حمل را محاسبه و اعلام می‌نماید.",
    },
    {
      question: "آیا امکان خرید و حمل خُرده‌بار (LCL) برای محموله‌های کمتر از یک کانتینر وجود دارد؟",
      answer:
        "بله، انبارهای اختصاصی تجمیع بار آریان خودرو در شهرهای گوانجو و ایوو در چین و جبل‌علی در دبی، به طور روزانه محموله‌های خُرده‌بار تجار را دریافت و کانتینرسازی (Consolidation) می‌کنند. کالای شما با قبض انبار و بارنامه تفکیکی (House B/L) حمل شده و پس از تفکیک در گمرک مقصد به سرعت ترخیص و تحویل می‌گردد بدون اینکه نیاز به اجاره یک کانتینر کامل داشته باشید.",
    },
    {
      question: "نحوه تخصیص ارز و انتقال حواله یوان یا درهم به فروشنده خارجی به چه صورت انجام می‌شود؟",
      answer:
        "پس از تایید ثبت سفارش، پرونده جهت تخصیص ارز نیما یا ارز حاصل از صادرات در صف بانک مرکزی قرار می‌گیرد. همچنین در صورت نیاز به پرداخت سریع به فروشنده یا پیش‌پرداخت خرید کارخانه، از طریق شبکه صرافی‌های مجاز طرف قرارداد آریان خودرو، حواله رسمی بانکی (TT / Swift) به حساب فروشنده در چین، دبی یا ترکیه با کمترین کارمزد و ارائه رسید معتبر سوئیفت انجام می‌پذیرد.",
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative w-full py-24 sm:py-32 bg-zinc-50/50 dark:bg-zinc-950 transition-colors duration-300" dir="rtl">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pb-12 sm:pb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-zinc-900 border border-transparent dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-400 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 dark:bg-amber-400" />
            <span>{"// 06 — KNOWLEDGE BASE & FAQ"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
            پرسش‌های متداول بازرگانی و ترخیص کالا
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
            پاسخ‌های شفاف و تخصصی به پرتکرارترین ابهامات بازرگانان پیرامون واردات خودرو، فرآیند گمرکی، کارمزدها و زمان‌بندی.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 border border-transparent dark:border-zinc-800/80 rounded-2xl transition-all duration-200 overflow-hidden shadow-2xs hover:shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 sm:p-6 text-right flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50/70 dark:hover:bg-zinc-800/60 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-zinc-400 dark:text-zinc-500">
                      ۰{idx + 1}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={`p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" strokeWidth={2} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 animate-in fade-in duration-200">
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal pr-7">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Box */}
        <div className="mt-12 p-6 sm:p-7 rounded-2xl bg-white dark:bg-zinc-900 border border-transparent dark:border-zinc-800/80 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shrink-0">
              <MessageCircle className="w-5 h-5 text-zinc-700 dark:text-amber-400" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-950 dark:text-white">
                سوال دیگری در خصوص محموله یا کالای خود دارید؟
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
                کارشناسان بازرگانی ما همه روزه از ساعت ۸:۳۰ تا ۱۸:۰۰ پاسخگوی شما هستند.
              </div>
            </div>
          </div>

          <a
            href="tel:02188000000"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold transition-colors shrink-0 shadow-2xs"
          >
            <span>تماس با مشاور بازرگانی</span>
            <ArrowUpLeft className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
}

export default FaqSection;
