import type { FlowerPhoto } from "@/lib/types";
import { Photo } from "../Photo";
import { LogoMark } from "../Logo";
import { Reveal, SectionHeading, Unmask } from "../Reveal";

export function Story({ photos }: { photos: FlowerPhoto[] }) {
  return (
    <section id="story" aria-labelledby="story-title" className="relative overflow-hidden bg-ivory py-24 sm:py-36">
      <LogoMark className="pointer-events-none absolute -top-20 -right-24 h-[34rem] w-[34rem] text-blush/60" strokeWidth={0.25} />
      <div className="relative mx-auto grid max-w-[1500px] gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12">
        {/* Overlapping images */}
        <div className="relative mx-auto h-[34rem] w-full max-w-[34rem] sm:h-[44rem] lg:col-span-6 lg:mx-0 lg:max-w-none">
          <div className="group absolute top-0 left-0 w-[68%]">
            <Unmask className="aspect-[3/4.2] rounded-t-[999px] bg-blush" parallax={36}>
              <Photo photo={photos[0]} sizes="(max-width: 1024px) 70vw, 32vw" seed={11} />
            </Unmask>
          </div>
          <div className="group absolute right-0 bottom-0 w-[52%]">
            <Unmask className="aspect-[4/5] rounded-[2rem] border-[6px] border-ivory bg-sage shadow-[0_30px_60px_-30px_rgba(58,15,27,0.5)] sm:rounded-b-[999px]" parallax={20}>
              <Photo photo={photos[1]} sizes="(max-width: 1024px) 50vw, 24vw" seed={12} />
            </Unmask>
          </div>
          <div aria-hidden="true" className="absolute top-[42%] right-[10%] flex h-28 w-28 items-center justify-center rounded-full bg-burgundy text-ivory sm:h-36 sm:w-36">
            <span lang="ar" dir="rtl" className="font-[family-name:var(--font-arabic)] text-5xl sm:text-6xl">حلا</span>
          </div>
        </div>

        {/* Copy */}
        <div className="lg:col-span-6 lg:pl-12 lg:pt-16">
          <div id="story-title"><SectionHeading eyebrow="Our story" title="Hala means sweetness." italic={["sweetness."]} /></div>
          <div className="mt-10 max-w-xl space-y-6 text-[16px] leading-[1.8] text-ink/75 sm:text-[17px]">
            <Reveal><p>In Arabic, <em className="font-serif text-xl text-burgundy not-italic">hala</em> (<span lang="ar" dir="rtl" className="font-[family-name:var(--font-arabic)] text-xl text-burgundy">حلا</span>) is sweetness: the kind that lingers, like honey on a spoon, a kind word, or the first warm day of spring.</p></Reveal>
            <Reveal delay={0.1}><p>Halaflora joins that word with <em className="font-serif text-xl text-burgundy not-italic">flora</em>, the flowers themselves. Together they carry the idea behind everything we make: a bouquet should never be an afterthought. It should feel like someone thought of you.</p></Reveal>
            <Reveal delay={0.2}><p>So we arrange slowly. We choose each stem by hand, favour what is in season, and tie every bouquet the way we would for someone we love. Sweetness isn&apos;t an add-on here. It&apos;s the whole recipe.</p></Reveal>
          </div>
          <Reveal delay={0.3} className="mt-10 flex items-center gap-5">
            <LogoMark className="h-12 w-12 text-rose" strokeWidth={0.8} />
            <p className="font-serif text-2xl text-burgundy italic">The Sweetness of Every Bloom</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
