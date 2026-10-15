"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor]';

/** Small dot that blooms into a petal over anything interactive. Fine pointers only. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState("");
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 520, damping: 38, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 520, damping: 38, mass: 0.35 });
  const shown = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- feature-detect fine pointer after mount
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!shown.current) {
        shown.current = true;
        sx.jump(e.clientX);
        sy.jump(e.clientY);
      }
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(INTERACTIVE);
      setHover(!!el);
      setLabel(el?.closest<HTMLElement>("[data-cursor-label]")?.dataset.cursorLabel ?? "");
    };
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };
    const dn = () => setDown(true);
    const up = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointerup", up);
    };
  }, [x, y, sx, sy]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed top-0 left-0 z-[120] mix-blend-normal"
    >
      <motion.div
        animate={{
          width: hover ? (label ? 84 : 54) : 12,
          height: hover ? (label ? 84 : 54) : 12,
          rotate: hover ? 45 : 0,
          scale: down ? 0.85 : 1,
          borderRadius: hover ? "0% 100% 0% 100%" : "50% 50% 50% 50%",
          backgroundColor: hover ? "rgba(242,212,206,0.55)" : "rgba(201,139,139,1)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="-translate-x-1/2 -translate-y-1/2 border border-rose/70 backdrop-blur-[1px]"
        style={{ marginLeft: 0, marginTop: 0, position: "absolute", left: 0, top: 0 }}
      />
      {label && hover && (
        <span className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 text-[10px] font-medium tracking-[0.2em] text-burgundy uppercase">
          {label}
        </span>
      )}
    </motion.div>
  );
}
