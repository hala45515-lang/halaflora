import type { FlowerPhoto } from "./types";

type Lab = [number, number, number];

/** sRGB hex → CIE Lab (D65). */
export function hexToLab(hex: string): Lab {
  const n = parseInt(hex.replace("#", "").padEnd(6, "0").slice(0, 6), 16);
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const r = lin((n >> 16) & 255), g = lin((n >> 8) & 255), b = lin(n & 255);
  const x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047;
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}

/** Colour distance. Lightness counts for less than hue, since photo averages run dark. */
export function colorDistance(a: string, b: string): number {
  const [l1, a1, b1] = hexToLab(a), [l2, a2, b2] = hexToLab(b);
  return Math.sqrt((0.6 * (l1 - l2)) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2);
}

/** The photo whose average colour (Unsplash `color`) is nearest to `target`; portraits get a small bonus. */
export function closestPhoto(photos: FlowerPhoto[], target: string): FlowerPhoto | null {
  let best: FlowerPhoto | null = null;
  let bestScore = Infinity;
  for (const p of photos) {
    const score = colorDistance(p.color, target) + (p.height >= p.width ? 0 : 12);
    if (score < bestScore) { best = p; bestScore = score; }
  }
  return best;
}
