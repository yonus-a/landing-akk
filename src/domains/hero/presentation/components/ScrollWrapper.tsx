"use client";

import React, { forwardRef } from "react";
import styles from "./Hero.module.css";
import { SCENE_SECTION_HEIGHTS } from "../../domain/constants";

export const ScrollWrapper = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className={`${styles.scrollWrapper} scroll-wrapper`}
    >
      {SCENE_SECTION_HEIGHTS.map((height, index) => (
        <section
          key={index}
          className={`${styles.sceneSection} scene-section`}
          style={{ height }}
        />
      ))}
    </div>
  );
});

ScrollWrapper.displayName = "ScrollWrapper";

