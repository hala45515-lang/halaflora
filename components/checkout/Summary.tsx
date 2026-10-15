"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { CartItem } from "../CartProvider";
import { LogoMark } from "../Logo";
import { AnimatedNumber } from "./AnimatedNumber";
import { ADDONS, DELIVERY_FEE, FREE_DELIVERY_FROM } from "./validation";

export interface Totals { items: number; addons: number; delivery: number; total: number }

export function computeTotals(items: CartItem[], addonIds: string[]): Totals {
  const itemsTotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const addons = ADDONS.filter((a) => addonIds.includes(a.id)).reduce((n, a) => n + a.price, 0);
  const merch = itemsTotal + addons;
  const delivery = merch === 0 || merch >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  return { items: itemsTotal, addons, delivery, total: merch + delivery };
}

export function Thumb({ item }: { item: CartItem }) {
  return (
    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-t-full bg-blush">
      {item.image && !item.image.placeholder ? (
        <Image src={item.image.src} alt={item.image.alt} fill sizes="64px" className="object-cover" placeholder={item.image.blurDataURL ? "blur" : "empty"} blurDataURL={item.image.blurDataURL || undefined} />
      ) : (
        <LogoMark className="absolute inset-0 m-auto h-8 w-8 text-burgundy/60" strokeWidth={0.8} />
      )}
    </div>
  );
}

interface Props {
  items: CartItem[];
  addonIds: string[];
  onToggleAddon?: (id: string) => void;
  totals: Totals;
  /** Unique prefix so the desktop and mobile copies don't share input ids. */
  idPrefix: string;
  editable?: boolean;
  onEditBag?: () => void;
}

export function Summary({ items, addonIds, onToggleAddon, totals, idPrefix, editable = true, onEditBag }: Props) {
  const remaining = Math.max(0, FREE_DELIVERY_FROM - (totals.items + totals.addons));
  return (
    <div>
      <ul className="divide-y divide-burgundy/10">
        {items.map((i) => (
          <li key={i.id} className="flex gap-4 py-4 first:pt-0">
            <Thumb item={i} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-xl leading-tight text-burgundy">{i.name}</h3>
                <span className="text-sm tabular-nums">${(i.price * i.qty).toFixed(2)}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-ink/60">
                Qty {i.qty}{i.detail ? ` · ${i.detail}` : " · Standard size"}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {editable && onEditBag && (
        <button type="button" onClick={onEditBag} className="mt-1 text-xs tracking-[0.16em] text-ink/55 uppercase underline underline-offset-4 hover:text-burgundy">Edit bag</button>
      )}

      {onToggleAddon && (
        <fieldset className="mt-8">
          <legend className="mb-3 text-[11px] tracking-[0.26em] text-rose uppercase">Make it extra sweet</legend>
          <ul className="space-y-2">
            {ADDONS.map((a) => {
              const on = addonIds.includes(a.id);
              const id = `${idPrefix}-addon-${a.id}`;
              return (
                <li key={a.id}>
                  <label htmlFor={id} className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-3.5 transition-colors ${on ? "border-burgundy bg-ivory" : "border-burgundy/15 bg-ivory/50 hover:border-burgundy/40"}`}>
                    <input id={id} type="checkbox" checked={on} onChange={() => onToggleAddon(a.id)} className="peer sr-only" />
                    <span aria-hidden="true" className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rose ${on ? "border-burgundy bg-burgundy text-ivory" : "border-burgundy/40"}`}>
                      <svg viewBox="0 0 16 16" className={`h-3 w-3 transition-opacity ${on ? "opacity-100" : "opacity-0"}`} fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8.5l3.2 3L13 4.5" /></svg>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-burgundy">{a.name}</span>
                      <span className="block text-xs text-ink/55">{a.blurb}</span>
                    </span>
                    <span className="text-sm tabular-nums">+${a.price}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      )}

      <dl className="mt-8 space-y-2.5 border-t border-burgundy/10 pt-6 text-sm">
        <div className="flex justify-between"><dt className="text-ink/70">Subtotal</dt><dd><AnimatedNumber value={totals.items} /></dd></div>
        <AnimatePresence initial={false}>
          {totals.addons > 0 && (
            <motion.div key="addons" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex justify-between overflow-hidden">
              <dt className="text-ink/70">Extras</dt><dd><AnimatedNumber value={totals.addons} /></dd>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex justify-between"><dt className="text-ink/70">Delivery</dt><dd>{totals.delivery === 0 ? <span className="text-moss">Free</span> : <AnimatedNumber value={totals.delivery} />}</dd></div>
        {remaining > 0 && <p className="text-xs text-ink/50">Add ${remaining.toFixed(2)} more for free delivery.</p>}
        <div className="flex items-baseline justify-between border-t border-burgundy/10 pt-4">
          <dt className="text-xs tracking-[0.2em] text-ink/70 uppercase">Total</dt>
          <dd className="font-serif text-4xl text-burgundy"><AnimatedNumber value={totals.total} /></dd>
        </div>
      </dl>
    </div>
  );
}
