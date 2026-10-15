"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FAQS = [
  { q: "Where do you deliver?", a: "We deliver across the city and surrounding suburbs, with courier delivery available further afield for an extra fee. Enter your address at checkout and we'll confirm availability straight away." },
  { q: "Do you offer same-day delivery?", a: "Yes. Order before 1pm and we'll deliver the same day, in the slot you choose. Later orders are happily delivered the next morning." },
  { q: "What is your freshness guarantee?", a: "Every bouquet is cut and tied the day it leaves us. If your flowers don't stay fresh for at least five days with normal care, tell us and we'll replace them or refund you." },
  { q: "Can I request a custom order?", a: "Absolutely. Tell us your colours, budget and occasion through the form above, or try our bouquet builder. We'll design it with you, from a single posy to full wedding florals." },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-burgundy/15 border-y border-burgundy/15">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <h3>
              <button type="button" id={`faq-btn-${i}`} aria-expanded={isOpen} aria-controls={`faq-panel-${i}`} onClick={() => setOpen(isOpen ? null : i)} data-cursor="petal" className="flex w-full items-center justify-between gap-6 py-6 text-left">
                <span className="font-serif text-2xl leading-snug text-burgundy sm:text-3xl">{f.q}</span>
                <span aria-hidden="true" className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 ${isOpen ? "border-burgundy bg-burgundy text-ivory" : "border-burgundy/30 text-burgundy"}`}>
                  <span className="absolute h-px w-4 bg-current" />
                  <motion.span animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }} transition={{ duration: 0.4 }} className="absolute h-4 w-px bg-current" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                  <p className="max-w-2xl pb-7 text-[16px] leading-[1.8] text-ink/70">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
