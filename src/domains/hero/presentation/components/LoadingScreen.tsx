"use client";

import React, { forwardRef } from "react";
import { SiteLoader } from "@/components/SiteLoader";

export const LoadingScreen = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      id="loadingScreen"
      role="status"
      aria-live="polite"
      className="loading-screen fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-6 bg-white dark:bg-zinc-950 transition-[opacity,visibility] duration-600 ease-out select-none"
    >
      <SiteLoader />
    </div>
  );
});

LoadingScreen.displayName = "LoadingScreen";
