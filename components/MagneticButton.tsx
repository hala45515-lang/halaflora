"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

interface Props {
  href: string;
  children: ReactNode;
  variant?: "cream" | "burgundy" | "ghost" | "outline";
  className?: string;
}

const styles = {
  cream: "bg-ivory text-burgundy border-ivory",
  burgundy: "bg-burgundy text-ivory border-burgundy",
  ghost: "bg-transparent text-ivory border-ivory/50",
  outline: "bg-transparent text-burgundy border-burgundy/40",
} as const;

const fills = {
  cream: "bg-blush",
  burgundy: "bg-rose",
  ghost: "bg-ivory",
  outline: "bg-burgundy",
} as const;

const hoverText = {
  cream: "group-hover:text-burgundy",
  burgundy: "group-hover:text-wine",
  ghost: "group-hover:text-burgundy",
  outline: "group-hover:text-ivory",
} as const;

/** Pill link that leans toward the cursor and floods with colour on hover. */
export function MagneticButton({ href, children, variant = "cream", className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div ref={ref} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset} className="inline-block">
      <Link
        href={href}
        data-cursor="petal"
        className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full border px-8 py-4 text-sm font-medium tracking-[0.14em] uppercase transition-colors duration-500 ${styles[variant]} ${hoverText[variant]} ${className}`}
      >
        <span aria-hidden="true" className={`absolute inset-0 origin-bottom scale-y-0 rounded-[50%] transition-transform duration-700 ease-bloom group-hover:scale-y-[1.6] ${fills[variant]}`} />
        <span className="relative">{children}</span>
        <svg className="relative h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <path d="M1 8h13M9 3l5 5-5 5" />
        </svg>
      </Link>
    </motion.div>
  );
}
