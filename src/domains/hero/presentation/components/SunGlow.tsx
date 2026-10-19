"use client";

import React, { forwardRef } from "react";
import styles from "./Hero.module.css";

export const SunGlow = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      id="sun-glow"
      className={`${styles.sunGlow} sun-glow`}
    />
  );
});

SunGlow.displayName = "SunGlow";

