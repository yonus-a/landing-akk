"use client";

import React, { memo } from "react";
import styles from "./Hero.module.css";

export const CinematicOverlay = memo(function CinematicOverlay() {
  return (
    <div
      id="cinematic-overlay"
      className={`${styles.cinematicOverlay} cinematic-overlay`}
    />
  );
});

