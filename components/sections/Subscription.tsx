"use client";

import { useState } from "react";
import type { FlowerPhoto } from "@/lib/types";
import { Photo } from "../Photo";
import { money, useCart } from "../CartProvider";
import { Reveal, SectionHeading } from "../Reveal";

const SIZES = [
  { id: "petite", label: "Petite", mult: 1, note: "A small posy, about 12 stems" },
  { id: "classic", label: "Classic", mult: 1.45, note: "Our signature, about 20 stems" },
  { id: "grand", label: "Grand", mult: 2, note: "A generous armful, 30+ stems" },
] as const;

const PLANS = [
  { id: "weekly", name: "Weekly", every: "every week", base: 34, perks: ["Fresh flowers every week", "Chosen by our florist", "Free delivery", "Skip or pause anytime"] },
  { id: "fortnightly", name: "Fortnightly", every: "every 2 weeks", base: 38, featured: true, perks: ["A new bouquet every other week", "Seasonal, designer's choice", "Free delivery", "Skip or pause anytime", "A free vase after 3 months"] },
  { id: "monthly", name: "Monthly", every: "every month", base: 44, perks: ["One beautiful monthly bouquet", "Seasonal colour palette", "Free delivery", "Skip or pause anytime"] },
] as const;

export function Subscription({ photo }: { photo: FlowerPhoto }) {
  const { add } = useCart();
  const [size, setSize] = useState<(typeof SIZES)[number]["id"]>("classic");
  const s = SIZES.find((x) => x.id === size)!;

  return (
    <section id="subscription" aria-labelledby="sub-title" className="relative overflow-hidden bg-wine py-24 text-ivory sm:py-32">
      <div aria-hidden="true" className="absolute inset-0 opacity-25">
        <div className="group absolute inset-0"><Photo photo={photo} sizes="100vw" seed={21} credit={false} /></div>
        <div className="absolute inset-0 bg-wine/80" />
      </div>
      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div id="sub-title"><SectionHeading light eyebrow="Flower subscription" title="Fresh flowers, on repeat." italic={["on", "repeat."]} /></div>
          <Reveal delay={0.2}>
            <fieldset className="md:text-right">
              <legend className="mb-3 text-[11px] tracking-[0.26em] text-blush uppercase">Bouquet size</legend>
              <div className="inline-flex rounded-full border border-ivory/25 p-1">
                {SIZES.map((x) => (
                  <label key={x.id} className="cursor-pointer">
                    <input type="radio" name="sub-size" value={x.id} checked={size === x.id} onChange={() => setSize(x.id)} className="peer sr-only" />
                    <span className="block rounded-full px-5 py-2.5 text-sm transition-colors peer-checked:bg-ivory peer-checked:text-burgundy peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-blush">{x.label}</span>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-sm text-ivory/70" aria-live="polite">{s.note}</p>
            </fieldset>
          </Reveal>
        </div>

        <ul className="grid gap-5 lg:grid-cols-3">
          {PLANS.map((p, i) => {
            const price = Math.round(p.base * s.mult);
            return (
              <li key={p.id} className={`${"featured" in p ? "lg:-translate-y-6" : ""}`}>
                <Reveal delay={i * 0.1} y={50} className="h-full">
                  <div className={`flex h-full flex-col rounded-[2rem] p-8 sm:p-10 ${"featured" in p ? "bg-ivory text-ink" : "border border-ivory/20 bg-ivory/5 backdrop-blur-sm"}`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`font-serif text-4xl font-light italic ${"featured" in p ? "text-burgundy" : "text-blush"}`}>{p.name}</h3>
                      {"featured" in p && <span className="rounded-full bg-burgundy px-3 py-1 text-[10px] tracking-[0.2em] text-ivory uppercase">Most loved</span>}
                    </div>
                    <p className="mt-6 flex items-baseline gap-2">
                      <span className={`font-serif text-6xl leading-none ${"featured" in p ? "text-burgundy" : ""}`}>{money(price)}</span>
                      <span className={`text-sm ${"featured" in p ? "text-ink/60" : "text-ivory/70"}`}>{p.every}</span>
                    </p>
                    <ul className={`mt-8 mb-10 space-y-3 text-[15px] ${"featured" in p ? "text-ink/75" : "text-ivory/80"}`}>
                      {p.perks.map((perk) => (
                        <li key={perk} className="flex gap-3"><svg viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-rose" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" /></svg>{perk}</li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      data-cursor="petal"
                      onClick={() => add({ id: `sub-${p.id}-${size}`, name: `${p.name} flower subscription`, price, detail: `${s.label} · delivered ${p.every}` })}
                      className={`mt-auto rounded-full py-4 text-sm font-medium tracking-[0.16em] uppercase transition-colors ${"featured" in p ? "bg-burgundy text-ivory hover:bg-wine" : "bg-ivory text-burgundy hover:bg-blush"}`}
                    >
                      Start {p.name.toLowerCase()}
                    </button>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <p className="mt-10 text-center text-sm text-ivory/60">Pause, skip or cancel any time. Your first delivery arrives within a few days.</p>
      </div>
    </section>
  );
}
