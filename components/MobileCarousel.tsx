"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface MobileCarouselProps {
  children: React.ReactNode;
  /** Accessible name for the carousel region. */
  label: string;
  /** Visibility classes, e.g. "sm:hidden"; the grid layout takes over above that breakpoint. */
  className?: string;
}

export function MobileCarousel({ children, label, className = "" }: MobileCarouselProps) {
  const slides = React.Children.toArray(children);

  return (
    <div className={`mobile-carousel -mx-4 sm:-mx-6 ${className}`} role="region" aria-label={label}>
      <Swiper
        dir="rtl"
        modules={[Pagination, A11y]}
        slidesPerView={1.12}
        spaceBetween={14}
        breakpoints={{ 480: { slidesPerView: 1.5, spaceBetween: 16 } }}
        grabCursor
        pagination={{ clickable: true }}
        a11y={{
          prevSlideMessage: "اسلاید قبلی",
          nextSlideMessage: "اسلاید بعدی",
          paginationBulletMessage: "رفتن به اسلاید {{index}}",
        }}
        className="px-4! sm:px-6! pt-2! pb-12!"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={(React.isValidElement(slide) && slide.key) || i} className="h-auto!">
            {slide}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default MobileCarousel;
