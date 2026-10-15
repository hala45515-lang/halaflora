import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { Collections } from "@/components/sections/Collections";
import { Occasions } from "@/components/sections/Occasions";
import { Builder } from "@/components/sections/Builder";
import { FlowerLanguage } from "@/components/sections/FlowerLanguage";
import { Story } from "@/components/sections/Story";
import { Bestsellers } from "@/components/sections/Bestsellers";
import { Subscription } from "@/components/sections/Subscription";
import { Testimonials } from "@/components/sections/Testimonials";
import { InstaGallery } from "@/components/sections/InstaGallery";
import { getPhotos } from "@/lib/unsplash";
import { HERO_QUERY, getBank } from "@/lib/bank";
import { BESTSELLERS, FLOWER_POOL, FLOWER_TYPES, type FlowerType } from "@/lib/products";
import type { FlowerPhoto } from "@/lib/types";

export default async function Home() {
  // Every query is cached for 24h and shared with /shop and /about, so the whole site costs
  // about 12 Unsplash requests a day. The bank also guarantees no photo appears twice on a page.
  const [[background], bank] = await Promise.all([getPhotos(HERO_QUERY), getBank()]);

  // Reserve the shop-card photos first, then hand out everything else from what's left.
  const bestsellers = BESTSELLERS.map((p) => ({ ...p, photos: bank.productPhotos(p).slice(0, 1) }));
  bank.reserve([background, ...bestsellers.map((b) => b.photos[0])]);

  // A lush, full-frame pink peony (not a lone bloom on a white backdrop).
  const arch = bank.takeBest("peony", "peony", { target: "#d9739a", maxL: 72 })[0];
  const collections = [bank.take("roses", 1, "portrait")[0], bank.take("wild", 1, "portrait")[0], bank.take("tulips", 1, "portrait")[0], bank.take("arrangement", 1, "portrait")[0]];
  const occasions = [
    bank.take("ranunculus", 1, "portrait")[0], // birthday
    bank.take("peony", 1, "landscape")[0], // wedding
    bank.take("roses", 1)[0], // love
    bank.take("arrangement", 1, "portrait")[0], // sympathy
    bank.take("tulips", 1, "landscape")[0], // congrats
  ];
  const story = [bank.take("peony", 1, "portrait")[0], bank.take("dried", 1, "portrait")[0]];
  const subscription = bank.take("arrangement", 1, "landscape")[0];
  const gallery = [
    ...bank.take("roses", 2), ...bank.take("wild", 2), ...bank.take("ranunculus", 1),
    ...bank.take("dried", 1), ...bank.take("tulips", 1), ...bank.take("peony", 1),
  ];

  // Language of Flowers: one close-up per card, best keyword match from the cached pools.
  const language = [
    bank.takeBest("roses", "rose")[0], bank.takeBest("peony", "peony")[0], bank.takeBest("tulips", "tulip")[0],
    bank.takeBest("ranunculus", "ranunculus")[0], bank.takeBest("daisy", "daisy", { target: "#f3efe6", minL: 62 })[0], bank.takeBest("lavender", "lavender")[0],
    bank.takeBest("hydrangea", "hydrangea")[0], bank.takeBest("pampas", "pampas", { target: "#e3d3b8", minL: 58 })[0],
  ];

  // Builder: last, from whatever is still unused, so it never repeats another section.
  const builderPools = Object.fromEntries(FLOWER_TYPES.map((f) => [f.id, bank.takeFront(FLOWER_POOL[f.id], 8)])) as Record<FlowerType, FlowerPhoto[]>;

  const credits: FlowerPhoto[] = [background, arch, ...collections, ...occasions, ...story, subscription, ...gallery, ...language, ...Object.values(builderPools).flat(), ...bestsellers.map((b) => b.photos[0])];

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero background={background} arch={arch} />
        <Collections photos={collections} />
        <Occasions photos={occasions} />
        <Builder pools={builderPools} />
        <FlowerLanguage photos={language} />
        <Story photos={story} />
        <Bestsellers products={bestsellers} />
        <Subscription photo={subscription} />
        <Testimonials />
        <InstaGallery photos={gallery} />
      </main>
      <Footer credits={credits} />
    </>
  );
}
