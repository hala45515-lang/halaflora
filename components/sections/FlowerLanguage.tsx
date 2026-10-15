"use client";

import Image from "next/image";
import { useState } from "react";
import type { FlowerPhoto } from "@/lib/types";
import { PhotoCredit } from "../PhotoCredit";
import { FlowerIcon, type FlowerKind } from "../FlowerArt";
import { Reveal, SectionHeading } from "../Reveal";

const FLOWERS: { name: string; kind: FlowerKind; colors: string[]; meaning: string; note: string; pairs: string }[] = [
  { name: "Rose", kind: "rose", colors: ["#e59aa4", "#c4687a", "#f4c8cb"], meaning: "Love & devotion", note: "The oldest way to say it. Deep red is passion; blush is tenderness.", pairs: "Peony, eucalyptus" },
  { name: "Peony", kind: "peony", colors: ["#f2b8bd", "#e58b9b", "#fbd9dc"], meaning: "Romance & good fortune", note: "Said to bring a happy marriage and prosperity. It blooms for only a few short weeks.", pairs: "Rose, ranunculus" },
  { name: "Tulip", kind: "tulip", colors: ["#e87d8e", "#c4506a", "#f7b6c0"], meaning: "Perfect, cheerful love", note: "A spring bouquet for fresh starts, and for someone you adore without fuss.", pairs: "Ranunculus, grasses" },
  { name: "Ranunculus", kind: "ranunculus", colors: ["#f6c3a4", "#ee9a78", "#fad7bf"], meaning: "Radiant charm", note: "Layer upon layer of paper-thin petals. It says: you dazzle me.", pairs: "Rose, tulip" },
  { name: "Wild daisy", kind: "wildflower", colors: ["#fffaf0", "#e2b341", "#f3ecdc"], meaning: "Innocence & new beginnings", note: "Simple, honest and a little bit carefree. Pure joy in a petal.", pairs: "Grasses, cornflower" },
  { name: "Lavender", kind: "lavender", colors: ["#9d86c9", "#b9a4de", "#cfc0ea"], meaning: "Calm & devotion", note: "A quiet fragrance for peace of mind and steady, lasting affection.", pairs: "Dried flowers" },
  { name: "Hydrangea", kind: "hydrangea", colors: ["#b7c5e6", "#8d9fcf", "#dfe6f6"], meaning: "Gratitude & heartfelt thanks", note: "A full, generous cloud. It says thank you for being there, and I mean it.", pairs: "Rose, greenery" },
  { name: "Pampas & dried", kind: "dried", colors: ["#c9a77c", "#b58a5e", "#e6d3b3"], meaning: "Everlasting remembrance", note: "Flowers that stay. A promise made softly, and kept for a very long time.", pairs: "Lavender, roses" },
];

function FlipCard({ f, i, photo }: { f: (typeof FLOWERS)[number]; i: number; photo: FlowerPhoto | null }) {
  const [flipped, setFlipped] = useState(false);
  const [failed, setFailed] = useState(false);
  const real = !!photo && !photo.placeholder && !failed;

  return (
    <Reveal delay={(i % 4) * 0.08} y={40}>
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        aria-pressed={flipped}
        aria-label={`${f.name}: ${flipped ? "show flower" : "reveal meaning"}`}
        data-cursor="petal"
        data-cursor-label="Flip"
        className="perspective group block h-[22rem] w-full text-left"
      >
        <span className={`preserve-3d relative block h-full w-full transition-transform duration-[900ms] ease-bloom ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
          {/* Front */}
          <span className={`backface-hidden absolute inset-0 overflow-hidden rounded-t-[999px] rounded-b-3xl ${real ? "bg-blush shadow-[0_24px_50px_-30px_rgba(58,15,27,0.6)]" : "flex flex-col items-center justify-between border border-burgundy/10 bg-ivory px-6 pt-14 pb-7"}`}>
            {real ? (
              <>
                <Image src={photo!.src} alt={photo!.alt} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw" placeholder="blur" blurDataURL={photo!.blurDataURL} onError={() => setFailed(true)} className="object-cover [filter:sepia(0.14)_saturate(1.06)] transition-transform duration-[1400ms] ease-bloom group-hover:scale-[1.07]" />
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#c98b8b]/12 mix-blend-soft-light" />
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wine/80 via-wine/20 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 px-6 pt-10 pb-7 text-center text-ivory">
                  <span className="block font-serif text-3xl drop-shadow-sm">{f.name}</span>
                  <span className="mt-1 block text-[11px] tracking-[0.22em] text-blush uppercase">Tap to reveal</span>
                </span>
              </>
            ) : (
              <>
                <FlowerIcon kind={f.kind} colors={f.colors} className="h-36 w-36 drop-shadow-[0_12px_14px_rgba(92,26,43,0.15)]" />
                <span className="text-center">
                  <span className="block font-serif text-3xl text-burgundy">{f.name}</span>
                  <span className="mt-1 block text-[11px] tracking-[0.22em] text-rose uppercase">Tap to reveal</span>
                </span>
              </>
            )}
          </span>

          {/* Back */}
          <span className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-center overflow-hidden rounded-t-[999px] rounded-b-3xl bg-burgundy px-7 pt-12 pb-8 text-ivory">
            {real && (
              <>
                <Image src={photo!.src} alt="" fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw" className="scale-125 object-cover opacity-70 blur-xl" />
                <span aria-hidden="true" className="absolute inset-0 bg-wine/60" />
              </>
            )}
            <span className="relative block text-[11px] tracking-[0.26em] text-blush uppercase">{f.name} means</span>
            <span className="relative mt-2 block font-serif text-3xl leading-tight font-light italic">{f.meaning}</span>
            <span className="relative mt-4 block text-sm leading-relaxed text-ivory/85">{f.note}</span>
            <span className="relative mt-5 block border-t border-ivory/25 pt-3 text-xs text-blush">Pairs with: {f.pairs}</span>
          </span>
        </span>
      </button>
      {real && <PhotoCredit photo={photo!} className="mt-2 text-center text-ink/45" />}
    </Reveal>
  );
}

export function FlowerLanguage({ photos }: { photos: (FlowerPhoto | null | undefined)[] }) {
  return (
    <section id="language" aria-labelledby="language-title" className="bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="mb-14 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div id="language-title"><SectionHeading eyebrow="The language of flowers" title="Every petal says something." italic={["says"]} /></div>
          <Reveal delay={0.2}><p className="max-w-sm text-[15px] leading-relaxed text-ink/70 md:justify-self-end">Long before texting, there were flowers. Turn a card to read what each bloom has always meant, then choose with intention.</p></Reveal>
        </div>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FLOWERS.map((f, i) => <li key={f.name}><FlipCard f={f} i={i} photo={photos[i] ?? null} /></li>)}
        </ul>
      </div>
    </section>
  );
}
