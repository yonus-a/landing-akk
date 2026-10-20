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
    pencilGrade,
    setPencilGrade,
    isAutoPlaying,
    toggleAutoPlay,
  } = useHeroScene();

  return (
    <div
      id="hero-container"
      className={`${styles.heroContainer || ""} hero-container`}
      dir="rtl"
      lang="fa"
      style={{
        fontFamily: "'Vazirmatn', sans-serif",
        backgroundColor: "#ffffff",
        color: "#18181b",
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
        direction: "rtl",
      }}
    >
      <LoadingScreen ref={loadingScreenRef} />

      {/* 500x500 Fixed Canvas Stage on Left Side (Zero borders, seamless fade into white background) */}
      <div
        ref={canvasContainerRef}
        id="canvas-container"
        className={`${styles.sketchStage || ""} sketch-stage`}
        style={{
          position: "fixed",
          top: "50%",
          left: "clamp(20px, 5vw, 80px)",
          transform: "translateY(-50%)",
          width: 500,
          height: 500,
          maxWidth: "92vw",
          maxHeight: "92vw",
          aspectRatio: "1 / 1",
          zIndex: 2,
          background: "transparent",
          border: "none",
          outline: "none",
          boxShadow: "none",
          overflow: "visible",
          pointerEvents: "none",
          maskImage: "radial-gradient(circle at center, black 65%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 65%, transparent 100%)",
        }}
      />

      {/* Interactive Graphite Controls Toolbar */}
      <div
        className={`${styles.sketchControls || ""} sketch-controls`}
        style={{
          position: "fixed",
          bottom: 24,
          left: "clamp(20px, 5vw, 80px)",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(39, 39, 42, 0.88)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          padding: "6px 12px",
          borderRadius: 999,
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.18)",
          fontSize: "0.78rem",
          direction: "rtl",
          userSelect: "none",
          pointerEvents: "auto",
        }}
      >
        <button
          className={`ctrl-btn ${isAutoPlaying ? "active" : ""}`}
          onClick={toggleAutoPlay}
          type="button"
          aria-label="پخش خودکار انیمیشن"
        >
          {isAutoPlaying ? "⏸ توقف" : "▶ پخش خودکار"}
        </button>
        <div className="ctrl-divider" />
        <button
          className={`ctrl-btn ${pencilGrade === "HB" ? "active" : ""}`}
          onClick={() => setPencilGrade("HB")}
          type="button"
        >
          مداد HB
        </button>
        <button
          className={`ctrl-btn ${pencilGrade === "2B" ? "active" : ""}`}
          onClick={() => setPencilGrade("2B")}
          type="button"
        >
          مداد 2B
        </button>
        <button
          className={`ctrl-btn ${pencilGrade === "6B" ? "active" : ""}`}
          onClick={() => setPencilGrade("6B")}
          type="button"
        >
          مداد 6B (تیره)
        </button>
      </div>

      <CloudMist ref={cloudMistRef} />
      <SunGlow ref={sunGlowRef} />
      <CinematicOverlay />
      <ScrollPrompt ref={scrollPromptRef} />
      <ScrollWrapper ref={scrollWrapperRef} />
    </div>
  );
}

export default Hero;
