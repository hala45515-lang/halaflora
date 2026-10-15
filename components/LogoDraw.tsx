"use client";

import { motion, useReducedMotion } from "framer-motion";
import { WORDMARK_GLYPHS } from "@/lib/logo-paths";
import { LOCKUP, MARK_PETALS } from "./Logo";

const ease = [0.65, 0, 0.35, 1] as const;

/** The full logo that draws itself stroke by stroke, then fills in. */
export function LogoDraw({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const L = LOCKUP;

  return (
    <svg viewBox={`0 0 ${L.width} ${L.height}`} role="img" aria-label="Halaflora" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <g transform={`translate(0 ${L.markY}) scale(${L.markScale})`} strokeWidth="0.9">
        {MARK_PETALS.map((p, i) => (
          <motion.path
            key={p.angle}
            d={p.d}
            transform={`rotate(${p.angle} 24 24)`}
            initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.1 + i * 0.09, ease }}
          />
        ))}
        <motion.circle
          cx="24"
          cy="24"
          r="1.5"
          initial={{ scale: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ transformOrigin: "24px 24px" }}
          transition={{ duration: 0.6, delay: 1.2, ease }}
        />
      </g>

      <g transform={`translate(${L.textX} ${L.baseline})`}>
        {WORDMARK_GLYPHS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            strokeWidth="0.55"
            initial={{ pathLength: reduce ? 1 : 0, fill: "rgba(92,26,43,0)", opacity: reduce ? 1 : 0 }}
            animate={{ pathLength: 1, fill: "rgba(92,26,43,1)", opacity: 1 }}
            transition={{
              pathLength: { duration: 1.2, delay: 0.5 + i * 0.12, ease },
              opacity: { duration: 0.2, delay: 0.5 + i * 0.12 },
              fill: { duration: 0.8, delay: 1.9 + i * 0.03, ease: "easeOut" },
            }}
          />
        ))}
      </g>
    </svg>
  );
}
