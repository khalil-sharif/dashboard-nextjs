"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/uiStore";

/** Applies the persisted dark-mode preference to the <html> element. */
export default function ThemeSync() {
  const darkMode = useUIStore((s) => s.darkMode);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return null;
}
