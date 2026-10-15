import Link from "next/link";
import type { FlowerPhoto } from "@/lib/types";
import { OCCASIONS } from "@/lib/products";
import { Photo } from "../Photo";
import { Reveal, SectionHeading, Unmask } from "../Reveal";

const COPY: Record<string, string> = {
  birthday: "Something bright for another trip around the sun.",
  wedding: "Bouquets, arches and tables, designed with you.",
  love: "Say the thing you always find hard to say.",
  sympathy: "Gentle, white and quietly there.",
  congrats: "Because good news deserves flowers.",
};

// Asymmetric bento: grid span + organic shape per tile.
const TILES = [
  { grid: "md:col-span-2 md:row-span-2", shape: "rounded-t-[999px] rounded-b-[2rem]" },
  { grid: "md:col-span-2", shape: "rounded-[2rem]" },
  { grid: "md:col-span-2 md:row-span-2", shape: "rounded-[2rem] md:rounded-b-[999px]", text: "md:items-center md:pb-16 md:text-center" },
  { grid: "md:col-span-2", shape: "rounded-[2rem]" },
  { grid: "md:col-span-6", shape: "rounded-[2rem] md:rounded-tr-[999px]" },
];

export function Occasions({ photos }: { photos: FlowerPhoto[] }) {
  return (
    <section id="occasions" aria-labelledby="occasions-title" className="bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="mb-14 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div id="occasions-title"><SectionHeading eyebrow="Shop by occasion" title="For every moment worth marking." italic={["moment"]} /></div>
          <Reveal delay={0.2}><p className="max-w-sm text-[15px] leading-relaxed text-ink/70 md:justify-self-end">Tell us what you&apos;re celebrating, or consoling, and we&apos;ll point you to the right flowers.</p></Reveal>
        </div>

        <ul className="grid md:auto-rows-[minmax(230px,26vh)] grid-cols-1 gap-4 md:grid-cols-6 md:gap-5">
          {OCCASIONS.map((o, i) => {
            const t = TILES[i];
            return (
              <li key={o.id} className={`group relative ${t.grid} min-h-[300px] md:min-h-0`}>
                <Unmask className={`h-full w-full bg-blush ${t.shape}`} parallax={24}>
                  <Photo photo={photos[i]} sizes="(max-width: 768px) 100vw, 50vw" seed={i + 7} credit={false} imgClassName="transition-[transform,filter] duration-[1400ms] ease-bloom group-hover:scale-[1.08] group-hover:saturate-[1.2] group-hover:hue-rotate-[-8deg]" />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wine/70 via-wine/10 to-transparent" />
                </Unmask>
                <Link href={`/shop?occasion=${o.id}`} data-cursor="petal" aria-label={`Shop ${o.label} flowers`} className={`absolute inset-0 z-10 ${t.shape}`} />
                <div className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col p-6 text-ivory sm:p-8 ${"text" in t ? t.text : ""}`}>
                  <p className="font-serif text-4xl font-light italic sm:text-5xl">{o.label}</p>
                  <p className="mt-1 max-w-[18rem] text-sm text-ivory/85 transition-all duration-500 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">{COPY[o.id]}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
