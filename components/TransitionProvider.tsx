"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogoMark } from "./Logo";

type Phase = "idle" | "cover" | "reveal";

/**
 * Soft blush curtain between pages: covers on internal link click, navigates
 * underneath, scrolls to top, then lifts once the new route is in place.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const target = useRef<string | null>(null);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const begin = useCallback(
    (href: string) => {
      target.current = href;
      setPhase("cover");
      window.setTimeout(() => router.push(href), reduce.current ? 0 : 650);
      // Safety: never leave the curtain down.
      window.setTimeout(() => setPhase((p) => (p === "cover" ? "reveal" : p)), 4000);
    },
    [router],
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // same page: hash/anchor handled elsewhere
      if (reduce.current) return; // native Next navigation, no curtain
      e.preventDefault();
      e.stopPropagation(); // keep next/link from navigating on its own
      begin(url.pathname + url.search + url.hash);
    };
    // Capture phase, so we run before next/link's own click handler.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [begin]);

  // New route arrived while covered: jump to top and lift the curtain.
  useEffect(() => {
    if (phase !== "cover") return;
    if (target.current && target.current.split(/[?#]/)[0] === pathname) {
      window.scrollTo(0, 0);
      const t = window.setTimeout(() => setPhase("reveal"), 250);
      return () => window.clearTimeout(t);
    }
  }, [pathname, phase]);

  return (
    <>
      {children}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ y: phase === "cover" ? "0%" : phase === "reveal" ? "-100%" : "100%" }}
        transition={{ duration: phase === "idle" ? 0 : 0.75, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={() => phase === "reveal" && setPhase("idle")}
        className="pointer-events-none fixed inset-0 z-[95] flex items-center justify-center bg-blush"
        style={{ visibility: phase === "idle" ? "hidden" : "visible", borderRadius: "0 0 50% 50% / 0 0 10vh 10vh" }}
      >
        <LogoMark className="h-14 w-14 text-burgundy" strokeWidth={0.9} />
      </motion.div>
    </>
  );
}
