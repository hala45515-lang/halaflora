import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Photo } from "@/components/Photo";
import { LogoMark } from "@/components/Logo";
import { MagneticButton } from "@/components/MagneticButton";
import { Reveal, SectionHeading, Unmask, WordReveal } from "@/components/Reveal";
import { Values } from "@/components/about/Values";
import { Timeline } from "@/components/about/Timeline";
import { getBank } from "@/lib/bank";
import { LIVE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Hala means sweetness in Arabic. Meet the florists behind Halaflora and see how every bouquet is selected, designed, wrapped and delivered by hand.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Our Story · Halaflora",
    description: "Hala means sweetness. The story, the values and the craft behind every Halaflora bouquet.",
    url: "/about",
    type: "website",
  },
};

export default async function AboutPage() {
  // Same cached photo pools as the rest of the site: no new Unsplash requests.
  const bank = await getBank();
  const hero = bank.take("peony", 1, "portrait")[0];
  const story = bank.take("arrangement", 1, "portrait")[0];
  const story2 = bank.take("ranunculus", 1, "landscape")[0];
  const steps = [bank.take("tulips", 1, "portrait")[0], bank.take("arrangement", 1, "portrait")[0], bank.take("dried", 1, "portrait")[0], bank.take("roses", 1, "portrait")[0]];
  const credits = [hero, story, story2, ...steps];

  return (
    <>
      <Navbar />
      <main id="main">
        {/* Hero */}
        <section className="relative overflow-hidden bg-ivory pt-32 pb-20 sm:pt-44 sm:pb-28">
          <LogoMark className="pointer-events-none absolute -bottom-32 -left-32 h-[36rem] w-[36rem] text-blush/50" strokeWidth={0.25} />
          <div className="relative mx-auto grid max-w-[1500px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
            <div className="lg:col-span-7">
              <Reveal y={16}><p className="mb-6 flex items-center gap-4 text-[11px] tracking-[0.32em] text-rose uppercase sm:text-xs"><span className="h-px w-10 bg-current opacity-70" />Our story</p></Reveal>
              <h1 className="font-serif text-[clamp(3.4rem,10.5vw,10rem)] leading-[0.88] font-light tracking-[-0.025em] text-burgundy">
                <WordReveal text="Sweetness," italic={["Sweetness,"]} /><br />
                <span className="sm:pl-[6vw]"><WordReveal text="arranged by hand." italic={["hand."]} /></span>
              </h1>
              <Reveal delay={0.5}><p className="mt-10 max-w-lg text-lg leading-relaxed text-ink/70">Halaflora began with a simple belief: flowers are the quickest way to tell someone they matter. We are a small floral atelier that treats every bouquet like a letter.</p></Reveal>
            </div>
            <div className="relative lg:col-span-5">
              <div className="group relative mx-auto w-[78%] max-w-[480px] lg:w-full">
                <Unmask className="aspect-[3/4.3] rounded-t-[999px] bg-blush shadow-[0_40px_80px_-30px_rgba(92,26,43,0.45)]" parallax={34}>
                  <Photo photo={hero} sizes="(max-width: 1024px) 78vw, 40vw" priority seed={40} />
                </Unmask>
                <div aria-hidden="true" className="absolute -bottom-8 -left-6 flex h-28 w-28 items-center justify-center rounded-full bg-burgundy text-ivory sm:-left-12 sm:h-36 sm:w-36">
                  <span lang="ar" dir="rtl" className="font-[family-name:var(--font-arabic)] text-5xl sm:text-6xl">حلا</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The name */}
        <section aria-labelledby="name-title" className="bg-cream py-24 sm:py-36">
          <div className="mx-auto grid max-w-[1500px] gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
            <div className="lg:col-span-6 lg:pt-10">
              <div id="name-title"><SectionHeading eyebrow="The name" title="Hala + flora." italic={["flora."]} /></div>
              <div className="mt-10 max-w-xl space-y-6 text-[16px] leading-[1.85] text-ink/75 sm:text-[17px]">
                <Reveal><p>In Arabic, <span lang="ar" dir="rtl" className="font-[family-name:var(--font-arabic)] text-2xl text-burgundy">حلا</span> (<em className="font-serif text-xl text-burgundy not-italic">hala</em>) means sweetness: honey on a warm spoon, a kind word at the right moment, the first morning of spring. It was the word that always made us smile, so it became the heart of our name.</p></Reveal>
                <Reveal delay={0.1}><p><em className="font-serif text-xl text-burgundy not-italic">Flora</em> is the other half: the flowers themselves, in all their wild and tender variety. Together they say what we do: we make something sweet out of something beautiful, and hand it to someone you love.</p></Reveal>
                <Reveal delay={0.2}><p>We started small, with buckets of stems and a table by the window, arranging for friends and friends of friends. What we learned is that nobody remembers the price of a bouquet. They remember how it felt when it arrived. We&apos;ve built everything around that feeling.</p></Reveal>
              </div>
            </div>
            <div className="relative lg:col-span-6">
              <div className="group relative ml-auto w-[88%] sm:w-[78%]">
                <Unmask className="aspect-[4/5] rounded-[2rem] rounded-br-[999px] bg-blush" parallax={30}>
                  <Photo photo={story} sizes="(max-width: 1024px) 80vw, 40vw" seed={41} />
                </Unmask>
              </div>
              <div className="group relative -mt-24 w-[56%] sm:-mt-32">
                <Unmask className="aspect-[4/3] rounded-t-[999px] rounded-b-2xl border-[6px] border-cream bg-sage shadow-[0_30px_60px_-30px_rgba(58,15,27,0.5)]" parallax={18}>
                  <Photo photo={story2} sizes="(max-width: 1024px) 50vw, 24vw" seed={42} />
                </Unmask>
              </div>
            </div>
          </div>
        </section>

        <Values />
        <Timeline photos={steps} />

        {/* Quote */}
        <section aria-label="A note from the studio" className="relative overflow-hidden bg-burgundy py-28 text-ivory sm:py-44">
          <LogoMark className="pointer-events-none absolute top-1/2 left-1/2 h-[48rem] w-[48rem] -translate-x-1/2 -translate-y-1/2 text-blush/10" strokeWidth={0.2} />
          <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
            <span aria-hidden="true" className="block font-serif text-[9rem] leading-[0.6] text-rose/60 sm:text-[13rem]">“</span>
            <blockquote>
              <p className="font-serif text-[clamp(2.2rem,5.6vw,5rem)] leading-[1.12] font-light italic">
                <WordReveal text="A bouquet is never just flowers. It is a small, sweet way of saying I thought of you." />
              </p>
              <footer className="mt-10 text-xs tracking-[0.3em] text-blush uppercase sm:text-sm">The Halaflora studio</footer>
            </blockquote>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="cta-title" className="bg-ivory py-28 text-center sm:py-40">
          <div className="mx-auto max-w-4xl px-5">
            <h2 id="cta-title" className="font-serif text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.95] font-light tracking-[-0.02em] text-burgundy">
              <WordReveal text="Find your sweetness." italic={["sweetness."]} />
            </h2>
            <Reveal delay={0.3}><p className="mx-auto mt-8 max-w-md text-ink/70">Browse our hand-tied bouquets, or tell us what you have in mind and we&apos;ll make it.</p></Reveal>
            <Reveal delay={0.45} className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton href="/shop" variant="burgundy">Shop Bouquets</MagneticButton>
              <MagneticButton href="/contact" variant="outline">Say Hello</MagneticButton>
            </Reveal>
            <Reveal delay={0.6}>
              <p className="mt-12 text-[11px] tracking-[0.26em] text-rose uppercase">Find us online</p>
              <a href={LIVE_URL} target="_blank" rel="noopener noreferrer" data-cursor="petal" className="mt-3 inline-flex items-center gap-3 border-b border-burgundy/40 pb-1 font-serif text-2xl text-burgundy transition-colors hover:border-burgundy sm:text-3xl">
                {LIVE_URL.replace(/^https?:\/\//, "")}
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M4 12L12 4M5 4h7v7" /></svg>
              </a>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer credits={credits} />
    </>
  );
}
