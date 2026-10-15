"use client";

import Link from "next/link";
import type { FlowerPhoto } from "@/lib/types";
import type { Product } from "@/lib/products";
import { money, useCart } from "./CartProvider";
import { Photo } from "./Photo";

export interface ProductWithPhotos extends Product {
  photos: FlowerPhoto[];
}

export function cartItemFor(p: ProductWithPhotos) {
  const img = p.photos[0];
  return { id: p.slug, name: p.name, price: p.price, href: `/shop/${p.slug}`, image: { src: img.src, alt: img.alt, blurDataURL: img.blurDataURL, placeholder: img.placeholder, tone: img.tone } };
}

export function ProductCard({ product, onQuickView, priority }: { product: ProductWithPhotos; onQuickView?: (p: ProductWithPhotos) => void; priority?: boolean }) {
  const { add } = useCart();
  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-2xl bg-blush">
        <Photo photo={product.photos[0]} sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 24vw" seed={product.slug.length} priority={priority} imgClassName="transition-[transform,filter] duration-[1400ms] ease-bloom group-hover:scale-[1.07] group-hover:saturate-[1.2] group-hover:hue-rotate-[-8deg]" />
        {product.bestseller && <span className="absolute top-[18%] left-3 z-10 rounded-full bg-ivory/90 px-3 py-1 text-[10px] tracking-[0.2em] text-burgundy uppercase backdrop-blur">Bestseller</span>}
        <div className="absolute inset-x-3 bottom-10 z-30 flex gap-2 transition-all duration-500 md:translate-y-3 md:opacity-0 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          {onQuickView && (
            <button type="button" onClick={() => onQuickView(product)} aria-label={`Quick view ${product.name}`} className="flex-1 rounded-full bg-ivory/95 py-3 text-[11px] font-medium tracking-[0.16em] text-burgundy uppercase backdrop-blur transition-colors hover:bg-ivory">Quick view</button>
          )}
          <button type="button" onClick={() => add(cartItemFor(product))} aria-label={`Add ${product.name} to bag`} className="flex-1 rounded-full bg-burgundy py-3 text-[11px] font-medium tracking-[0.16em] text-ivory uppercase transition-colors hover:bg-wine">Add to bag</button>
        </div>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4 px-1">
        <div>
          <h3 className="font-serif text-2xl leading-tight text-burgundy sm:text-[1.7rem]">
            <Link href={`/shop/${product.slug}`} data-cursor="petal" className="after:absolute after:inset-0 after:z-10">{product.name}</Link>
          </h3>
          <p className="mt-1 text-sm text-ink/60">{product.tagline}</p>
        </div>
        <p className="pt-1 font-serif text-xl text-burgundy">{money(product.price)}</p>
      </div>
    </article>
  );
}
