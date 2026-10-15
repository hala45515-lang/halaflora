"use client";

import { motion } from "framer-motion";

const STEPS = ["Delivery", "Message", "Payment", "Confirmation"];

export function StepIndicator({ step, onJump }: { step: number; onJump: (n: number) => void }) {
  return (
    <nav aria-label="Checkout progress">
      <ol className="relative flex items-start justify-between">
        {/* track */}
        <div aria-hidden="true" className="absolute top-[18px] right-[12%] left-[12%] h-px bg-burgundy/15">
          <motion.div className="h-px origin-left bg-burgundy" initial={false} animate={{ scaleX: step / (STEPS.length - 1) }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
        </div>
        {STEPS.map((label, i) => {
          const done = i < step, active = i === step;
          const clickable = done && step < 3;
          return (
            <li key={label} className="relative z-10 flex w-1/4 flex-col items-center gap-2 text-center" aria-current={active ? "step" : undefined}>
              <button type="button" disabled={!clickable} onClick={() => onJump(i)} aria-label={`${i + 1}. ${label}${done ? " (completed)" : ""}`} className="rounded-full disabled:cursor-default">
                <motion.span
                  initial={false}
                  animate={{ backgroundColor: done || active ? "#5c1a2b" : "#faf5ec", color: done || active ? "#faf5ec" : "#5c1a2b", scale: active ? 1.12 : 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-burgundy/30 font-serif text-lg"
                >
                  {done ? (
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><motion.path d="M3 8.5l3.2 3L13 4.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} /></svg>
                  ) : (
                    i + 1
                  )}
                </motion.span>
              </button>
              <span className={`text-[10px] tracking-[0.18em] uppercase transition-colors duration-500 sm:text-xs ${active ? "text-burgundy" : done ? "text-burgundy/70" : "text-ink/40"}`}>{label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
