"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  trailing?: React.ReactNode;
}

/** Editorial underline input with an inline, friendly error. */
export function Field({ label, error, hint, trailing, id, className = "", ...rest }: Props) {
  const fid = id ?? `f-${rest.name}`;
  return (
    <div className={className}>
      <label htmlFor={fid} className="mb-1 block text-[11px] tracking-[0.24em] text-rose uppercase">{label}</label>
      <div className={`relative border-b transition-colors duration-300 focus-within:border-burgundy ${error ? "border-[#b4384f]" : "border-burgundy/25"}`}>
        <input
          id={fid}
          aria-invalid={!!error}
          aria-describedby={error ? `${fid}-err` : hint ? `${fid}-hint` : undefined}
          className="w-full bg-transparent py-3 pr-10 font-serif text-2xl text-burgundy placeholder:text-ink/25 focus:outline-none"
          {...rest}
        />
        {trailing && <div className="absolute top-1/2 right-0 -translate-y-1/2">{trailing}</div>}
      </div>
      <AnimatePresence initial={false}>
        {error ? (
          <motion.p key="e" id={`${fid}-err`} role="alert" initial={{ opacity: 0, height: 0, y: -4 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden pt-2 text-[13px] leading-snug text-[#a22f45]">
            {error}
          </motion.p>
        ) : hint ? (
          <p id={`${fid}-hint`} className="pt-2 text-[13px] text-ink/50">{hint}</p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
