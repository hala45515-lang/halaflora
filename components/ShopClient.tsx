"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { COLORS, COLLECTIONS, FLOWER_TYPES, OCCASIONS, type ColorName, type Collection, type FlowerType, type Occasion } from "@/lib/products";
import { ProductCard, type ProductWithPhotos } from "./ProductCard";
import { QuickView } from "./QuickView";
import { WordReveal, Reveal } from "./Reveal";
import { useLockScroll } from "@/lib/scroll-lock";

const PRICES = [
  { id: "u60", label: "Under $60", test: (n: number) => n < 60 },
  { id: "60-90", label: "$60 – $90", test: (n: number) => n >= 60 && n <= 90 },
  { id: "90+", label: "Over $90", test: (n: number) => n > 90 },
] as const;

function Chip({ active, onClick, children, swatch }: { active: boolean; onClick: () => void; children: React.ReactNode; swatch?: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${active ? "border-burgundy bg-burgundy text-ivory" : "border-burgundy/20 bg-ivory text-ink/80 hover:border-burgundy/60"}`}>
      {swatch && <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10" style={{ background: swatch }} />}
      {children}
    </button>
  );
}

export function ShopClient({ products }: { products: ProductWithPhotos[] }) {
  const sp = useSearchParams();
  const [flower, setFlower] = useState<FlowerType | null>(null);
  const [color, setColor] = useState<ColorName | null>(null);
  const [occasion, setOccasion] = useState<Occasion | null>(() => OCCASIONS.find((o) => o.id === sp.get("occasion"))?.id ?? null);
  const [collection, setCollection] = useState<Collection | null>(() => COLLECTIONS.find((c) => c.id === sp.get("collection"))?.id ?? null);
  const [price, setPrice] = useState<(typeof PRICES)[number]["id"] | null>(null);
  const [panel, setPanel] = useState(false);
  const [active, setActive] = useState<ProductWithPhotos | null>(null);
  const close = useCallback(() => setActive(null), []);
  useLockScroll(panel);

  const filtered = useMemo(
    () => products.filter((p) =>
      (!flower || p.flowers.includes(flower)) &&
      (!color || p.color === color) &&
      (!occasion || p.occasions.includes(occasion)) &&
      (!collection || p.collection === collection) &&
      (!price || PRICES.find((x) => x.id === price)!.test(p.price))),
    [products, flower, color, occasion, collection, price],
  );
  const n = [flower, color, occasion, collection, price].filter(Boolean).length;
  const clear = () => { setFlower(null); setColor(null); setOccasion(null); setCollection(null); setPrice(null); };

  const filters = (
    <div className="space-y-8">
      <Group title="Collection">{COLLECTIONS.map((c) => <Chip key={c.id} active={collection === c.id} onClick={() => setCollection(collection === c.id ? null : c.id)}>{c.title}</Chip>)}</Group>
      <Group title="Flower">{FLOWER_TYPES.map((f) => <Chip key={f.id} active={flower === f.id} onClick={() => setFlower(flower === f.id ? null : f.id)}>{f.label}</Chip>)}</Group>
      <Group title="Colour">{COLORS.map((c) => <Chip key={c.id} swatch={c.swatch} active={color === c.id} onClick={() => setColor(color === c.id ? null : c.id)}>{c.label}</Chip>)}</Group>
      <Group title="Occasion">{OCCASIONS.map((o) => <Chip key={o.id} active={occasion === o.id} onClick={() => setOccasion(occasion === o.id ? null : o.id)}>{o.label}</Chip>)}</Group>
      <Group title="Price">{PRICES.map((p) => <Chip key={p.id} active={price === p.id} onClick={() => setPrice(price === p.id ? null : p.id)}>{p.label}</Chip>)}</Group>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1500px] px-5 pb-28 sm:px-8 lg:px-12">
      <header className="mb-12 max-w-3xl sm:mb-16">
        <p className="mb-5 flex items-center gap-4 text-[11px] tracking-[0.32em] text-rose uppercase sm:text-xs"><span className="h-px w-10 bg-current opacity-70" />The shop</p>
        <h1 className="font-serif text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.92] font-light tracking-[-0.02em] text-burgundy"><WordReveal text="All our bouquets." italic={["bouquets."]} /></h1>
        <Reveal delay={0.2}><p className="mt-6 max-w-lg text-base leading-relaxed text-ink/70">Hand-tied to order. Filter by flower, colour, occasion or price, or <Link href="/#builder" className="text-burgundy underline underline-offset-4">build your own</Link>.</p></Reveal>
      </header>

      <div className="grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-16">
        <aside className="hidden lg:block"><div className="sticky top-28" data-lenis-prevent>{filters}</div></aside>

        <div>
          <div className="mb-8 flex items-center justify-between border-b border-burgundy/10 pb-5">
            <p className="text-sm text-ink/65" aria-live="polite">{filtered.length} {filtered.length === 1 ? "bouquet" : "bouquets"}{n > 0 && <button type="button" onClick={clear} className="ml-4 text-burgundy underline underline-offset-4">Clear filters ({n})</button>}</p>
            <button type="button" onClick={() => setPanel(true)} className="flex items-center gap-2 rounded-full border border-burgundy/30 px-5 py-2.5 text-xs tracking-[0.16em] text-burgundy uppercase lg:hidden">
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M2 4h12M4 8h8M6 12h4" /></svg>Filter{n > 0 ? ` (${n})` : ""}
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="py-24 text-center"><p className="font-serif text-4xl text-burgundy italic">Nothing blooming here, yet.</p><button type="button" onClick={clear} className="mt-6 rounded-full bg-burgundy px-8 py-3.5 text-sm tracking-[0.14em] text-ivory uppercase">Clear filters</button></div>
          ) : (
            <motion.ul layout className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <motion.li key={p.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                    <ProductCard product={p} onQuickView={setActive} priority={i < 3} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </div>

      <AnimatePresence>
        {panel && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.button type="button" aria-label="Close filters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPanel(false)} className="absolute inset-0 bg-wine/50" />
            <motion.div role="dialog" aria-modal="true" aria-label="Filters" data-lenis-prevent initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto rounded-t-[2rem] bg-ivory p-6 pb-28">
              <div className="mb-6 flex items-center justify-between"><h2 className="font-serif text-3xl text-burgundy">Filters</h2><button type="button" onClick={() => setPanel(false)} aria-label="Close filters" className="h-10 w-10 rounded-full border border-burgundy/20 text-burgundy">✕</button></div>
              {filters}
              <div className="fixed inset-x-0 bottom-0 flex gap-3 border-t border-burgundy/10 bg-ivory p-4">
                <button type="button" onClick={clear} className="flex-1 rounded-full border border-burgundy/30 py-3.5 text-sm tracking-[0.14em] text-burgundy uppercase">Clear</button>
                <button type="button" onClick={() => setPanel(false)} className="flex-1 rounded-full bg-burgundy py-3.5 text-sm tracking-[0.14em] text-ivory uppercase">Show {filtered.length}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <QuickView product={active} onClose={close} />
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-[11px] tracking-[0.26em] text-rose uppercase">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}
