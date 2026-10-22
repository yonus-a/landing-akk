"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Mail, Phone, Users } from "lucide-react";

interface TeamMember {
  code: string;
  name: string;
  role: string;
  roleEn: string;
  bio: string;
  /** Path under /public, e.g. "/team/member-01.jpg" (portrait, ideally 4:5). */
  photo: string;
  email?: string;
  phone?: string;
  linkedin?: string;
}

const TEAM: TeamMember[] = [
  {
    code: "01",
    name: "محمدرضا جهانگیری",
    role: "مدیرعامل و بنیان‌گذار",
    roleEn: "CEO & FOUNDER",
    bio: "بیش از ۲۰ سال تجربه در تجارت بین‌الملل و توسعه کریدورهای لجستیکی آسیا و اروپا.",
    photo: "/team/member-01.jpg",
    email: "ceo@jahangostar.com",
    linkedin: "#",
  },
  {
    code: "02",
    name: "سارا محمدی",
    role: "مدیر بازرگانی خارجی",
    roleEn: "HEAD OF FOREIGN TRADE",
    bio: "منبع‌یابی و مذاکره مستقیم با تأمین‌کنندگان چین، امارات و ترکیه.",
    photo: "/team/member-02.jpg",
    email: "trade@jahangostar.com",
    linkedin: "#",
  },
  {
    code: "03",
    name: "علی رضایی",
    role: "مدیر عملیات لجستیک",
    roleEn: "LOGISTICS OPERATIONS",
    bio: "برنامه‌ریزی حمل چندوجهی دریایی، هوایی و جاده‌ای با رصد لحظه‌ای محموله.",
    photo: "/team/member-03.jpg",
    email: "ops@jahangostar.com",
    linkedin: "#",
  },
  {
    code: "04",
    name: "مریم احمدی",
    role: "مدیر مالی و ارزی",
    roleEn: "FINANCE & FX",
    bio: "مدیریت حوالجات ارزی، گشایش اعتبار اسنادی و تسویه شفاف با تأمین‌کنندگان.",
    photo: "/team/member-04.jpg",
    email: "finance@jahangostar.com",
    phone: "02188000000",
    linkedin: "#",
  },
];

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

// Hover reveal also triggers for keyboard users tabbing into the card's contact links
const REVEAL =
  "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-has-[:focus-visible]:opacity-100 group-has-[:focus-visible]:translate-y-0";

const CONTACT_BUTTON =
  "p-2 rounded-full bg-white/10 hover:bg-white hover:text-brand focus-visible:bg-white focus-visible:text-brand outline-none transition-colors";

function TeamCard({ member }: { member: TeamMember }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [photoFailed, setPhotoFailed] = useState(false);

  const initials = member.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("\u200C");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--rx", `${(0.5 - py) * 8}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 10}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-2xl p-[1.5px] bg-zinc-200/80 dark:bg-zinc-800 transition-[transform,translate,box-shadow] duration-300 ease-out [transform:perspective(1000px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-12px_rgba(30,41,90,0.35)]"
    >
      {/* Brand gradient border revealed on hover */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-brand via-brand-accent to-[#2b9bd6] opacity-0 group-hover:opacity-100 group-has-[:focus-visible]:opacity-100 transition-opacity duration-500" />

      <div className="relative aspect-[4/5] rounded-[calc(1rem_-_1.5px)] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {/* Portrait: graphite-grey at rest, full color on hover */}
        {photoFailed ? (
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 transition-[scale] duration-700 ease-out group-hover:scale-105">
            <span className="text-5xl font-black text-zinc-300 dark:text-zinc-700 group-hover:text-brand-accent transition-colors duration-500">
              {initials}
            </span>
          </div>
        ) : (
          <Image
            src={member.photo}
            alt={`${member.name} — ${member.role}`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            onError={() => setPhotoFailed(true)}
            className="object-cover object-[50%_20%] grayscale contrast-[1.05] transition-[filter,scale] duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.08] group-has-[:focus-visible]:grayscale-0"
          />
        )}

        {/* Cursor-tracking glare */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,50%),rgba(255,255,255,0.22),transparent_45%)]" />

        {/* Member code */}
        <span className="absolute top-3 right-3 tabular-nums text-xs font-bold px-2 py-1 rounded-full bg-white/80 dark:bg-zinc-950/70 backdrop-blur text-zinc-700 dark:text-zinc-300 transition-colors duration-300 group-hover:bg-brand-accent group-hover:text-white">
          {member.code}
        </span>

        {/* Info panel: name always visible, bio and contacts slide up on hover */}
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#0f1530]/95 via-brand/75 to-transparent pt-16 px-4 pb-4 text-white">
          <p className="tabular-nums text-[10px] tracking-widest text-[#9fb9ff]">
            {member.roleEn}
          </p>
          <h3 className="text-base font-black leading-snug mt-0.5">{member.name}</h3>
          <p className="text-xs text-zinc-200">{member.role}</p>

          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] group-has-[:focus-visible]:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
            <div className="overflow-hidden">
              <p className={`text-xs leading-relaxed text-zinc-200/90 pt-2 transition-[opacity,translate] duration-500 delay-75 ${REVEAL}`}>
                {member.bio}
              </p>
              <div className={`flex items-center gap-2 pt-3 transition-[opacity,translate] duration-500 delay-150 ${REVEAL}`}>
                {member.email && (
                  <a href={`mailto:${member.email}`} aria-label={`ایمیل ${member.name}`} className={CONTACT_BUTTON}>
                    <Mail className="w-3.5 h-3.5" strokeWidth={2} />
                  </a>
                )}
                {member.phone && (
                  <a href={`tel:${member.phone}`} aria-label={`تماس با ${member.name}`} className={CONTACT_BUTTON}>
                    <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`لینکدین ${member.name}`}
                    className={CONTACT_BUTTON}
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeamSection() {
  return (
    <section
      id="team"
      className="relative w-full py-16 sm:py-24 bg-white dark:bg-zinc-950 transition-colors duration-300"
      dir="rtl"
    >
      <div className="max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
              تیم ما
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              متخصصان بازرگانی، لجستیک و ترخیص جهان‌گستر؛ تیمی که هر محموله را از مبدأ تا مقصد همراهی می‌کند.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-end text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 px-4 py-2 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <Users className="w-4 h-4 text-brand-accent" strokeWidth={1.75} />
            <span>مدیران ارشد جهان‌گستر</span>
          </div>
        </div>

        {/* Single row of team cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {TEAM.map((member) => (
            <TeamCard key={member.code} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TeamSection;
