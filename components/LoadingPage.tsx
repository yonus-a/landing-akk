import React from "react";
import { SiteLoader } from "@/components/SiteLoader";

export function LoadingPage() {
  return (
    <div
      id="globalLoadingPage"
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-6 bg-white dark:bg-zinc-950 transition-colors duration-300 select-none pointer-events-auto"
    >
      <SiteLoader />
    </div>
  );
}

export default LoadingPage;
