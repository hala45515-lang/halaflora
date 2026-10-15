"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MARK_PETALS } from "../Logo";
import { Petals } from "../Petals";
import { GiftCard } from "./GiftCard";
import { Thumb, type Totals } from "./Summary";
import { ADDONS, SLOTS, type Delivery, type Message } from "./validation";
import type { CartItem } from "../CartProvider";

export interface Order {
  number: string;
  items: CartItem[];
  addonIds: string[];
  totals: Totals;
  delivery: Delivery;
  message: Message;
}

const ease = [0.22, 1, 0.36, 1] as const;

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export function Confirmation({ order }: { order: Order }) {
  const slot = SLOTS.find((s) => s.id === order.delivery.slot);
  const extras = ADDONS.filter((a) => order.addonIds.includes(a.id));
  const first = order.delivery.name.trim().split(" ")[0];

  return (
    <div className="relative">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0"><Petals /></div>
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <svg viewBox="0 0 48 48" className="mx-auto h-24 w-24 text-burgundy sm:h-28 sm:w-28" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {MARK_PETALS.map((p, i) => (
            <motion.path key={p.angle} d={p.d} transform={`rotate(${p.angle} 24 24)`} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1, delay: 0.1 + i * 0.08, ease }} />
          ))}
          <motion.circle cx="24" cy="24" r="1.5" fill="currentColor" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "24px 24px" }} transition={{ delay: 1.2, duration: 0.5 }} />
        </svg>

        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8, ease }} className="mt-8 text-[11px] tracking-[0.32em] text-rose uppercase sm:text-xs">Order {order.number}</motion.p>
        <h1 className="mt-4 font-serif text-[clamp(3rem,9vw,7rem)] leading-[0.95] font-light tracking-[-0.02em] text-burgundy">
          <span className="sr-only">Thank you, sweetly.</span>
          <span aria-hidden="true">
          {["Thank", "you,"].map((w, i) => (
            <span key={w} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span className="inline-block" initial={{ y: "115%" }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay: 0.4 + i * 0.12 }}>{w}</motion.span>
            </span>
          ))}
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span className="inline-block text-rose italic" initial={{ y: "115%" }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay: 0.64 }}>sweetly.</motion.span>
          </span>
          </span>
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.9 }} className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-ink/70 sm:text-lg">
          Your flowers for {first || "your recipient"} are being cut and tied by hand. This is a demo order, so no payment was taken and nothing will actually be delivered.
        </motion.p>
      </div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 1, ease }} className="relative z-10 mx-auto mt-14 grid max-w-5xl gap-10 lg:grid-cols-2 lg:gap-14">
        <section aria-labelledby="deliv" className="rounded-[2rem] bg-ivory p-7 ring-1 ring-burgundy/10 sm:p-9">
          <h2 id="deliv" className="font-serif text-3xl text-burgundy">Delivery</h2>
          <dl className="mt-6 space-y-5 text-[15px]">
            <div><dt className="text-[11px] tracking-[0.24em] text-rose uppercase">To</dt><dd className="mt-1 text-ink/85">{order.delivery.name}<br />{order.delivery.address}, {order.delivery.city}<br /><span className="text-ink/60">{order.delivery.phone}</span></dd></div>
            <div><dt className="text-[11px] tracking-[0.24em] text-rose uppercase">When</dt><dd className="mt-1 text-ink/85">{formatDate(order.delivery.date)}<br /><span className="text-ink/60">{slot?.label}, {slot?.time}</span></dd></div>
          </dl>
          <ul className="mt-8 divide-y divide-burgundy/10 border-t border-burgundy/10">
            {order.items.map((i) => (
              <li key={i.id} className="flex items-center gap-4 py-4">
                <Thumb item={i} />
                <div className="min-w-0 flex-1"><p className="font-serif text-lg leading-tight text-burgundy">{i.name}</p><p className="text-xs text-ink/55">Qty {i.qty}{i.detail ? ` · ${i.detail}` : ""}</p></div>
                <span className="text-sm tabular-nums">${(i.price * i.qty).toFixed(2)}</span>
              </li>
            ))}
            {extras.map((a) => (<li key={a.id} className="flex justify-between py-3 text-sm text-ink/75"><span>{a.name}</span><span className="tabular-nums">${a.price.toFixed(2)}</span></li>))}
          </ul>
          <div className="mt-2 flex items-baseline justify-between border-t border-burgundy/10 pt-5"><span className="text-xs tracking-[0.2em] text-ink/70 uppercase">Total{order.totals.delivery === 0 ? " · free delivery" : ""}</span><span className="font-serif text-3xl text-burgundy tabular-nums">${order.totals.total.toFixed(2)}</span></div>
        </section>

        <section aria-labelledby="card-h" className="flex flex-col justify-center">
          <h2 id="card-h" className="mb-8 text-center font-serif text-3xl text-burgundy">Your card <span className="text-rose italic">goes along</span></h2>
          {order.message.text.trim() ? (
            <GiftCard to={first} message={order.message.text} from={order.message.from} anonymous={order.message.anonymous} />
          ) : (
            <p className="text-center font-serif text-2xl text-ink/50 italic">No message this time, and the flowers will speak for themselves.</p>
          )}
        </section>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.8 }} className="relative z-10 mt-16 flex justify-center">
        <Link href="/shop" data-cursor="petal" className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-burgundy px-10 py-4 text-sm font-medium tracking-[0.14em] text-ivory uppercase transition-colors duration-500 hover:bg-wine">
          Continue shopping
          <svg className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M1 8h13M9 3l5 5-5 5" /></svg>
        </Link>
      </motion.div>
    </div>
  );
}
