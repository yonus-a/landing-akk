"use client";

import React, { forwardRef } from "react";
import styles from "./Hero.module.css";

export const CloudMist = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      id="cloud-mist"
      className={`${styles.cloudMist} cloud-mist`}
    />
  );
});

CloudMist.displayName = "CloudMist";

