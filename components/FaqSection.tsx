"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  ArrowUpLeft,
  MessageCircle,
  Search,
  Ship,
  Car,
  Calculator,
  Package,
  Landmark,
  CheckCircle2,
  Sparkles,
  PhoneCall,
} from "lucide-react";

type FaqCategory = "all" | "shipping" | "automotive" | "customs" | "finance";

interface FaqItem {
  id: string;
  category: Exclude<FaqCategory, "all">;
  categoryLabel: string;
  icon: React.ElementType;
  question: string;
  answer: string;
  highlights: string[];
}

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("");
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: { id: FaqCategory; label: string }[] = [
    { id: "all", label: "همه موضوعات" },
    { id: "shipping", label: "حمل و لجستیک" },
    { id: "automotive", label: "واردات خودرو و کشنده" },
    { id: "customs", label: "گمرک و استعلام" },
    { id: "finance", label: "تخصیص ارز و حواله" },
  ];

  const faqs: FaqItem[] = [
    {
      id: "faq-1",
      category: "shipping",
      categoryLabel: "حمل و ترخیص",
      icon: Ship,
      question: "مدت زمان حمل و ترخیص کالا از چین و دبی چقدر است؟",
      answer:
        "مدت زمان با توجه به شیوه حمل متفاوت است: در حمل دریایی کانتینری از بنادر چین (شانگهای، شنژن، نینگبو) تا بندر شهید رجایی حدود ۱۸ تا ۲۲ روز دریانوردی زمان می‌برد و فرآیند ترخیص گمرکی بین ۵ تا ۸ روز کاری انجام می‌پذیرد. در حمل از دبی، لنج‌ها و شناورهای کانتینری بین ۳ تا ۵ روز به بنادر جنوب می‌رسند. در صورت استفاده از کارگو هوایی اکسپرس، محموله ظرف ۳ الی ۵ روز در گمرک فرودگاه امام خمینی تحویل و ترخیص فوری می‌شود.",
      highlights: [
        "حمل دریایی چین: ۱۸ تا ۲۲ روز",
        "حمل دریایی دبی: ۳ تا ۵ روز",
        "کارگو هوایی اکسپرس: ۳ تا ۵ روز",
      ],
    },
    {
      id: "faq-2",
      category: "automotive",
      categoryLabel: "خودرو و قطعات",
      icon: Car,
      question:
        "شرایط و مراحل واردات خودرو، کشنده و قطعات یدکی توسط جهان‌گستر چگونه است؟",
      answer:
        "جهان‌گستر کلیه مراحل ثبت سفارش در سامانه جامع تجارت، اخذ تاییدیه استاندارد، مجوز محیط زیست، تخصیص ارز و ترخیص گمرکی خودروهای سواری، کشنده‌ها و قطعات را بر عهده می‌گیرد. برای کشنده‌های اروپایی (رنو، داف، ولوو)، تشریفات اسقاط و پلاک‌گذاری نیز طبق آخرین ضوابط سازمان راهداری و وزارت صمت پیگیری و تحویل مشتری می‌گردد. کلیه قطعات یدکی دارای گواهی اصالت OEM و استاندارد COI هستند.",
      highlights: [
        "ثبت سفارش تا پلاک‌گذاری",
        "گواهی اصالت OEM و COI",
        "پوشش برندهای رنو، داف و ولوو",
      ],
    },
    {
      id: "faq-3",
      category: "customs",
      categoryLabel: "برآورد هزینه",
      icon: Calculator,
      question:
        "چگونه قبل از اقدام به خرید، هزینه دقیق گمرک و بهای تمام‌شده کالا را محاسبه کنیم؟",
      answer:
        "کافی است پیش‌فاکتور (Proforma Invoice) یا کاتالوگ فنی و کد تعرفه (HS Code) کالای خود را از طریق فرم استعلام آنلاین یا واتس‌اپ برای ما ارسال فرمایید. تیم کارشناسی تعرفه ما ظرف حداکثر ۲ ساعت کاری، جدول جامع آنالیز هزینه (Cost Sheet) شامل ارزش گمرکی بر اساس سوابق TSC، حقوق ورودی، عوارض هلال احمر، مالیات ارزش افزوده، هزینه‌های انبارداری و نرخ حمل را محاسبه و اعلام می‌نماید.",
      highlights: [
        "پاسخگویی در کمتر از ۲ ساعت کاری",
        "ارائه Cost Sheet جامع",
        "برآورد دقیق بر اساس ارزش TSC",
      ],
    },
    {
      id: "faq-4",
      category: "shipping",
      categoryLabel: "خرده‌بار (LCL)",
      icon: Package,
      question:
        "آیا امکان خرید و حمل خُرده‌بار (LCL) برای محموله‌های کمتر از یک کانتینر وجود دارد؟",
      answer:
        "بله، انبارهای اختصاصی تجمیع بار جهان‌گستر در شهرهای گوانجو و ایوو در چین و جبل‌علی در دبی، به طور روزانه محموله‌های خُرده‌بار تجار را دریافت و کانتینرسازی (Consolidation) می‌کنند. کالای شما با قبض انبار و بارنامه تفکیکی (House B/L) حمل شده و پس از تفکیک در گمرک مقصد به سرعت ترخیص و تحویل می‌گردد بدون اینکه نیاز به اجاره یک کانتینر کامل داشته باشید.",
      highlights: [
        "انبار اختصاصی در گوانجو، ایوو و جبل‌علی",
        "صدور بارنامه تفکیکی (House B/L)",
        "صرفه‌جویی در هزینه حمل",
      ],
    },
    {
      id: "faq-5",
      category: "finance",
      categoryLabel: "امور ارزی و بانکی",
      icon: Landmark,
      question:
        "نحوه تخصیص ارز و انتقال حواله یوان یا درهم به فروشنده خارجی به چه صورت انجام می‌شود؟",
      answer:
        "پس از تایید ثبت سفارش، پرونده جهت تخصیص ارز نیما یا ارز حاصل از صادرات در صف بانک مرکزی قرار می‌گیرد. همچنین در صورت نیاز به پرداخت سریع به فروشنده یا پیش‌پرداخت خرید کارخانه، از طریق شبکه صرافی‌های مجاز طرف قرارداد جهان‌گستر، حواله رسمی بانکی (TT / Swift) به حساب فروشنده در چین، دبی یا ترکیه با کمترین کارمزد و ارائه رسید معتبر سوئیفت انجام می‌پذیرد.",
      highlights: [
        "تخصیص ارز نیما و صادراتی",
        "حواله رسمی TT / Swift",
        "پوشش چین، امارات و ترکیه",
      ],
    },
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.question.includes(searchQuery.trim()) ||
        item.answer.includes(searchQuery.trim()) ||
        item.categoryLabel.includes(searchQuery.trim());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="relative w-full py-24 sm:py-32 bg-zinc-50/50 dark:bg-zinc-950 transition-colors duration-300 overflow-hidden"
      dir="rtl"
    >
      {/* Subtle Ambient Background Grid/Glow (keeps exact bg color while adding depth) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_70%,transparent_100%)]"
      />

      <div className="relative max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Right Column: Sticky Header, Search & Bento Support Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 dark:text-white tracking-tight leading-[1.25]">
                پرسش‌های متداول{" "}
                <span className="text-zinc-500 dark:text-zinc-400 font-extrabold block sm:inline">
                  بازرگانی و ترخیص کالا
                </span>
              </h2>

              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                پاسخ‌های شفاف و تخصصی به پرتکرارترین ابهامات بازرگانان پیرامون
                واردات خودرو، فرآیند گمرکی، کارمزدها و زمان‌بندی حمل.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در سوالات (مثلاً: ترخیص، کشنده، ارز نیما...)"
                className="w-full pr-11 pl-4 py-3.5 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/90 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-950 dark:focus:border-amber-400/60 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                >
                  پاک کردن
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-zinc-950 text-white dark:bg-amber-400 dark:text-zinc-950 shadow-xs"
                        : "bg-white dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200/70 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-950 dark:hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Modern Bento Support Card */}
            <div className="relative p-6 rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/90 shadow-xs overflow-hidden group">
              <div className="absolute -left-10 -top-10 w-32 h-32 rounded-full bg-amber-400/10 dark:bg-amber-400/5 blur-2xl pointer-events-none transition-transform duration-500 group-hover:scale-125" />

              <div className="relative space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-zinc-950 dark:bg-zinc-800 border border-zinc-800 dark:border-zinc-700 flex items-center justify-center shrink-0">
                      <MessageCircle
                        className="w-5 h-5 text-amber-400"
                        strokeWidth={1.75}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-zinc-950 dark:text-white">
                          نیاز به مشاوره تخصصی دارید؟
                        </h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          آنلاین
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        پاسخگویی همه‌روزه از ساعت ۸:۳۰ الی ۱۸:۰۰
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <a
                    href="tel:02188000000"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold transition-all shadow-2xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>تماس با مشاور بازرگانی</span>
                    <ArrowUpLeft className="w-3.5 h-3.5 mr-auto sm:mr-0" />
                  </a>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/50 dark:border-zinc-800/60">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                    <span>استعلام رایگان تعرفه</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column: Interactive Modern Accordion */}
          <div className="lg:col-span-7 space-y-3.5">
            {filteredFaqs.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/80 space-y-3">
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  موردی مطابق با جستجوی شما یافت نشد.
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  واژه دیگری را امتحان کنید یا فیلتر دسته‌بندی را روی «همه
                  موضوعات» قرار دهید.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold"
                >
                  نمایش همه سوالات
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openId === faq.id;
                const IconComponent = faq.icon;

                return (
                  <div
                    key={faq.id}
                    className={`group rounded-2xl transition-all duration-300 border ${
                      isOpen
                        ? "bg-white dark:bg-zinc-900 border-zinc-950/15 dark:border-amber-400/30 shadow-md dark:shadow-black/40"
                        : "bg-white/80 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-900 border-zinc-200/70 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700/80 shadow-2xs"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(faq.id)}
                      aria-expanded={isOpen}
                      className="w-full p-5 sm:p-6 text-right flex items-start sm:items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
                        {/* Icon / Index Box */}
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 border ${
                            isOpen
                              ? "bg-zinc-950 dark:bg-amber-400 text-white dark:text-zinc-950 border-transparent"
                              : "bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 border-zinc-200/60 dark:border-zinc-700/50 group-hover:text-zinc-900 dark:group-hover:text-white"
                          }`}
                        >
                          <IconComponent className="w-4 h-4" strokeWidth={2} />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="tabular-nums text-[11px] font-bold text-zinc-400 dark:text-zinc-500">
                              0{idx + 1}
                            </span>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                              {faq.categoryLabel}
                            </span>
                          </div>

                          <h3
                            className={`text-sm sm:text-base font-bold leading-snug transition-colors ${
                              isOpen
                                ? "text-zinc-950 dark:text-white"
                                : "text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white"
                            }`}
                          >
                            {faq.question}
                          </h3>
                        </div>
                      </div>

                      {/* Animated Plus/Close Trigger */}
                      <div
                        className={`mt-1 sm:mt-0 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isOpen
                            ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rotate-45"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-200/80 dark:group-hover:bg-zinc-700"
                        }`}
                      >
                        <Plus className="w-4 h-4" strokeWidth={2.2} />
                      </div>
                    </button>

                    {/* Smooth Height Accordion Content via CSS Grid */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-5 sm:px-6 pb-6 pt-1 sm:pr-[4.5rem] space-y-4">
                          <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800/80" />

                          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-7 font-normal text-justify">
                            {faq.answer}
                          </p>

                          {/* Key Highlights Pills */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {faq.highlights.map((tag, tagIdx) => (
                              <span
                                key={tagIdx}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200/70 dark:border-zinc-800 text-[11px] font-medium text-zinc-700 dark:text-zinc-300"
                              >
                                <CheckCircle2 className="w-3 h-3 text-zinc-950 dark:text-amber-400 shrink-0" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

export default FaqSection;