"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    const onThemeChange = () => {
      const darkNow = document.documentElement.classList.contains("dark");
      setTheme(darkNow ? "dark" : "light");
    };

    window.addEventListener("themechange", onThemeChange);
    return () => window.removeEventListener("themechange", onThemeChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: newTheme } }));
  };

  if (!mounted) {
    return (
      <div className={`w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 ${className}`} />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center ${
        theme === "dark"
          ? "bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-zinc-700"
          : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200/80"
      } ${className}`}
      aria-label={theme === "dark" ? "تغییر به حالت روشن" : "تغییر به حالت تاریک"}
      title={theme === "dark" ? "حالت روز" : "حالت شب"}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 transition-transform duration-300 hover:rotate-45" strokeWidth={2} />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12" strokeWidth={2} />
      )}
    </button>
  );
}

export default ThemeToggle;

