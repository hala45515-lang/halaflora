import type { FlowerPhoto, Orientation, PlaceholderTone } from "./types";

const TONES: PlaceholderTone[] = ["blush", "rose", "sage", "burgundy", "ivory"];

export const TONE_COLORS: Record<PlaceholderTone, string> = {
  blush: "#ecc3bf",
  rose: "#c98b8b",
  sage: "#9aaa8c",
  burgundy: "#5c1a2b",
  ivory: "#efe4d2",
};

const SIZE: Record<Orientation, [number, number]> = {
  landscape: [1600, 1067],
  portrait: [1067, 1600],
  squarish: [1200, 1200],
};

export function colorBlur(color: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'><filter id='b'><feGaussianBlur stdDeviation='2'/></filter><rect width='8' height='8' fill='${color}' filter='url(#b)'/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export function placeholderPhoto(
  seed: number,
  orientation: Orientation = "portrait",
  tone?: PlaceholderTone,
  label = "Halaflora bloom",
): FlowerPhoto {
  const t = tone ?? TONES[seed % TONES.length];
  const [width, height] = SIZE[orientation];
  return {
    id: `placeholder-${label.replace(/\W+/g, "-").toLowerCase()}-${t}-${seed}`,
    src: "",
    width,
    height,
    alt: `${label} — illustrated placeholder`,
    color: TONE_COLORS[t],
    blurDataURL: colorBlur(TONE_COLORS[t]),
    credit: null,
    link: null,
    placeholder: true,
    tone: t,
  };
}
