"use client";

import React from "react";
import { ThinkingOrb, type OrbState } from "thinking-orbs";

interface LoadingPageProps {
  /** Optional state override for the orb (default: 'searching') */
  orbState?: OrbState;
}

export function LoadingPage({ orbState = "searching" }: LoadingPageProps) {
  return (
    <div
      id="globalLoadingPage"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-white dark:bg-zinc-950 transition-colors duration-300 select-none pointer-events-auto"
    >
      <ThinkingOrb
        state={orbState}
        size={64}
        theme="auto"
        color="#2a5ae0"
        aria-label="در حال بارگذاری..."
      />
    </div>
  );
}

export default LoadingPage;
