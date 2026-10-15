import { OUTER_PETAL } from "./Logo";
import type { PlaceholderTone } from "@/lib/types";

const PALETTE: Record<PlaceholderTone, { from: string; to: string; petal: string; glow: string; line: string }> = {
  blush: { from: "#f6e2dd", to: "#e7b8b3", petal: "#f8ece7", glow: "#ffffff", line: "#9a5560" },
  rose: { from: "#dcaaa8", to: "#b46f77", petal: "#efc9c6", glow: "#f6dcd8", line: "#5c1a2b" },
  sage: { from: "#d3dcc8", to: "#9aaa8c", petal: "#e8eee0", glow: "#f2f5ec", line: "#3f5239" },
  burgundy: { from: "#7a2a3d", to: "#3a0f1b", petal: "#a8556a", glow: "#c98b8b", line: "#f2d4ce" },
  ivory: { from: "#f7efe2", to: "#e6d8c3", petal: "#fbf6ec", glow: "#ffffff", line: "#8a6a5a" },
};

/** Soft illustrated stand-in for a photo: blurred colour fields + floating petals. */
export function PlaceholderArt({ tone, seed = 0, alt, className }: { tone: PlaceholderTone; seed?: number; alt: string; className?: string }) {
  const p = PALETTE[tone];
  const id = `ph-${tone}-${seed}`;
  const rot = (seed * 47) % 360;

  return (
    <svg viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice" role="img" aria-label={alt} className={className}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.from} />
          <stop offset="1" stopColor={p.to} />
        </linearGradient>
        <filter id={`${id}-b`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="46" />
        </filter>
      </defs>
      <rect width="800" height="1000" fill={`url(#${id}-g)`} />
      <g filter={`url(#${id}-b)`} opacity="0.8">
        <circle cx={220 + (seed % 3) * 80} cy="260" r="210" fill={p.glow} />
        <circle cx="620" cy={760 - (seed % 2) * 120} r="260" fill={p.petal} />
        <circle cx="120" cy="860" r="170" fill={p.from} />
      </g>
      <g transform={`translate(400 500) rotate(${rot}) scale(7.2) translate(-24 -24)`} fill={p.petal} fillOpacity="0.28" stroke={p.line} strokeOpacity="0.35" strokeWidth="0.25">
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} d={OUTER_PETAL} transform={`rotate(${a} 24 24)`} />
        ))}
      </g>
    </svg>
  );
}
