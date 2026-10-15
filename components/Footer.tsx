"use client";

import Link from "next/link";
import { useState } from "react";
import type { FlowerPhoto } from "@/lib/types";
import { Logo } from "./Logo";

const SOCIALS = [
  { name: "Instagram", href: "https://www.instagram.com/", d: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-1.5h.01" },
  { name: "Pinterest", href: "https://www.pinterest.com/", d: "M10 21l2-8M7.5 11.5a4.5 4.5 0 1 1 9 0c0 3-2 5.5-4.5 5.5-1 0-1.800-.5-2-1.300" },
  { name: "Facebook", href: "https://www.facebook.com/", d: "M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8Z" },
  { name: "TikTok", href: "https://www.tiktok.com/", d: "M14 3v11.500a3.500 3.500 0 1 1-3.500-3.500M14 3c.3 2.700 2 4.500 5 4.700" },
];

export function Footer({ credits = [] }: { credits?: FlowerPhoto[] }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const unique = [...new Map(credits.filter((c) => c.credit).map((c) => [c.credit!.name, c])).values()];

  return (
    <footer className="relative overflow-hidden bg-burgundy text-ivory">
      <div className="mx-auto max-w-[1500px] px-5 pt-14 pb-6 sm:px-8 sm:pt-16 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <p className="mb-3 text-[11px] tracking-[0.32em] text-blush uppercase">Join the garden</p>
            <h2 className="max-w-xl font-serif text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.05] font-light">A little sweetness, <span className="text-blush italic">in your inbox.</span></h2>
            <form onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }} className="mt-6 max-w-md" aria-label="Newsletter signup">
              {done ? (
                <p role="status" className="font-serif text-2xl text-blush italic">Thank you. Something sweet is on its way. 🌸</p>
              ) : (
                <div className="flex items-center gap-2 rounded-full border border-ivory/30 p-1.5 pl-6 focus-within:border-ivory">
                  <label htmlFor="newsletter" className="sr-only">Email address</label>
                  <input id="newsletter" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" className="min-w-0 flex-1 bg-transparent text-sm text-ivory placeholder:text-ivory/50 focus:outline-none" />
                  <button type="submit" data-cursor="petal" className="rounded-full bg-ivory px-6 py-3 text-xs font-medium tracking-[0.16em] text-burgundy uppercase transition-colors hover:bg-blush">Subscribe</button>
                </div>
              )}
              <p className="mt-2 text-xs text-ivory/55">Seasonal notes and new collections. Unsubscribe whenever.</p>
            </form>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-8 text-sm sm:grid-cols-[auto_auto_1fr] lg:justify-self-end">
            <div>
              <h3 className="mb-3 text-[11px] tracking-[0.26em] text-blush uppercase">Shop</h3>
              <ul className="space-y-2 text-ivory/80">
                {[["All bouquets", "/shop"], ["Romantic", "/shop?collection=romantic"], ["Wild & Free", "/shop?collection=wild"], ["Minimal", "/shop?collection=minimal"], ["Seasonal", "/shop?collection=seasonal"]].map(([l, h]) => <li key={l}><Link href={h} className="hover:text-ivory hover:underline underline-offset-4">{l}</Link></li>)}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-[11px] tracking-[0.26em] text-blush uppercase">Atelier</h3>
              <ul className="space-y-2 text-ivory/80">
                {[["Our story", "/about"], ["Contact", "/contact"], ["Build a bouquet", "/#builder"], ["Subscriptions", "/#subscription"], ["Language of flowers", "/#language"]].map(([l, h]) => <li key={l}><Link href={h} className="hover:text-ivory hover:underline underline-offset-4">{l}</Link></li>)}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="mb-3 text-[11px] tracking-[0.26em] text-blush uppercase">Follow</h3>
              <ul className="flex flex-wrap gap-2.5">
                {SOCIALS.map((s) => (
                  <li key={s.name}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} data-cursor="petal" className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/30 transition-colors hover:bg-ivory hover:text-burgundy">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={s.d} /></svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-ivory/15 pt-5 text-xs text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4"><Logo className="h-8 w-auto text-blush/90" title="Halaflora" /><p>© Halaflora. The Sweetness of Every Bloom.</p></div>
          <p>Photography via <a href="https://unsplash.com/?utm_source=halaflora&utm_medium=referral" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Unsplash</a></p>
        </div>

        {unique.length > 0 && (
          <details className="mt-3 text-xs text-ivory/50">
            <summary className="cursor-pointer select-none hover:text-ivory/80">Photo credits</summary>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              {unique.map((p) => (
                <li key={p.credit!.name}><a href={p.link ?? p.credit!.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ivory">{p.credit!.name}</a></li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </footer>
  );
}
