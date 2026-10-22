"use client";

import React, { useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  MapPin,
  Anchor,
  Plane,
  Truck,
  Layers,
  Ship,
  Phone,
  Navigation,
  Clock,
  Zap,
  Route,
  type LucideIcon,
} from "lucide-react";
import { MobileCarousel } from "./MobileCarousel";

interface Hub {
  code: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  role: string;
  lat: number;
  lng: number;
  timeZone: string;
  type: string;
}

const HQ_CODE = "THR";

const hubs: Hub[] = [
  {
    code: "THR",
    city: "دفتر مرکزی تهران",
    country: "ایران",
    address: "خیابان ولیعصر، نرسیده به میدان ونک، برج تجارت، طبقه ۸، واحد ۸۰۴",
    phone: "+98 21 88000000",
    role: "مدیریت قراردادها، امور بانکی و ارزی، سامانه جامع تجارت و هماهنگی کل شعب",
    lat: 35.7575,
    lng: 51.41,
    timeZone: "Asia/Tehran",
    type: "دفتر مرکزی",
  },
  {
    code: "DXB",
    city: "دفتر و انبار امارات (دبی)",
    country: "امارات متحده عربی",
    address: "Dubai, Business Bay, The Bay Gate Tower & JAFZA Freezone Logistics Hub",
    phone: "+971 4 000 0000",
    role: "انبار تجمیع کالا در جبل‌علی، ترانزیت هوایی و دریایی، حوالجات درهم و خدمات ری‌اکسپورت",
    lat: 25.1972,
    lng: 55.2744,
    timeZone: "Asia/Dubai",
    type: "هاب عملیاتی",
  },
  {
    code: "CAN",
    city: "دفتر و انبار چین (گوانجو و ایوو)",
    country: "جمهوری خلق چین",
    address: "Guangzhou, Tianhe District, Poly Plaza & Yiwu International Trade City Warehouse",
    phone: "+86 20 0000 0000",
    role: "منبع‌یابی کارخانجات، بازرسی فنی و کیفی کالا، صدور بارنامه کانتینری و حواله یوان مستقیم",
    lat: 23.1291,
    lng: 113.2644,
    timeZone: "Asia/Shanghai",
    type: "مرکز منبع‌یابی و تجمیع",
  },
  {
    code: "IST",
    city: "دفتر و هاب ترانزیت ترکیه (استانبول)",
    country: "ترکیه",
    address: "Istanbul, Beylikdüzü Trade Center & Mersin Port Logistics Depot",
    phone: "+90 212 000 0000",
    role: "خرید قطعات خودرو و ماشین‌آلات صنعتی، هماهنگی کاروان تیر زمینی (TIR) به مقصد گمرک بازرگان",
    lat: 41.0082,
    lng: 28.9784,
    timeZone: "Europe/Istanbul",
    type: "هاب ترانزیت اروپا",
  },
];

interface CustomsHub {
  name: string;
  specialty: string;
  icon: LucideIcon;
  tag: string;
  time: string;
  days: readonly [min: number, max: number];
  /** Accent for light and dark themes. */
  accent: readonly [light: string, dark: string];
}

const MAX_DAYS = 10;

