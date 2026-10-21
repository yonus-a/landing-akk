"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScroll() {
  useEffect(() => {
    // 1. Initialize Lenis smooth scroll engine
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      infinite: false,
    });

    window.__lenis = lenis;

    // 2. Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // 3. Connect Lenis frame updates directly to GSAP Ticker for 60/120Hz sync
    const tickerUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerUpdate);

    // 4. Disable lagSmoothing to prevent any frame drops or hitching between WebGL & scrolling
    gsap.ticker.lagSmoothing(0);

    // 5. Intercept anchor links for smooth, cinematic gliding
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href || href === "#") return;

      const destination = document.querySelector(href);
      if (destination) {
        e.preventDefault();
        lenis.scrollTo(destination as HTMLElement, {
          offset: -20,
          duration: 1.2,
        });
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(tickerUpdate);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}

export default SmoothScroll;

