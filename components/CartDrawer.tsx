"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { money, useCart } from "./CartProvider";
import { useLockScroll } from "@/lib/scroll-lock";
import { LogoMark } from "./Logo";
import Image from "next/image";

const FREE_SHIPPING = 100;

export function CartDrawer() {
  const { open, setOpen, items, subtotal, setQty, remove, count } = useCart();
  const panel = useRef<HTMLDivElement>(null);
  useLockScroll(open);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("keydown", key); prev?.focus?.(); };
  }, [open, setOpen]);

  const remaining = Math.max(0, FREE_SHIPPING - subtotal);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110]">
          <motion.button
            type="button"
            aria-label="Close bag"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-wine/50 backdrop-blur-[2px]"
          />
          <motion.aside
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Your bag"
            tabIndex={-1}
            data-lenis-prevent
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-0 right-0 flex h-full w-full max-w-[460px] flex-col bg-ivory text-ink shadow-2xl outline-none"
          >
            <header className="flex items-center justify-between border-b border-burgundy/10 px-6 py-5">
              <h2 className="font-serif text-3xl font-light text-burgundy">Your bag <span className="text-rose italic">({count})</span></h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close bag" className="flex h-10 w-10 items-center justify-center rounded-full border border-burgundy/20 text-burgundy transition-colors hover:bg-burgundy hover:text-ivory">
                <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="currentColor" strokeWidth="1.2" fill="none" aria-hidden="true"><path d="M2 2l12 12M14 2L2 14" /></svg>
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <LogoMark className="h-16 w-16 text-rose" strokeWidth={0.7} />
                <p className="font-serif text-3xl font-light text-burgundy italic">Your bag is empty, for now.</p>
                <p className="max-w-xs text-sm text-ink/70">Something sweet is waiting for you in the shop.</p>
                <Link href="/shop" onClick={() => setOpen(false)} className="rounded-full bg-burgundy px-8 py-3.5 text-sm tracking-[0.14em] text-ivory uppercase transition-colors hover:bg-wine">Browse bouquets</Link>
              </div>
            ) : (
              <>
                <div className="border-b border-burgundy/10 px-6 py-4 text-sm">
                  <p className="mb-2 text-ink/75">{remaining > 0 ? <>You&apos;re <strong className="text-burgundy">{money(remaining)}</strong> away from free delivery</> : "You've unlocked free delivery 🌸"}</p>
                  <div className="h-1 overflow-hidden rounded-full bg-blush/60"><motion.div className="h-full bg-rose" animate={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING) * 100)}%` }} /></div>
                </div>
                <ul className="flex-1 divide-y divide-burgundy/10 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {items.map((i) => (
                      <motion.li key={i.id} layout exit={{ opacity: 0, height: 0 }} className="flex gap-4 py-5">
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-t-full bg-blush">
                          {i.image && !i.image.placeholder ? (
                            <Image src={i.image.src} alt={i.image.alt} fill sizes="80px" className="object-cover" placeholder={i.image.blurDataURL ? "blur" : "empty"} blurDataURL={i.image.blurDataURL || undefined} />
                          ) : (
                            <LogoMark className="absolute inset-0 m-auto h-10 w-10 text-burgundy/60" strokeWidth={0.8} />
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-serif text-xl leading-tight text-burgundy">{i.href ? <Link href={i.href} onClick={() => setOpen(false)}>{i.name}</Link> : i.name}</h3>
                            <span className="text-sm">{money(i.price * i.qty)}</span>
                          </div>
                          {i.detail && <p className="mt-1 text-xs leading-relaxed text-ink/60">{i.detail}</p>}
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center rounded-full border border-burgundy/20 text-burgundy">
                              <button type="button" aria-label={`Decrease quantity of ${i.name}`} onClick={() => setQty(i.id, i.qty - 1)} className="h-8 w-8 text-lg leading-none">−</button>
                              <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">{i.qty}</span>
                              <button type="button" aria-label={`Increase quantity of ${i.name}`} onClick={() => setQty(i.id, i.qty + 1)} className="h-8 w-8 text-lg leading-none">+</button>
                            </div>
                            <button type="button" onClick={() => remove(i.id)} className="text-xs tracking-wider text-ink/55 uppercase underline underline-offset-4 hover:text-burgundy">Remove</button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <footer className="border-t border-burgundy/10 bg-cream/60 px-6 py-6">
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-sm tracking-[0.14em] text-ink/70 uppercase">Subtotal</span>
                    <span className="font-serif text-3xl text-burgundy">{money(subtotal)}</span>
                  </div>
                  <p className="mb-5 text-xs text-ink/55">Delivery and gift notes are added at checkout.</p>
                  <Link href="/checkout" onClick={() => setOpen(false)} data-cursor="petal" className="block w-full rounded-full bg-burgundy py-4 text-center text-sm tracking-[0.16em] text-ivory uppercase transition-colors hover:bg-wine">Checkout</Link>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
