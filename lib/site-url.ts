/**
 * Canonical site origin, used for metadataBase, canonical URLs, Open Graph, sitemap and robots.
 *
 * Order: NEXT_PUBLIC_SITE_URL (your custom domain) → Vercel's production URL → the
 * current Vercel deployment URL → localhost.
 */
function normalise(v: string): string {
  const withProtocol = /^https?:\/\//.test(v) ? v : `https://${v}`;
  return withProtocol.replace(/\/+$/, "");
}

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return normalise(explicit);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return normalise(vercel);
  return "http://localhost:3000";
}

export const SITE_URL = getSiteUrl();
