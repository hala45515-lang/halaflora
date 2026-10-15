"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { FlowerPhoto } from "@/lib/types";
import { FlowerImage } from "./FlowerImage";
import { PhotoCredit } from "./PhotoCredit";
import { Petals } from "./Petals";
import { MagneticButton } from "./MagneticButton";
import { LogoMark } from "./Logo";
import { useIntro } from "./IntroProvider";

const ease = [0.22, 1, 0.36, 1] as const;

const LINES = [
  [{ w: "The" }, { w: "Sweetness", accent: true }],
  [{ w: "of" }, { w: "Every" }, { w: "Bloom", accent: true }],
];

export function Hero({ background, arch }: { background: FlowerPhoto; arch: FlowerPhoto }) {
  const { ready } = useIntro();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const archY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-28%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  let wordIndex = 0;

  return (
    <section ref={ref} aria-label="Halaflora" className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-wine text-ivory">
      {/* Full-bleed photograph */}
      <motion.div style={{ y: bgY }} className="absolute inset-x-0 -top-[10%] bottom-0 -z-30">
        <motion.div
          initial={{ scale: reduce ? 1 : 1.25 }}
          animate={ready ? { scale: 1.02 } : {}}
          transition={{ duration: 2.6, ease }}
          className="relative h-full w-full"
        >
          <FlowerImage photo={background} priority sizes="100vw" seed={1} />
        </motion.div>
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-t from-wine/85 via-wine/30 to-wine/45" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_30%_100%,rgba(58,15,27,0.55),transparent_60%)]" />

      <div className="absolute inset-0 -z-10">
        <Petals />
      </div>

      {/* Overlapping arch image */}
      <motion.div
        style={{ y: archY }}
        className="absolute top-[14svh] right-[6vw] w-[40vw] max-w-[210px] sm:top-[18svh] sm:w-[25vw] sm:max-w-[370px] lg:right-[6vw]"
      >
        <motion.div
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={ready ? { clipPath: "inset(0% 0 0 0)" } : {}}
          transition={{ duration: 1.5, ease, delay: 0.5 }}
          className="relative aspect-[3/4.3] overflow-hidden rounded-t-[999px] border border-ivory/30 shadow-[0_30px_80px_-20px_rgba(58,15,27,0.6)]"
        >
          <motion.div initial={{ scale: 1.3 }} animate={ready ? { scale: 1 } : {}} transition={{ duration: 2, ease, delay: 0.5 }} className="absolute inset-0">
            <FlowerImage photo={arch} sizes="(max-width: 640px) 44vw, 400px" seed={2} />
          </motion.div>
        </motion.div>

        {/* Rotating badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={ready ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease, delay: 1.5 }}
          className="absolute top-[58%] -left-9 h-20 w-20 sm:top-auto sm:-bottom-12 sm:-left-14 sm:h-32 sm:w-32"
          aria-hidden="true"
        >
          <div className="animate-spin-slow absolute inset-0">
            <svg viewBox="0 0 120 120" className="h-full w-full">
              <defs>
                <path id="badge-circle" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
              </defs>
              <circle cx="60" cy="60" r="59" fill="#5c1a2b" fillOpacity="0.88" />
              <text fill="#f2d4ce" fontSize="9.5" textLength="286" lengthAdjust="spacing" className="font-sans uppercase">
                <textPath href="#badge-circle">Hand-tied · Fresh daily · Made with love · </textPath>
              </text>
            </svg>
          </div>
          <LogoMark className="absolute inset-0 m-auto h-9 w-9 text-blush sm:h-12 sm:w-12" strokeWidth={0.9} />
        </motion.div>
      </motion.div>

      {/* Copy */}
      <motion.div style={{ y: textY, opacity: fade }} className="relative mx-auto w-full max-w-[1500px] px-5 pb-10 pt-40 sm:px-8 sm:pb-14 lg:px-12">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease, delay: 0.1 }}
          className="mb-5 flex items-center gap-4 text-[11px] tracking-[0.32em] uppercase text-blush sm:text-xs"
        >
          <span className="h-px w-10 bg-blush/70" />
          Halaflora · Floral Atelier
        </motion.p>

        <h1 className="font-serif text-[clamp(3.4rem,16vw,5.5rem)] sm:text-[clamp(4rem,11.5vw,11rem)] leading-[0.86] font-light tracking-[-0.025em]">
          <span className="sr-only">The Sweetness of Every Bloom</span>
          <span aria-hidden="true" className="block">
            {LINES.map((line, li) => (
              <span key={li} className={`flex flex-wrap gap-x-[0.22em] ${li === 1 ? "sm:pl-[8vw]" : ""}`}>
                {line.map((word) => {
                  const i = wordIndex++;
                  return (
                    <span key={word.w} className="-mb-[0.1em] inline-block overflow-hidden pb-[0.12em]">
                      <motion.span
                        className={`inline-block ${word.accent ? "text-blush italic" : ""}`}
                        initial={{ y: reduce ? 0 : "115%", rotate: reduce ? 0 : 4 }}
                        animate={ready ? { y: 0, rotate: 0 } : {}}
                        transition={{ duration: 1.25, ease, delay: 0.25 + i * 0.12 }}
                      >
                        {word.w}
                      </motion.span>
                    </span>
                  );
                })}
              </span>
            ))}
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-8 sm:mt-14 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease, delay: 1.1 }}
            className="max-w-md"
          >
            <p className="mb-7 text-base leading-relaxed text-ivory/85 sm:text-lg">
              Hand-tied bouquets, wild seasonal blooms and little gardens in paper — arranged slowly, with a great deal of sweetness.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <MagneticButton href="/shop" variant="cream">Shop Bouquets</MagneticButton>
              <MagneticButton href="#story" variant="ghost">Our Story</MagneticButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.6 }}
            className="flex items-end justify-between gap-8 md:flex-col md:items-end md:gap-5"
          >
            <div className="hidden items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-ivory/80 md:flex">
              Scroll
              <span className="relative block h-12 w-px overflow-hidden bg-ivory/25">
                <span className="animate-scroll-cue absolute inset-0 bg-ivory" />
              </span>
            </div>
            <div className="space-y-0.5 text-ivory/70">
              <PhotoCredit photo={background} />
              {arch.id !== background.id && <PhotoCredit photo={arch} />}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
