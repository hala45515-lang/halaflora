"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

let lenis: Lenis | null = null;
let locks = 0;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
  if (instance && locks > 0) instance.stop();
}

export function getLenis() {
  return lenis;
}

/** Reference-counted page scroll lock (works with Lenis). */
export function useLockScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;
    locks++;
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      locks--;
      if (locks === 0) {
        document.documentElement.style.overflow = "";
        lenis?.start();
      }
    };
  }, [active]);
}
