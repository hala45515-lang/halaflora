import type { ReactNode } from "react";
import { Reveal, SectionHeading } from "../Reveal";

const I = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 48 48" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

const VALUES = [
  {
    title: "Hand-picked & fresh",
    text: "Every stem is chosen by eye and by touch, from growers we know, and cut to order. If we wouldn't give it to someone we love, it doesn't leave the studio.",
    icon: <I><path d="M24 44V22" /><path d="M24 30c-8 0-12-5-12-12 8 0 12 4 12 12Z" /><path d="M24 24c6 0 10-4 10-10-6 0-10 3-10 10Z" /><circle cx="24" cy="12" r="5" /><path d="M24 7c-3-3-1-5 0-5s3 2 0 5Z" /></I>,
  },
  {
    title: "Thoughtful design",
    text: "We think in colour, texture and shape, then tie by hand. Wild or minimal, each bouquet is composed the way a painter would, with room to breathe.",
    icon: <I><circle cx="24" cy="24" r="17" /><path d="M24 7c4 6 4 12 0 17s-4 11 0 17" /><path d="M7 24c6-4 12-4 17 0s11 4 17 0" /></I>,
  },
  {
    title: "Same-day delivery",
    text: "Flowers shouldn't wait. Order in the morning and we'll bring them out the same day, still cool from the studio and carefully upright.",
    icon: <I><circle cx="24" cy="26" r="15" /><path d="M24 15v11l7 4" /><path d="M18 5h12" /></I>,
  },
  {
    title: "Kind to the planet",
    text: "Seasonal and local where we can, paper instead of plastic, no floral foam, and every trimming composted. Beauty that leaves a light footprint.",
    icon: <I><path d="M8 40C8 20 20 8 40 8c0 20-12 32-32 32Z" /><path d="M8 40 26 22" /><path d="M20 28h8M26 22v8" /></I>,
  },
];

export function Values() {
  return (
    <section aria-labelledby="values-title" className="bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="mb-14 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div id="values-title"><SectionHeading eyebrow="What we believe" title="Four promises we keep." italic={["promises"]} /></div>
          <Reveal delay={0.2}><p className="max-w-sm text-[15px] leading-relaxed text-ink/70 md:justify-self-end">These aren&apos;t slogans. They&apos;re the small decisions we make every morning, long before a bouquet is tied.</p></Reveal>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <li key={v.title}>
              <Reveal delay={i * 0.08} y={44} className="h-full">
                <div className="group flex h-full flex-col rounded-t-[999px] rounded-b-3xl border border-burgundy/10 bg-ivory px-7 pt-16 pb-9 text-center transition-all duration-700 ease-bloom hover:-translate-y-2 hover:border-burgundy/30 hover:shadow-[0_30px_60px_-35px_rgba(92,26,43,0.5)]">
                  <span className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-blush/60 text-burgundy transition-colors duration-700 group-hover:bg-burgundy group-hover:text-blush">{v.icon}</span>
                  <h3 className="font-serif text-3xl leading-tight text-burgundy">{v.title}</h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink/70">{v.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
