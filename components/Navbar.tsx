"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Logo } from "./Logo";
import { useIntro } from "./IntroProvider";
import { useCart } from "./CartProvider";
import { useLockScroll } from "@/lib/scroll-lock";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/#collections", label: "Collections" },
  { href: "/#occasions", label: "Occasions" },
  { href: "/#builder", label: "Build a Bouquet" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const { ready } = useIntro();
  const pathname = usePathname();
  const { count, setOpen: openCart } = useCart();
  const home = pathname === "/";
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setSolid(y > 80);
    setHidden(y > 400 && y > scrollY.getPrevious()!);
  });

  useLockScroll(open);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const isSolid = (solid || !home) && !open;
  const tone = isSolid ? "text-burgundy" : "text-ivory";

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={ready || !home ? { y: hidden && !open ? "-110%" : 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,box-shadow] duration-500 ${tone} ${isSolid ? "bg-ivory/85 shadow-[0_1px_0_rgba(92,26,43,0.08)] backdrop-blur-md" : ""}`}
      >
        <nav aria-label="Primary" className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <Link href="/" aria-label="Halaflora — home" data-cursor="petal" className="block">
            <Logo className="h-9 w-auto sm:h-10" />
          </Link>

          <ul className="hidden items-center gap-6 lg:flex xl:gap-9">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} data-cursor="petal" className="group relative py-1 text-[13px] tracking-[0.16em] uppercase">
                  {l.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-500 ease-bloom group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            <button type="button" onClick={() => openCart(true)} data-cursor="petal" className="group flex items-center gap-2 text-[13px] tracking-[0.16em] uppercase" aria-label={`Open bag, ${count} items`}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
                <path d="M5 8h14l-1 12H6L5 8Z" />
                <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
              </svg>
              <span className="hidden sm:inline">Bag ({count})</span>
            </button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative z-[60] flex h-10 w-10 flex-col items-center justify-center gap-[7px] lg:hidden"
            >
              <span className={`h-px w-7 bg-current transition-transform duration-500 ${open ? "translate-y-[4px] rotate-45" : ""}`} />
              <span className={`h-px w-7 bg-current transition-transform duration-500 ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 3rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[55] flex flex-col justify-center bg-burgundy px-8 text-ivory lg:hidden"
          >
            <ul className="space-y-2">
              {LINKS.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.div initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.25 + i * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                    <Link href={l.href} onClick={() => setOpen(false)} className="block font-serif text-5xl font-light italic leading-[1.15]">
                      {l.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <p className="absolute inset-x-8 bottom-10 font-serif text-lg italic text-blush/80">The Sweetness of Every Bloom</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
