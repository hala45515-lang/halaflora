"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { ProductCard, type ProductWithPhotos } from "../ProductCard";
import { QuickView } from "../QuickView";
import { Reveal, SectionHeading } from "../Reveal";

export function Bestsellers({ products }: { products: ProductWithPhotos[] }) {
  const [active, setActive] = useState<ProductWithPhotos | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    <section id="bestsellers" aria-labelledby="best-title" className="bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div id="best-title"><SectionHeading eyebrow="Bestsellers" title="The ones everyone asks for." italic={["asks"]} /></div>
          <Reveal delay={0.2}><Link href="/shop" data-cursor="petal" className="inline-flex items-center gap-3 border-b border-burgundy pb-1 text-sm tracking-[0.16em] text-burgundy uppercase">View all bouquets →</Link></Reveal>
        </div>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <li key={p.slug} className={i % 2 ? "lg:mt-14" : ""}>
              <Reveal delay={(i % 4) * 0.08} y={50}><ProductCard product={p} onQuickView={setActive} /></Reveal>
            </li>
          ))}
        </ul>
      </div>
      <QuickView product={active} onClose={close} />
    </section>
  );
}
