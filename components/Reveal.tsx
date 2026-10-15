"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/** Fades and slides children up as they enter the viewport. */
export function Reveal({ children, delay = 0, y = 36, className = "", as = "div" }: { children: ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "p" | "li" | "h2" | "h3" }) {
  const reduce = useReducedMotion();
  const M = motion[as] as typeof motion.div;
  return (
    <M
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, ease, delay }}
      className={className}
    >
      {children}
    </M>
  );
}

/** Headline whose words rise out of a mask when scrolled into view. */
export function WordReveal({ text, className = "", italic = [] }: { text: string; className?: string; italic?: string[] }) {
  const reduce = useReducedMotion();
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((w, i) => (
          <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              className={`inline-block ${italic.includes(w.replace(/[.,]/g, "")) ? "italic" : ""}`}
              initial={reduce ? false : { y: "112%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1.1, ease, delay: i * 0.07 }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </span>
    </span>
  );
}

/** Unmasks its content with a clip-path as it scrolls in, with an inner parallax drift. */
export function Unmask({ children, className = "", parallax = 40, direction = "up" }: { children: ReactNode; className?: string; parallax?: number; direction?: "up" | "left" }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -parallax, reduce ? 0 : parallax]);
  const from = direction === "up" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { clipPath: from }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.4, ease }}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div style={{ y, scale: 1 + parallax / 400 }} className="absolute inset-0">
        {children}
      </motion.div>
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, italic, className = "", light = false }: { eyebrow: string; title: string; italic?: string[]; className?: string; light?: boolean }) {
  return (
    <div className={className}>
      <Reveal y={16}>
        <p className={`mb-5 flex items-center gap-4 text-[11px] tracking-[0.32em] uppercase sm:text-xs ${light ? "text-blush" : "text-rose"}`}>
          <span className="h-px w-10 bg-current opacity-70" />
          {eyebrow}
        </p>
      </Reveal>
      <h2 className={`font-serif text-[clamp(2.8rem,7.5vw,6.5rem)] leading-[0.95] font-light tracking-[-0.02em] ${light ? "text-ivory" : "text-burgundy"}`}>
        <WordReveal text={title} italic={italic} />
      </h2>
    </div>
  );
}
