"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { FlowerPhoto } from "@/lib/types";
import { COLLECTIONS } from "@/lib/products";
import { Photo } from "../Photo";
import { SectionHeading } from "../Reveal";

const SHAPES = ["rounded-t-[999px]", "rounded-[2.5rem]", "rounded-b-[999px]", "rounded-tl-[999px] rounded-br-[999px] rounded-tr-[1.5rem] rounded-bl-[1.5rem]"];

function Card({ i, photo }: { i: number; photo: FlowerPhoto }) {
  const c = COLLECTIONS[i];
  return (
    <article className="group relative w-[78vw] shrink-0 snap-center sm:w-[56vw] md:w-[min(26vw,38svh)]">
      <div className={`relative aspect-[4/5] w-full overflow-hidden bg-blush ${SHAPES[i]} ${i % 2 ? "md:mt-10" : ""}`}>
        <Photo photo={photo} sizes="(max-width: 768px) 78vw, 34vw" seed={i + 3} imgClassName="transition-[transform,filter] duration-[1400ms] ease-bloom group-hover:scale-[1.07] group-hover:saturate-[1.2] group-hover:hue-rotate-[-8deg]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wine/55 via-transparent to-transparent" />
        <span aria-hidden="true" className="absolute top-6 left-1/2 -translate-x-1/2 font-serif text-sm tracking-[0.3em] text-ivory/90">0{i + 1}</span>
      </div>
      <div className="mt-6 flex items-end justify-between gap-6 px-2">
        <div>
          <h3 className="font-serif text-4xl font-light text-burgundy sm:text-5xl">
            <Link href={`/shop?collection=${c.id}`} data-cursor="petal" className="after:absolute after:inset-0 after:z-10">{c.title}</Link>
          </h3>
          <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-ink/70">{c.blurb}</p>
        </div>
        <span aria-hidden="true" className="mb-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-burgundy/30 text-burgundy transition-colors duration-500 group-hover:bg-burgundy group-hover:text-ivory">
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 8h13M9 3l5 5-5 5" /></svg>
        </span>
      </div>
    </article>
  );
}

/** Pinned section on desktop: vertical scroll drives a horizontal track. Native swipe on mobile. */
export function Collections({ photos }: { photos: FlowerPhoto[] }) {
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const measure = () => {
      setDesktop(mq.matches);
      if (track.current) setTravel(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); mq.removeEventListener("change", measure); window.removeEventListener("resize", measure); };
  }, []);

  const pinned = desktop && !reduce;
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="collections" ref={section} aria-labelledby="collections-title" className="relative bg-cream" style={pinned ? { height: `calc(100svh + ${travel}px)` } : undefined}>
      <div className={pinned ? "sticky top-0 flex h-svh flex-col justify-center overflow-hidden" : "py-24"}>
        <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <div className="mb-10 flex flex-col justify-between gap-6 md:mb-6 md:flex-row md:items-end">
            <div id="collections-title"><SectionHeading eyebrow="Featured collections" title="Four ways to bloom." italic={["bloom."]} /></div>
            <p className="max-w-xs text-[15px] leading-relaxed text-ink/70">Each collection is its own little world. Scroll sideways and see which one feels like you.</p>
          </div>
        </div>

        <div ref={track} data-lenis-prevent-touch className={pinned ? "w-max" : "no-scrollbar flex snap-x snap-mandatory overflow-x-auto"}>
          <motion.div style={pinned ? { x } : undefined} className="flex gap-6 px-5 sm:px-8 md:gap-14 md:px-[max(3rem,calc((100vw-1500px)/2+3rem))] md:pr-[12vw]">
            {COLLECTIONS.map((_, i) => <Card key={i} i={i} photo={photos[i]} />)}
          </motion.div>
        </div>

        {pinned && (
          <div className="mx-auto mt-6 w-full max-w-[1500px] px-12">
            <div className="h-px w-full bg-burgundy/15"><motion.div style={{ width: bar }} className="h-px bg-burgundy" /></div>
          </div>
        )}
      </div>
    </section>
  );
}
