"use client";

import React, { forwardRef } from "react";
import { ThinkingOrb } from "thinking-orbs";
import styles from "./Hero.module.css";

export const LoadingScreen = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      id="loadingScreen"
      className={`${styles.loadingScreen} loading-screen select-none`}
    >
      <ThinkingOrb
        state="searching"
        size={64}
        theme="auto"
        aria-label="در حال بارگذاری..."
      />
    </div>
  );
});

LoadingScreen.displayName = "LoadingScreen";


