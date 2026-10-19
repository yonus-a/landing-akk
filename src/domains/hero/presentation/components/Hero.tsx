"use client";

import React from "react";
import styles from "./Hero.module.css";
import { useHeroScene } from "../../application/hooks/useHeroScene";
import { LoadingScreen } from "./LoadingScreen";
import { CloudMist } from "./CloudMist";
import { SunGlow } from "./SunGlow";
import { CinematicOverlay } from "./CinematicOverlay";
import { ScrollPrompt } from "./ScrollPrompt";
import { ScrollWrapper } from "./ScrollWrapper";

export function Hero() {
  const {
    canvasContainerRef,
    sunGlowRef,
    cloudMistRef,
    scrollPromptRef,
    loadingScreenRef,
    scrollWrapperRef,
  } = useHeroScene();

  return (
    <div className={styles.heroContainer} dir="rtl" lang="fa">
      <LoadingScreen ref={loadingScreenRef} />
      <div ref={canvasContainerRef} id="canvas-container" />
      <CloudMist ref={cloudMistRef} />
      <SunGlow ref={sunGlowRef} />
      <CinematicOverlay />
      <ScrollPrompt ref={scrollPromptRef} />
      <ScrollWrapper ref={scrollWrapperRef} />
    </div>
  );
}

export default Hero;
