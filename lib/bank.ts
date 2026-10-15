import { getPhotos } from "./unsplash";
import { colorDistance, hexToLab } from "./color";
import { POOL_QUERIES, PRODUCTS, type PoolKey, type Product } from "./products";
import type { FlowerPhoto, PlaceholderTone } from "./types";

const TONES: Record<PoolKey, PlaceholderTone> = {
  roses: "rose", peony: "blush", tulips: "blush", wild: "sage", arrangement: "ivory", ranunculus: "ivory", dried: "ivory", lavender: "blush", hydrangea: "blush", daisy: "ivory", pampas: "ivory",
};

// Search results sometimes drift to landscapes and people; keep flower close-ups first.
const OFF_TOPIC = /mountain|hill|valley|lake|sunset|sky|forest|hiking|person|woman|man |men |people|girl|boy|hand |holding|wearing/i;
const onTopic = (p: FlowerPhoto) => !OFF_TOPIC.test(p.alt);

/** The hero background query. Excluded from every pool so it never repeats elsewhere. */
export const HERO_QUERY = { query: "pink rose bouquet", orientation: "landscape", count: 1, tone: "burgundy" } as const;

const isPortrait = (p: FlowerPhoto) => p.height >= p.width;

/**
 * One Unsplash request per pool (20 photos each, cached for 24h), shared by every
 * page and section. Products read from the front of a pool; home-page sections
 * read from the back, so they never repeat each other.
 */
export async function getBank() {
  const keys = Object.keys(POOL_QUERIES) as PoolKey[];
  const [pools, [hero]] = await Promise.all([
    Promise.all(keys.map((k) => getPhotos({ query: POOL_QUERIES[k], count: 20, tone: TONES[k] }))),
    getPhotos(HERO_QUERY),
  ]);
  // A photo can turn up in several searches. It lives in the first pool that has it, so
  // no photo is ever shared between pools (placeholders have unique ids already).
  const seen = new Set<string>([hero.id]);
  const ordered = Object.fromEntries(
    keys.map((k, i) => {
      const p = pools[i].filter((x) => x.placeholder || (!seen.has(x.id) && !!seen.add(x.id)));
      // On-topic portrait shots first: they crop best in the tall cards.
      const good = p.filter(onTopic), rest = p.filter((x) => !onTopic(x));
      const order = (list: FlowerPhoto[]) => [...list.filter(isPortrait), ...list.filter((x) => !isPortrait(x))];
      return [k, [...order(good), ...order(rest)]];
    }),
  ) as Record<PoolKey, FlowerPhoto[]>;

  const used = new Set<string>();

  return {
    /** Product imagery: [primary, ...gallery]. Stable across pages. */
    productPhotos(product: Product): FlowerPhoto[] {
      const pool = ordered[product.pool];
      const sharing = PRODUCTS.filter((p) => p.pool === product.pool);
      const slot = sharing.findIndex((p) => p.slug === product.slug);
      return [0, 1, 2].map((k) => pool[(slot * 3 + k) % pool.length]);
    },
    /** Section imagery, taken from the back of a pool and never reused. */
    take(key: PoolKey, n = 1, orientation?: "portrait" | "landscape"): FlowerPhoto[] {
      const rev = [...ordered[key]].reverse();
      const pool = [...rev.filter(onTopic), ...rev.filter((p) => !onTopic(p))];
      const prefer = pool.filter((p) => !used.has(p.id) && (!orientation || (orientation === "portrait") === isPortrait(p)));
      const rest = pool.filter((p) => !used.has(p.id) && !prefer.includes(p));
      const picked = [...prefer, ...rest].slice(0, n);
      picked.forEach((p) => used.add(p.id));
      return picked;
    },
    /** Marks photos as already on the page so nothing else picks them. */
    reserve(photos: FlowerPhoto[]) {
      photos.forEach((p) => used.add(p.id));
    },
    /**
     * The best unused photo(s) for a subject, reserved on the way out. Scores alt text that
     * mentions `keyword`, on-topic and portrait shots, and (optionally) closeness to a target
     * colour. `minL` drops dark photos (Lab lightness, 0-100) unless nothing lighter is left.
     */
    takeBest(key: PoolKey, keyword: string, opts: { n?: number; target?: string; minL?: number } = {}): FlowerPhoto[] {
      const { n = 1, target, minL } = opts;
      const kw = keyword.toLowerCase();
      const score = (p: FlowerPhoto) =>
        (p.alt.toLowerCase().includes(kw) ? 4 : 0) + (onTopic(p) ? 2 : 0) + (isPortrait(p) ? 1 : 0) - (target ? colorDistance(p.color, target) / 8 : 0);
      let candidates = ordered[key].filter((p) => !used.has(p.id));
      if (minL !== undefined) {
        const light = candidates.filter((p) => p.placeholder || hexToLab(p.color)[0] >= minL);
        if (light.length) candidates = light;
      }
      const picked = candidates.map((p, i) => ({ p, i })).sort((a, b) => score(b.p) - score(a.p) || a.i - b.i).slice(0, n).map((x) => x.p);
      picked.forEach((p) => used.add(p.id));
      return picked;
    },
    /** The best unused photos from the front of a pool (on-topic portraits first). Reserves them. */
    takeFront(key: PoolKey, n: number): FlowerPhoto[] {
      const picked = ordered[key].filter((p) => !used.has(p.id)).slice(0, n);
      picked.forEach((p) => used.add(p.id));
      return picked;
    },
    /** First photo of a pool, used for the hero arch. Reserves it. */
    lead(key: PoolKey): FlowerPhoto {
      const p = ordered[key][0];
      used.add(p.id);
      return p;
    },
  };
}

export type Bank = Awaited<ReturnType<typeof getBank>>;
