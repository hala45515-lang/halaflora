import { cacheLife } from "next/cache";
import { colorBlur, placeholderPhoto } from "./placeholders";
import type { FlowerPhoto, PhotoQuery, Orientation, UnsplashColor } from "./types";

const API = "https://api.unsplash.com";
const UTM = "utm_source=halaflora&utm_medium=referral";

interface UnsplashResult {
  id: string;
  width: number;
  height: number;
  color: string | null;
  description: string | null;
  alt_description: string | null;
  urls: { raw: string };
  links: { html: string };
  user: { name: string; links: { html: string } };
}

/** Terminal warnings are logged once per process so dev logs stay readable. */
const warned = new Set<string>();
function warnOnce(key: string, message: string) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`\n\x1b[33m[halaflora]\x1b[0m ${message}\n`);
}

function hasKey(): boolean {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key || key.startsWith("your_")) {
    warnOnce(
      "no-key",
      "UNSPLASH_ACCESS_KEY is missing. Add it to .env.local (get one at https://unsplash.com/developers). Showing elegant placeholder images instead.",
    );
    return false;
  }
  return true;
}

const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function toPhoto(r: UnsplashResult, query: string, tone: FlowerPhoto["tone"]): FlowerPhoto {
  const color = r.color ?? "#ecc3bf";
  const alt = r.alt_description ?? r.description ?? `${query} photograph`;
  return {
    id: r.id,
    // One stable URL per photo; next/image resizes it per viewport.
    src: `${r.urls.raw}&w=1800&q=75&auto=format&fit=max`,
    width: r.width,
    height: r.height,
    alt: sentence(alt.length > 140 ? `${alt.slice(0, 137)}…` : alt),
    color,
    blurDataURL: colorBlur(color),
    credit: { name: r.user.name, url: `${r.user.links.html}?${UTM}` },
    link: `${r.links.html}?${UTM}`,
    placeholder: false,
    tone,
  };
}

type SearchOutcome = { results: UnsplashResult[]; error?: undefined } | { results?: undefined; error: string };

/**
 * Cached for 24h on success. Failures are returned (not thrown, which would fail
 * the prerender) and cached for only a minute so the site heals itself.
 */
async function searchUnsplash(
  query: string,
  orientation: Orientation | undefined,
  color: UnsplashColor | undefined,
  perPage: number,
): Promise<SearchOutcome> {
  "use cache";

  const params = new URLSearchParams({
    query,
    per_page: String(perPage),
    content_filter: "high",
  });
  if (orientation) params.set("orientation", orientation);
  if (color) params.set("color", color);

  let outcome: SearchOutcome;
  try {
    const res = await fetch(`${API}/search/photos?${params}`, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        "Accept-Version": "v1",
      },
    });
    if (res.status === 403 || res.status === 429) {
      outcome = { error: "rate-limit" };
    } else if (!res.ok) {
      outcome = { error: `status-${res.status}` };
    } else {
      const json = (await res.json()) as { results: UnsplashResult[] };
      outcome = json.results.length ? { results: json.results } : { error: "empty" };
    }
  } catch {
    outcome = { error: "network" };
  }

  if (outcome.error) cacheLife("minutes");
  else cacheLife({ stale: 3600, revalidate: 86400, expire: 604800 });
  return outcome;
}

/**
 * Photos for a curated query. Always returns exactly `count` items:
 * real Unsplash photos when possible, placeholders otherwise.
 */
export async function getPhotos({
  query,
  orientation,
  color,
  count = 6,
  tone,
}: PhotoQuery): Promise<FlowerPhoto[]> {
  const fallback = (from = 0) =>
    Array.from({ length: count - from }, (_, i) =>
      placeholderPhoto(from + i, orientation ?? "portrait", tone, query),
    );

  if (!hasKey()) return fallback();

  // Fetch a fixed page size so every call for a query shares one cache entry.
  const outcome = await searchUnsplash(query, orientation, color, 20);

  if (!outcome.results) {
    const reason = outcome.error;
    if (reason === "rate-limit") {
      warnOnce("rate", "Unsplash rate limit reached (demo apps allow 50 requests/hour). Showing placeholders until it resets.");
    } else if (reason === "status-401") {
      warnOnce("401", "Unsplash rejected the access key (401). Check UNSPLASH_ACCESS_KEY in .env.local. Showing placeholders.");
    } else {
      warnOnce(`fail-${query}`, `Unsplash request for "${query}" failed (${reason}). Showing placeholders.`);
    }
    return fallback();
  }

  const photos = outcome.results.slice(0, count).map((r) => toPhoto(r, query, tone ?? "blush"));
  return [...photos, ...fallback(photos.length)];
}
