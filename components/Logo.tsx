import { WORDMARK_BOX, WORDMARK_GLYPHS } from "@/lib/logo-paths";

/** Line-art bloom: ten petals (two whorls) around a small centre, in a 48×48 box. */
export const OUTER_PETAL = "M24 24C18.5 19.5 18.2 10.5 24 3.5C29.8 10.5 29.5 19.5 24 24Z";
export const INNER_PETAL = "M24 24C21.4 21.6 21.2 17 24 13.2C26.8 17 26.6 21.6 24 24Z";

export const MARK_PETALS = [
  ...[0, 72, 144, 216, 288].map((a) => ({ d: OUTER_PETAL, angle: a })),
  ...[36, 108, 180, 252, 324].map((a) => ({ d: INNER_PETAL, angle: a })),
];

// Lockup geometry: mark on the left, wordmark baseline to its right.
export const LOCKUP = { width: 428, height: 108, markScale: 4 / 3, markY: 14, textX: 82, baseline: 76 } as const;

export function LogoMark({ className, strokeWidth = 1 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" className={className} aria-hidden="true">
      {MARK_PETALS.map((p) => (
        <path key={p.angle} d={p.d} transform={`rotate(${p.angle} 24 24)`} />
      ))}
      <circle cx="24" cy="24" r="1.5" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  /** "full" = mark + wordmark, "wordmark" = text only. */
  variant?: "full" | "wordmark";
  title?: string;
}

export function Logo({ className, variant = "full", title = "Halaflora" }: LogoProps) {
  if (variant === "wordmark") {
    const b = WORDMARK_BOX;
    return (
      <svg viewBox={`${b.x} ${b.y} ${b.width} ${b.height}`} fill="currentColor" role="img" aria-label={title} className={className}>
        {WORDMARK_GLYPHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    );
  }

  const L = LOCKUP;
  return (
    <svg viewBox={`0 0 ${L.width} ${L.height}`} role="img" aria-label={title} className={className}>
      <g transform={`translate(0 ${L.markY}) scale(${L.markScale})`} fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round" strokeLinecap="round">
        {MARK_PETALS.map((p) => (
          <path key={p.angle} d={p.d} transform={`rotate(${p.angle} 24 24)`} />
        ))}
        <circle cx="24" cy="24" r="1.5" />
      </g>
      <g transform={`translate(${L.textX} ${L.baseline})`} fill="currentColor">
        {WORDMARK_GLYPHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}
