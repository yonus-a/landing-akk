"use client";

import React, { forwardRef } from "react";
import styles from "./Hero.module.css";

export const ScrollPrompt = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      id="scrollPrompt"
      className={`${styles.scrollPrompt} scroll-prompt`}
    >
      <span>Scroll</span>
      <div className={`${styles.scrollLine} scroll-line`} />
    </div>
  );
});

ScrollPrompt.displayName = "ScrollPrompt";

