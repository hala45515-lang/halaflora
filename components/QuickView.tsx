"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { money, useCart } from "./CartProvider";
import { cartItemFor, type ProductWithPhotos } from "./ProductCard";
import { Photo } from "./Photo";
import { useLockScroll } from "@/lib/scroll-lock";

export function QuickView({ product, onClose }: { product: ProductWithPhotos | null; onClose: () => void }) {
  const { add, setOpen } = useCart();
  const panel = useRef<HTMLDivElement>(null);
  useLockScroll(!!product);

  useEffect(() => {
    if (!product) return;
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("keydown", key); prev?.focus?.(); };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[105] flex items-end justify-center sm:items-center sm:p-6">
          <motion.button type="button" aria-label="Close quick view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-wine/55 backdrop-blur-sm" />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name}, quick view`}
            tabIndex={-1}
            data-lenis-prevent
            initial={{ y: 60, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-t-[2rem] bg-ivory shadow-2xl outline-none sm:rounded-[2rem] md:grid-cols-2"
          >
            <div className="group relative aspect-[4/4] md:aspect-auto md:min-h-[520px]">
              <Photo photo={product.photos[0]} sizes="(max-width: 768px) 100vw, 450px" seed={3} />
            </div>
            <div className="flex flex-col p-7 sm:p-10">
              <button type="button" onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/90 text-burgundy shadow transition-colors hover:bg-burgundy hover:text-ivory">
                <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="currentColor" strokeWidth="1.2" fill="none" aria-hidden="true"><path d="M2 2l12 12M14 2L2 14" /></svg>
              </button>
              <p className="mb-3 text-[11px] tracking-[0.3em] text-rose uppercase">{product.tagline}</p>
              <h3 className="font-serif text-5xl leading-none font-light text-burgundy">{product.name}</h3>
              <p className="mt-4 font-serif text-3xl text-burgundy">{money(product.price)}</p>
              <p className="mt-5 text-[15px] leading-relaxed text-ink/75">{product.description}</p>
              <ul className="mt-5 space-y-1.5 text-sm text-ink/70">
                {product.includes.map((i) => <li key={i} className="flex gap-3"><span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rose" />{i}</li>)}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-auto md:pt-8">
                <button type="button" onClick={() => { add(cartItemFor(product)); onClose(); setOpen(true); }} className="flex-1 rounded-full bg-burgundy py-4 text-sm tracking-[0.16em] text-ivory uppercase transition-colors hover:bg-wine">Add to bag</button>
                <Link href={`/shop/${product.slug}`} onClick={onClose} className="flex-1 rounded-full border border-burgundy/30 py-4 text-center text-sm tracking-[0.16em] text-burgundy uppercase transition-colors hover:bg-burgundy hover:text-ivory">Full details</Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
