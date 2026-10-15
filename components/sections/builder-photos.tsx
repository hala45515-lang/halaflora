"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { FlowerPhoto } from "@/lib/types";
import { LogoMark } from "../Logo";
import { PhotoCredit } from "../PhotoCredit";

const SIZES = "(max-width: 1024px) 90vw, 460px";

interface Layer { key: number; photo: FlowerPhoto; loaded: boolean }
let layerKey = 0;

/**
 * Crossfading photo stack. A new photo is mounted invisibly on top and only fades in
 * once it has loaded, while the previous one stays fully visible beneath, so there is
 * never a blank frame or flash.
 */
export function PhotoStage({ target, onFail }: { target: FlowerPhoto; onFail: (id: string) => void }) {
  const [layers, setLayers] = useState<Layer[]>([{ key: layerKey++, photo: target, loaded: true }]);
  const [seen, setSeen] = useState(target.id);

  // Adjust state while rendering (React-approved) when the target photo changes.
  if (seen !== target.id) {
    setSeen(target.id);
    setLayers((ls) => [...ls.slice(-2), { key: layerKey++, photo: target, loaded: false }]);
  }

  const loaded = (key: number) => {
    setLayers((ls) => ls.map((l) => (l.key === key ? { ...l, loaded: true } : l)));
    // Once the new photo is fully opaque, drop everything beneath it.
    window.setTimeout(() => setLayers((ls) => { const i = ls.findIndex((l) => l.key === key); return i > 0 ? ls.slice(i) : ls; }), 1100);
  };

  return (
    <>
      {layers.map((l) => (
        <motion.div key={l.key} initial={false} animate={{ opacity: l.loaded ? 1 : 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
          <Image
            src={l.photo.src}
            alt={l.photo.alt}
            fill
            sizes={SIZES}
            placeholder="blur"
            blurDataURL={l.photo.blurDataURL}
            onLoad={() => !l.loaded && loaded(l.key)}
            onError={() => onFail(l.photo.id)}
            className="object-cover"
          />
        </motion.div>
      ))}
    </>
  );
}

/** Hidden, eager images so likely next photos are already in the browser cache. */
export function Preloader({ photos }: { photos: FlowerPhoto[] }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -z-10 h-px w-px overflow-hidden opacity-0">
      {[...new Map(photos.map((p) => [p.id, p])).values()].map((p) => (
        <div key={p.id} className="relative h-[460px] w-[340px]">
          <Image src={p.src} alt="" fill sizes={SIZES} loading="eager" className="object-cover" />
        </div>
      ))}
    </div>
  );
}

/** Soft paper bands over the bottom of the photo that show the chosen wrapping. */
export function WrapBand({ wrap }: { wrap: { label: string; fill: string; front: string } }) {
  const t = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[30%] overflow-hidden">
      <motion.div animate={{ backgroundColor: wrap.fill }} transition={t} className="absolute inset-x-[-8%] bottom-0 h-full [clip-path:ellipse(64%_100%_at_50%_100%)]" />
      <motion.div animate={{ backgroundColor: wrap.front }} transition={t} className="absolute inset-x-[-4%] bottom-0 h-[72%] [clip-path:ellipse(60%_100%_at_50%_100%)]" />
      <div className="absolute inset-x-0 bottom-4 flex justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={wrap.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} className="flex items-center gap-2 rounded-full bg-ivory/90 px-4 py-1.5 text-[11px] tracking-[0.18em] text-burgundy uppercase shadow-sm backdrop-blur">
            <LogoMark className="h-3.5 w-3.5" strokeWidth={1.4} />
            Wrapped in {wrap.label}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-10 text-center">
      <LogoMark className="h-24 w-24 text-rose/60 [&_path]:[stroke-dasharray:2_2.5]" strokeWidth={0.5} />
      <p className="font-serif text-3xl leading-tight font-light text-burgundy italic">Start picking your flowers</p>
      <p className="max-w-[16rem] text-sm text-ink/55">Choose a few stems on the right and your bouquet will bloom here.</p>
    </div>
  );
}

export interface ChipData { id: string; label: string; count: number; photo: FlowerPhoto | null }

/** Round photo chips of every selected flower, with stem counts. */
export function FlowerChips({ chips, stems }: { chips: ChipData[]; stems: number }) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <ul className="flex min-h-[4.5rem] flex-wrap items-start justify-center gap-4" aria-label="Flowers in your bouquet">
        <AnimatePresence initial={false}>
          {chips.map((c) => (
            <motion.li key={c.id} layout initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ type: "spring", stiffness: 260, damping: 22 }} className="flex w-[4.5rem] flex-col items-center gap-1.5">
              <span className="relative block h-14 w-14 overflow-hidden rounded-full bg-blush ring-2 ring-ivory shadow-[0_8px_20px_-8px_rgba(92,26,43,0.5)]">
                {c.photo && !c.photo.placeholder ? (
                  <SafeImage photo={c.photo} alt="" sizes="56px" fallback={<LogoMark className="absolute inset-0 m-auto h-7 w-7 text-burgundy/60" strokeWidth={0.9} />} />
                ) : (
                  <LogoMark className="absolute inset-0 m-auto h-7 w-7 text-burgundy/60" strokeWidth={0.9} />
                )}
                <span className="absolute right-0 bottom-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-burgundy px-1 text-[10px] font-medium text-ivory tabular-nums">×{c.count}</span>
              </span>
              <span className="text-[11px] leading-none text-ink/65">{c.label}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <p className="text-sm text-ink/60" aria-live="polite">{stems} {stems === 1 ? "stem" : "stems"}{stems >= 24 ? " · maximum reached" : ""}</p>
    </div>
  );
}

/** Round photo that swaps to `fallback` if the image can't load. */
function SafeImage({ photo, alt, sizes, fallback }: { photo: FlowerPhoto; alt: string; sizes: string; fallback: React.ReactNode }) {
  const [bad, setBad] = useState(false);
  if (bad) return <>{fallback}</>;
  return <Image src={photo.src} alt={alt} fill sizes={sizes} placeholder="blur" blurDataURL={photo.blurDataURL} onError={() => setBad(true)} className="object-cover" />;
}

/** Small round flower photo for the option cards. */
export function FlowerThumb({ photo, fallback }: { photo: FlowerPhoto | null; fallback: React.ReactNode }) {
  const [bad, setBad] = useState(false);
  if (!photo || photo.placeholder || bad) return <>{fallback}</>;
  return (
    <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-full bg-blush ring-1 ring-burgundy/15">
      <Image src={photo.src} alt={photo.alt} fill sizes="56px" placeholder="blur" blurDataURL={photo.blurDataURL} onError={() => setBad(true)} className="object-cover" />
    </span>
  );
}

export { PhotoCredit };
