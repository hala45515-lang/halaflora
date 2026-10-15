"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { money, useCart } from "./CartProvider";
import { cartItemFor, ProductCard, type ProductWithPhotos } from "./ProductCard";
import { Photo } from "./Photo";
import { PhotoCredit } from "./PhotoCredit";
import { FlowerIcon } from "./FlowerArt";
import { OCCASIONS } from "@/lib/products";

const SIZE = [{ id: "standard", label: "Standard", add: 0 }, { id: "deluxe", label: "Deluxe (+50% stems)", add: 0.5 }] as const;

export function ProductDetail({ product, related }: { product: ProductWithPhotos; related: ProductWithPhotos[] }) {
  const { add } = useCart();
  const [size, setSize] = useState<(typeof SIZE)[number]["id"]>("standard");
  const [qty, setQty] = useState(1);
  const [view, setView] = useState(0);
  const s = SIZE.find((x) => x.id === size)!;
  const price = Math.round(product.price * (1 + s.add));
  const photo = product.photos[view];

  return (
    <div className="mx-auto max-w-[1500px] px-5 pb-28 sm:px-8 lg:px-12">
      <nav aria-label="Breadcrumb" className="mb-8 text-xs tracking-[0.16em] text-ink/55 uppercase">
        <Link href="/shop" className="hover:text-burgundy">Shop</Link> <span className="mx-2 text-rose">/</span> <span className="text-burgundy">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div className="grid gap-4 sm:grid-cols-[80px_1fr]">
          <ul className="order-2 flex gap-3 sm:order-1 sm:flex-col">
            {product.photos.map((p, i) => (
              <li key={p.id + i}>
                <button type="button" onClick={() => setView(i)} aria-label={`Show photo ${i + 1}`} aria-pressed={view === i} className={`relative block h-20 w-16 overflow-hidden rounded-t-full ring-offset-2 ring-offset-ivory transition ${view === i ? "ring-2 ring-burgundy" : "opacity-70 hover:opacity-100"}`}>
                  <Photo photo={p} sizes="64px" seed={i} credit={false} />
                </button>
              </li>
            ))}
          </ul>
          <div className="order-1 sm:order-2">
            <motion.div key={view} initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="group relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-blush">
              <Photo photo={photo} sizes="(max-width: 1024px) 100vw, 55vw" priority seed={view + 4} credit={false} />
            </motion.div>
            <PhotoCredit photo={photo} className="mt-3 text-ink/55" />
          </div>
        </div>

        <div className="lg:pt-6">
          <p className="mb-4 text-[11px] tracking-[0.3em] text-rose uppercase">{product.tagline}</p>
          <h1 className="font-serif text-[clamp(3rem,6vw,5.5rem)] leading-[0.95] font-light text-burgundy">{product.name}</h1>
          <p className="mt-5 font-serif text-4xl text-burgundy">{money(price)}</p>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/75">{product.description}</p>

          <div className="mt-8 flex flex-wrap gap-2">
            {product.occasions.map((o) => <Link key={o} href={`/shop?occasion=${o}`} className="rounded-full border border-burgundy/20 px-4 py-1.5 text-xs tracking-[0.14em] text-burgundy uppercase transition-colors hover:bg-burgundy hover:text-ivory">{OCCASIONS.find((x) => x.id === o)!.label}</Link>)}
          </div>

          <fieldset className="mt-10">
            <legend className="mb-3 text-[11px] tracking-[0.26em] text-rose uppercase">Size</legend>
            <div className="flex flex-wrap gap-3">
              {SIZE.map((x) => (
                <label key={x.id} className="cursor-pointer">
                  <input type="radio" name="size" checked={size === x.id} onChange={() => setSize(x.id)} className="peer sr-only" />
                  <span className="block rounded-full border border-burgundy/20 px-5 py-2.5 text-sm transition-colors peer-checked:border-burgundy peer-checked:bg-burgundy peer-checked:text-ivory peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rose">{x.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-burgundy/25 text-burgundy">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-12 w-12 text-xl leading-none">−</button>
              <span className="w-8 text-center tabular-nums" aria-live="polite">{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))} className="h-12 w-12 text-xl leading-none">+</button>
            </div>
            <button type="button" data-cursor="petal" onClick={() => add({ ...cartItemFor(product), id: `${product.slug}-${size}`, price, detail: s.add ? "Deluxe size" : undefined }, qty)} className="flex-1 rounded-full bg-burgundy px-8 py-4 text-sm font-medium tracking-[0.16em] text-ivory uppercase transition-colors hover:bg-wine sm:flex-none sm:px-14">Add to bag · {money(price * qty)}</button>
          </div>

          <div className="mt-12 border-t border-burgundy/10 pt-8">
            <h2 className="mb-4 font-serif text-2xl text-burgundy">What&apos;s inside</h2>
            <ul className="space-y-2 text-[15px] text-ink/75">
              {product.includes.map((i) => <li key={i} className="flex gap-3"><span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-rose" />{i}</li>)}
            </ul>
            <p className="mt-6 flex items-center gap-3 text-sm text-ink/60"><FlowerIcon kind="rose" colors={["#e59aa4", "#c4687a", "#f4c8cb"]} className="h-8 w-8" />Hand-tied to order, with a handwritten card on request.</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-28">
          <h2 id="related" className="mb-10 font-serif text-4xl font-light text-burgundy sm:text-5xl">You might also love <span className="italic text-rose">these.</span></h2>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <li key={p.slug}><ProductCard product={p} /></li>)}
          </ul>
        </section>
      )}
    </div>
  );
}
