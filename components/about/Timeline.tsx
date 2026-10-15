"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { FlowerPhoto } from "@/lib/types";
import { Photo } from "../Photo";
import { Reveal, SectionHeading, Unmask } from "../Reveal";

const STEPS = [
  { n: "01", title: "Selecting", text: "Before the sun is properly up, we choose the day's flowers: the fullest peonies, the straightest tulips, whatever the season is proudest of. Anything tired goes back." },
  { n: "02", title: "Designing", text: "We lay out colour and shape the way you'd sketch: a focal bloom, softer supporting stems, a little wildness at the edges. Then we adjust until it feels like you." },
  { n: "03", title: "Wrapping", text: "Stems are cut at an angle, tied by hand with a spiral, and wrapped in paper and ribbon. A little water is tucked in so everything arrives as it left." },
  { n: "04", title: "Delivering", text: "Your bouquet travels upright and cool, and arrives with a handwritten card if you've asked for one. The best part of our day is the moment someone opens the door." },
];

export function Timeline({ photos }: { photos: FlowerPhoto[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section aria-labelledby="craft-title" className="bg-ivory py-24 sm:py-36">
      <div className="mx-auto max-w-[1300px] px-5 sm:px-8 lg:px-12">
        <div className="mb-20 max-w-3xl">
          <div id="craft-title"><SectionHeading eyebrow="The craft" title="How we make a bouquet." italic={["make"]} /></div>
        </div>

        <ol ref={ref} className="relative">
          {/* progress line */}
          <div aria-hidden="true" className="absolute top-0 bottom-0 left-[1.15rem] w-px bg-burgundy/15 md:left-1/2">
            <motion.div style={{ scaleY: reduce ? 1 : scaleY }} className="h-full origin-top bg-burgundy" />
          </div>

          {STEPS.map((s, i) => {
            const right = i % 2 === 1;
            return (
              <li key={s.n} className="relative pb-20 pl-14 last:pb-0 md:grid md:grid-cols-2 md:gap-24 md:pl-0">
                <span aria-hidden="true" className="absolute top-1 left-0 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-burgundy bg-ivory font-serif text-sm text-burgundy md:left-1/2 md:-translate-x-1/2">{i + 1}</span>

                <div className={`${right ? "md:order-2" : ""}`}>
                  <Reveal y={40} className={right ? "" : "md:text-right"}>
                    <p className="font-serif text-7xl leading-none font-light text-blush sm:text-8xl">{s.n}</p>
                    <h3 className="mt-2 font-serif text-4xl text-burgundy sm:text-5xl">{s.title}</h3>
                    <p className={`mt-4 max-w-md text-[16px] leading-[1.8] text-ink/70 ${right ? "" : "md:ml-auto"}`}>{s.text}</p>
                  </Reveal>
                </div>

                <div className={`mt-8 md:mt-0 ${right ? "md:order-1" : ""}`}>
                  <div className={`group relative w-[70%] max-w-[300px] md:w-[62%] ${right ? "md:ml-auto" : ""}`}>
                    <Unmask className={`aspect-[4/5] bg-blush ${i % 2 ? "rounded-[2rem] rounded-tl-[999px]" : "rounded-t-[999px] rounded-b-[2rem]"}`} parallax={24}>
                      <Photo photo={photos[i]} sizes="(max-width: 768px) 70vw, 300px" seed={50 + i} credit={false} />
                    </Unmask>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