const customsHubs: CustomsHub[] = [
  {
    name: "گمرک شهید رجایی بندرعباس",
    specialty: "بزرگترین بندر کانتینری کشور، ترخیص FCL و کانتینرهای سنگین، خودرو و قطعات یدکی",
    icon: Ship,
    tag: "بندر کانتینری",
    time: "۵ الی ۸ روز کاری",
    days: [5, 8],
    accent: ["#0369a1", "#38bdf8"],
  },
  {
    name: "گمرک فرودگاه بین‌المللی امام خمینی (ره)",
    specialty: "کارگو هوایی، ترخیص فوری نمونه کالاها، قطعات حساس الکترونیکی و دارو و لوازم پزشکی",
    icon: Plane,
    tag: "کارگو هوایی",
    time: "۲ الی ۴ روز کاری",
    days: [2, 4],
    accent: ["#6d28d9", "#a78bfa"],
  },
  {
    name: "گمرک بوشهر",
    specialty: "تخصصی خودروهای سبک، کشنده‌ها، لوازم خانگی و کالاهای مشمول تخفیف ۲۰ درصدی ملوانی",
    icon: Anchor,
    tag: "بندر تخصصی خودرو",
    time: "۶ الی ۹ روز کاری",
    days: [6, 9],
    accent: ["#1d4ed8", "#93c5fd"],
  },
  {
    name: "گمرک بازرگان و رازی",
    specialty: "دروازه ترانزیت زمینی اروپا و ترکیه، پذیرش کامیون‌های چادری و تریلرهای کشنده جاده‌ای",
    icon: Truck,
    tag: "ترانزیت زمینی",
    time: "۳ الی ۵ روز کاری",
    days: [3, 5],
    accent: ["#b45309", "#fbbf24"],
  },
  {
    name: "گمرک خرمشهر و منطقه آزاد اروند",
    specialty: "ترخیص ماشین‌آلات راه‌سازی و معدنی، فولاد، قطعات سنگین و مزایای معافیت‌های منطقه آزاد",
    icon: Anchor,
    tag: "بندر منطقه آزاد",
    time: "۵ الی ۷ روز کاری",
    days: [5, 7],
    accent: ["#0f766e", "#2dd4bf"],
  },
  {
    name: "گمرک غرب تهران و شهریار",
    specialty: "ترخیص ترانزیت داخلی، انبار اختصاصی قطعات یدکی خودرو و تسویه در قلب پایتخت",
    icon: Layers,
    tag: "گمرک پایتخت",
    time: "۳ الی ۵ روز کاری",
    days: [3, 5],
    accent: ["#047857", "#34d399"],
  },
];

const FASTEST_MIN_DAYS = Math.min(...customsHubs.map((c) => c.days[0]));

const subscribeMinute = (onChange: () => void) => {
  const id = setInterval(onChange, 15_000);
  return () => clearInterval(id);
};
const getMinute = () => Math.floor(Date.now() / 60_000);
const getServerMinute = () => null;

/** Current epoch minute on the client; null during SSR so clocks never mismatch on hydration. */
function useCurrentMinute() {
  return useSyncExternalStore(subscribeMinute, getMinute, getServerMinute);
}

function localClock(minute: number | null, timeZone: string) {
  if (minute === null) return { label: "--:--", open: null as boolean | null };
  const date = new Date(minute * 60_000);
  const label = new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone }).format(date);
  const hour = Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone }).format(date));
  return { label, open: hour >= 8 && hour < 18 };
}

