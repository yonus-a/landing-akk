"use client";

import React, { forwardRef } from "react";
import styles from "./Hero.module.css";

export const LoadingScreen = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      id="loadingScreen"
      className={`${styles.loadingScreen} loading-screen`}
    >
      <div className={`${styles.spinner} spinner`} />
    </div>
  );
});

LoadingScreen.displayName = "LoadingScreen";

