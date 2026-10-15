import type { FlowerPhoto } from "@/lib/types";
import { Photo } from "../Photo";
import { Reveal, SectionHeading } from "../Reveal";

const SPANS = ["col-span-2 row-span-2", "", "", "row-span-2", "", "col-span-2", "", ""];

export function InstaGallery({ photos }: { photos: FlowerPhoto[] }) {
  return (
    <section aria-labelledby="gram-title" className="bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div id="gram-title"><SectionHeading eyebrow="In the studio" title="Petals from our feed." italic={["feed."]} /></div>
          <Reveal delay={0.2}>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" data-cursor="petal" className="inline-flex items-center gap-3 border-b border-burgundy pb-1 text-sm tracking-[0.16em] text-burgundy uppercase">@halaflora →</a>
          </Reveal>
        </div>
        <ul className="grid auto-rows-[38vw] grid-cols-2 gap-2 sm:auto-rows-[22vw] sm:grid-cols-4 sm:gap-3 lg:auto-rows-[16vw] lg:max-h-none">
          {photos.slice(0, 8).map((p, i) => (
            <li key={p.id} className={`group relative overflow-hidden rounded-2xl bg-blush ${SPANS[i]}`}>
              <Photo photo={p} sizes="(max-width: 640px) 50vw, 25vw" seed={30 + i} imgClassName="transition-[transform,filter] duration-[1400ms] ease-bloom group-hover:scale-[1.08] group-hover:saturate-[1.2] group-hover:hue-rotate-[-8deg]" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center bg-burgundy/0 text-ivory opacity-0 transition-all duration-500 group-hover:bg-burgundy/25 group-hover:opacity-100">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