function distanceToHqKm(hub: Hub) {
  const hq = hubs[0];
  const rad = Math.PI / 180;
  const dLat = (hub.lat - hq.lat) * rad;
  const dLng = (hub.lng - hq.lng) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(hq.lat * rad) * Math.cos(hub.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatCoords(hub: Hub) {
  return `${hub.lat.toFixed(4)}° N, ${hub.lng.toFixed(4)}° E`;
}

function SplitFlap({ text, size = "sm" }: { text: string; size?: "sm" | "lg" }) {
  const tile =
    size === "lg"
      ? "w-10 h-13 text-2xl rounded-lg"
      : "w-6 h-8 text-sm rounded-md";
  return (
    <span dir="ltr" className="inline-flex gap-1 [perspective:400px]">
      {text.split("").map((ch, i) => (
        <motion.span
          key={`${text}-${i}`}
          initial={size === "lg" ? { rotateX: -90, opacity: 0 } : false}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className={`relative flex items-center justify-center font-black tabular-nums bg-zinc-900 text-amber-300 shadow-[inset_0_-2px_0_rgba(0,0,0,0.35)] overflow-hidden ${tile}`}
        >
          {ch}
          <span className="absolute inset-x-0 top-1/2 h-px bg-black/50" />
          <span className="absolute inset-x-0 top-0 h-1/2 bg-white/[0.04]" />
        </motion.span>
      ))}
    </span>
  );
}

function StatusDot({ open }: { open: boolean | null }) {
  if (open === null) return <span className="w-2 h-2 rounded-full bg-zinc-600" />;
  return (
    <span className="relative flex w-2 h-2">
      {open && <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-70 animate-ping" />}
      <span className={`relative w-2 h-2 rounded-full ${open ? "bg-emerald-400" : "bg-zinc-500"}`} />
    </span>
  );
}

function CustomsCard({ customs, idx }: { customs: CustomsHub; idx: number }) {
  const Icon = customs.icon;
  const [minDays, maxDays] = customs.days;
  const isFastest = minDays === FASTEST_MIN_DAYS;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (idx % 3) * 0.08, ease: "easeOut" }}
      style={{ "--accent-l": customs.accent[0], "--accent-d": customs.accent[1] } as React.CSSProperties}
      className="group relative h-full rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-5 sm:p-6 overflow-hidden transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-1 hover:border-(--accent)/40 hover:shadow-[0_24px_48px_-24px_var(--accent)] [--accent:var(--accent-l)] dark:[--accent:var(--accent-d)]"
    >
      <div className="pointer-events-none absolute -top-20 -left-20 w-48 h-48 rounded-full bg-(--accent)/10 blur-2xl group-hover:bg-(--accent)/20 transition-colors duration-500" />
      <Icon
        aria-hidden
        strokeWidth={0.8}
        className="pointer-events-none absolute -bottom-6 -left-6 w-32 h-32 text-(--accent) opacity-[0.06] group-hover:opacity-[0.12] group-hover:-rotate-12 transition-[opacity,rotate] duration-700"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-(--accent)/10 text-(--accent) ring-1 ring-(--accent)/20 group-hover:bg-(--accent) group-hover:text-white dark:group-hover:text-zinc-950 transition-colors duration-300">
          <Icon className="w-5 h-5" strokeWidth={1.75} />
        </div>
        <div className="flex flex-wrap justify-end items-center gap-1.5">
          {isFastest && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-700 dark:text-amber-300 border border-amber-400/30">
              <Zap className="w-3 h-3" />
              سریع‌ترین
            </span>
          )}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-(--accent)/8 text-(--accent) border border-(--accent)/20">
            {customs.tag}
          </span>
        </div>
      </div>

      <h4 className="relative mt-4 text-sm sm:text-base font-black text-zinc-950 dark:text-white leading-snug">
        {customs.name}
      </h4>
      <p className="relative mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
        {customs.specialty}
      </p>

      {/* Clearance range gauge */}
      <div className="relative mt-5 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 font-bold text-zinc-500 dark:text-zinc-400">
            <Clock className="w-3 h-3" /> میانگین ترخیص
          </span>
          <span className="font-black text-(--accent)">{customs.time}</span>
        </div>
        <div className="relative h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <motion.span
            className="absolute inset-y-0 rounded-full bg-linear-to-l from-(--accent) to-(--accent)/50"
            style={{ right: `${(minDays / MAX_DAYS) * 100}%` }}
            initial={{ width: 0 }}
            whileInView={{ width: `${((maxDays - minDays) / MAX_DAYS) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 + (idx % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
          />
          {Array.from({ length: MAX_DAYS - 1 }, (_, i) => (
            <span
              key={i}
              className="absolute inset-y-0 w-px bg-white/70 dark:bg-zinc-900/70"
              style={{ right: `${((i + 1) / MAX_DAYS) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[9px] font-bold text-zinc-400">
          <span>امروز</span>
          <span>۱۰ روز</span>
        </div>
      </div>
    </motion.div>
  );
}

export function GlobalHubsSection() {
  const [activeHub, setActiveHub] = useState(1);
  const minute = useCurrentMinute();
  const hub = hubs[activeHub];
  const hubClock = localClock(minute, hub.timeZone);
  const isHq = hub.code === HQ_CODE;
  const distance = Math.round(distanceToHqKm(hub) / 10) * 10;

  return (
    <section
      id="hubs"
      className="relative w-full py-24 sm:py-32 bg-white dark:bg-zinc-950 transition-colors duration-300 overflow-hidden"
      dir="rtl"
    >
      {/* Blueprint grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-40 bg-[linear-gradient(to_right,rgba(42,90,224,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(42,90,224,0.07)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] rounded-full bg-brand-accent/10 blur-[120px]" />

      <div className="relative max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pb-12 sm:pb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold text-brand-accent dark:text-[#8fb0ff] bg-brand-accent/8 border border-brand-accent/15">
            <Route className="w-3.5 h-3.5" />
            شبکه عملیاتی جهان‌گستر
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
            دفاتر بین‌المللی و گمرکات تحت پوشش مستقیم
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
            استقرار شعب فعال در ۴ مرکز کلیدی تجارت جهانی در کنار کارگزاران رسمی و مقیم در ۶ گمرک تراز اول کشور.
          </p>
        </div>

        {/* BLOCK 1: International hubs as a departures board */}
        <div className="mb-20">
          <div className="flex items-center gap-2 pb-5">
            <Building2 className="w-4 h-4 text-brand-accent dark:text-[#8fb0ff]" />
            <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
              دفاتر عملیاتی و انبارهای لجستیکی خارجی
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Board */}
            <div className="lg:col-span-7 rounded-3xl bg-zinc-950 dark:bg-zinc-900 ring-1 ring-zinc-900/5 dark:ring-white/10 p-3 sm:p-4 shadow-[0_30px_60px_-30px_rgba(15,21,48,0.6)]">
              <div className="flex items-center justify-between px-3 pt-2 pb-4">
                <div className="flex items-center gap-2 text-amber-300">
                  <Plane className="w-4 h-4 -rotate-45" />
                  <span className="text-xs font-black tracking-wide">تابلوی دفاتر بین‌المللی</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-zinc-400">
                  <Clock className="w-3 h-3" />
                  ساعت محلی هر دفتر
                </span>
              </div>

              <div className="space-y-1.5">
                {hubs.map((h, idx) => {
                  const isActive = idx === activeHub;
                  const clock = localClock(minute, h.timeZone);
                  return (
                    <button
                      key={h.code}
                      type="button"
                      onClick={() => setActiveHub(idx)}
                      aria-pressed={isActive}
                      className={`relative w-full grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_auto_auto] items-center gap-x-5 gap-y-1 rounded-2xl px-4 py-3.5 text-right cursor-pointer transition-colors ${
                        isActive ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="hub-board-active"
                          className="absolute right-0 top-3 bottom-3 w-1 rounded-l-full bg-amber-300"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <SplitFlap text={h.code} />
                      <span className="min-w-0">
                        <span className={`block text-sm font-bold leading-snug sm:truncate ${isActive ? "text-white" : "text-zinc-300"}`}>
                          {h.city}
                        </span>
                        <span className="block text-[11px] text-zinc-500 truncate">
                          {h.country} · {h.type}
                        </span>
                      </span>
                      <span className="tabular-nums text-base font-black text-amber-300/90" dir="ltr">
                        {clock.label}
                      </span>
                      <span className="hidden sm:inline-flex w-24 items-center gap-1.5 text-[10px] font-bold text-zinc-400">
                        <StatusDot open={clock.open} />
                        {clock.open === null ? "—" : clock.open ? "ساعت کاری" : "خارج از ساعت کاری"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Boarding-pass detail */}
            <div className="lg:col-span-5 relative rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-[0_20px_50px_-25px_rgba(15,21,48,0.35)] overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-l from-amber-300 via-brand-accent to-brand" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={hub.code}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="p-6 sm:p-7 h-full flex flex-col"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-brand-accent/8 text-brand-accent dark:text-[#8fb0ff] border border-brand-accent/15">
                      {hub.type}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                      <StatusDot open={hubClock.open} />
                      <span className="tabular-nums" dir="ltr">{hubClock.label}</span>
                    </span>
                  </div>

                  {/* Route */}
                  <div dir="ltr" className="flex items-center gap-3 py-6">
                    <SplitFlap text={hub.code} size="lg" />
                    {!isHq && (
                      <>
                        <span className="relative flex-1 h-px border-t-2 border-dashed border-zinc-300 dark:border-zinc-700">
                          <motion.span
                            className="absolute -top-[9px] text-brand-accent dark:text-[#8fb0ff]"
                            initial={{ left: "0%" }}
                            animate={{ left: "calc(100% - 16px)" }}
                            transition={{ duration: 1.4, ease: "easeInOut", delay: 0.3 }}
                          >
                            <Plane className="w-4 h-4 rotate-45" />
                          </motion.span>
                        </span>
                        <SplitFlap text={HQ_CODE} size="lg" />
                      </>
                    )}
                  </div>

                  <h4 className="text-lg font-black text-zinc-950 dark:text-white leading-snug">{hub.city}</h4>
                  <p className="text-[11px] font-bold text-zinc-400 mt-0.5">{hub.country}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mt-3">{hub.role}</p>

                  {/* Perforation */}
                  <div aria-hidden className="relative -mx-6 sm:-mx-7 my-5 flex items-center">
                    <span className="absolute -right-3 w-6 h-6 rounded-full bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800" />
                    <span className="mx-5 flex-1 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800" />
                    <span className="absolute -left-3 w-6 h-6 rounded-full bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800" />
                  </div>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                    <div className="col-span-2">
                      <dt className="text-[10px] font-bold text-zinc-400 mb-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> نشانی
                      </dt>
                      <dd dir="auto" className="font-semibold text-zinc-800 dark:text-zinc-200 leading-relaxed">
                        {hub.address}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-bold text-zinc-400 mb-0.5">موقعیت جغرافیایی</dt>
                      <dd dir="ltr" className="text-right tabular-nums font-semibold text-zinc-800 dark:text-zinc-200 text-[11px]">
                        {formatCoords(hub)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-bold text-zinc-400 mb-0.5">فاصله تا دفتر مرکزی</dt>
                      <dd className="font-black text-brand dark:text-white">
                        {isHq ? "همین‌جا" : `${distance.toLocaleString("fa-IR")} کیلومتر`}
                      </dd>
                    </div>
                  </dl>

                  <div className="flex flex-wrap gap-2.5 mt-6 pt-1">
                    <a
                      href={`tel:${hub.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span dir="ltr" className="tabular-nums">{hub.phone}</span>
                    </a>
                    <a
                      href={`https://www.google.com/maps?q=${hub.lat},${hub.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      مسیریابی روی نقشه
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* BLOCK 2: Customs gates */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5">
            <div className="flex items-center gap-2">
              <Anchor className="w-4 h-4 text-brand-accent dark:text-[#8fb0ff]" />
              <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                گمرکات تخصصی تحت پوشش مستقیم با کارگزاران مقیم
              </h3>
            </div>
            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
              نوار هر کارت، بازه میانگین زمان ترخیص را روی مقیاس ۱۰ روزه نشان می‌دهد
            </span>
          </div>

          <MobileCarousel label="گمرکات تحت پوشش" className="sm:hidden">
            {customsHubs.map((customs, idx) => (
              <CustomsCard key={customs.name} customs={customs} idx={idx} />
            ))}
          </MobileCarousel>

          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-5">
            {customsHubs.map((customs, idx) => (
              <CustomsCard key={customs.name} customs={customs} idx={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default GlobalHubsSection;
