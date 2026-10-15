"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "../Reveal";

const QUOTES = [
  { text: "The bouquet arrived looking like a painting. My mother cried, then immediately asked who made it.", name: "Layla", where: "Birthday bouquet" },
  { text: "Our wedding flowers were exactly the soft, wild, slightly romantic mess I had in my head. I couldn't have described it. Halaflora just understood.", name: "Sara & Omar", where: "Wedding florals" },
  { text: "I've had the weekly subscription for months. Fridays are now my favourite day, and the flat smells wonderful.", name: "Noor", where: "Weekly subscription" },
  { text: "Sent a sympathy arrangement to a friend. The note, the ribbon and the whites were so gentle. She said it was the one thing that felt right.", name: "Daniel", where: "Sympathy arrangement" },
];

export function Testimonials() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const go = (n: number) => { setDir(n > i || (i === QUOTES.length - 1 && n === 0) ? 1 : -1); setI((n + QUOTES.length) % QUOTES.length); };

  useEffect(() => {
    if (paused || reduce) return;
    const t = window.setTimeout(() => { setDir(1); setI((v) => (v + 1) % QUOTES.length); }, 7000);
    return () => window.clearTimeout(t);
  }, [i, paused, reduce]);

  const q = QUOTES[i];

  return (
    <section aria-labelledby="love-title" className="bg-blush/40 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
        <div id="love-title" className="flex flex-col items-center [&_p]:justify-center"><SectionHeading eyebrow="Kind words" title="Sweet notes from our customers." italic={["Sweet"]} className="text-center [&_h2]:text-[clamp(2.4rem,6vw,5rem)]" /></div>

        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
          className="relative mt-14"
        >
          <span aria-hidden="true" className="absolute -top-16 left-1/2 -translate-x-1/2 font-serif text-[9rem] leading-none text-rose/30">“</span>
          <div className="relative min-h-[17rem] sm:min-h-[14rem]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.figure
                key={i}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${QUOTES.length}`}
                custom={dir}
                variants={{ enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : 60 * d }), center: { opacity: 1, x: 0 }, exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : -60 * d }) }}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                drag={reduce ? false : "x"} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
                onDragEnd={(_, info) => { if (info.offset.x < -60) go(i + 1); else if (info.offset.x > 60) go(i - 1); }}
                className="cursor-grab px-2 active:cursor-grabbing"
                aria-live="polite"
              >
                <blockquote className="font-serif text-[clamp(1.7rem,3.6vw,3rem)] leading-[1.25] font-light text-burgundy">{q.text}</blockquote>
                <figcaption className="mt-8 text-sm tracking-[0.2em] text-ink/70 uppercase"><span className="text-burgundy">{q.name}</span><span className="mx-3 text-rose">·</span>{q.where}</figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6">
            <button type="button" onClick={() => go(i - 1)} aria-label="Previous testimonial" className="flex h-12 w-12 items-center justify-center rounded-full border border-burgundy/30 text-burgundy transition-colors hover:bg-burgundy hover:text-ivory">
              <svg viewBox="0 0 16 16" className="h-4 w-4 rotate-180" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M1 8h13M9 3l5 5-5 5" /></svg>
            </button>
            <div className="flex gap-2.5" role="tablist" aria-label="Choose testimonial">
              {QUOTES.map((_, n) => (
                <button key={n} type="button" role="tab" aria-selected={n === i} aria-label={`Testimonial ${n + 1}`} onClick={() => go(n)} className={`h-2 rounded-full transition-all duration-500 ${n === i ? "w-8 bg-burgundy" : "w-2 bg-burgundy/25"}`} />
              ))}
            </div>
            <button type="button" onClick={() => go(i + 1)} aria-label="Next testimonial" className="flex h-12 w-12 items-center justify-center rounded-full border border-burgundy/30 text-burgundy transition-colors hover:bg-burgundy hover:text-ivory">
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M1 8h13M9 3l5 5-5 5" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
