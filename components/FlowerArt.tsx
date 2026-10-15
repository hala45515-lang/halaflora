import type { ReactNode } from "react";
import { r2 } from "@/lib/svg";

export type FlowerKind = "rose" | "peony" | "tulip" | "ranunculus" | "wildflower" | "dried" | "lavender" | "hydrangea";

/** Blend a hex colour toward white (t>0) or black (t<0). */
export function tint(hex: string, t: number): string {
  const n = parseInt(hex.slice(1), 16);
  const target = t < 0 ? 0 : 255;
  const k = Math.abs(t);
  const f = (c: number) => Math.round(c + (target - c) * k);
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

const around = (n: number, r: number, offset = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = offset + (360 / n) * i;
    return { a: r2(a), x: r2(Math.sin((a * Math.PI) / 180) * r), y: r2(-Math.cos((a * Math.PI) / 180) * r) };
  });

/** Flower heads drawn in a 100×100 box centred on (0,0). `colors` = [main, accent, light]. */
export function FlowerHead({ kind, colors }: { kind: FlowerKind; colors: string[] }): ReactNode {
  const [c0, c1 = c0, c2 = c0] = colors;
  const line = tint(c0, -0.35);
  const sw = 0.9;

  switch (kind) {
    case "rose":
      return (
        <g stroke={line} strokeWidth={sw} strokeLinejoin="round">
          <circle r="34" fill={tint(c0, -0.12)} />
          {around(5, 21).map((p) => <circle key={p.a} cx={p.x} cy={p.y} r="17" fill={c0} />)}
          {around(5, 12, 36).map((p) => <circle key={p.a} cx={p.x} cy={p.y} r="12.5" fill={tint(c2, 0.05)} />)}
          <circle r="8.5" fill={c1} />
          <path d="M0-6a6 6 0 1 1-6 6a4 4 0 1 1 4-4" fill="none" />
        </g>
      );
    case "peony":
      return (
        <g stroke={line} strokeWidth={sw}>
          {around(9, 22).map((p) => <ellipse key={p.a} cx={p.x} cy={p.y} rx="15" ry="19" transform={`rotate(${p.a} ${p.x} ${p.y})`} fill={tint(c0, -0.06)} />)}
          {around(8, 14, 22).map((p) => <ellipse key={p.a} cx={p.x} cy={p.y} rx="12" ry="15" transform={`rotate(${p.a} ${p.x} ${p.y})`} fill={c0} />)}
          {around(6, 7, 10).map((p) => <ellipse key={p.a} cx={p.x} cy={p.y} rx="8" ry="10" transform={`rotate(${p.a} ${p.x} ${p.y})`} fill={tint(c2, 0.1)} />)}
          <circle r="4.5" fill={c1} />
        </g>
      );
    case "tulip":
      return (
        <g stroke={line} strokeWidth={sw} strokeLinejoin="round">
          <path d="M-27-24C-31 18-15 36 0 38C15 36 31 18 27-24L14-9L0-32L-14-9Z" fill={tint(c0, -0.06)} />
          <path d="M-13-7L0-32L13-7C15 18 8 33 0 35C-8 33-15 18-13-7Z" fill={c2} />
          <path d="M-27-24C-26 8-14 24 0 28C-12 14-14-6-14-9Z" fill={c0} opacity=".9" />
        </g>
      );
    case "ranunculus":
      return (
        <g stroke={line} strokeWidth={0.7}>
          {around(9, 25).map((p) => <circle key={p.a} cx={p.x} cy={p.y} r="12.5" fill={tint(c0, -0.04)} />)}
          {around(8, 17, 20).map((p) => <circle key={p.a} cx={p.x} cy={p.y} r="10" fill={c0} />)}
          {around(6, 10, 10).map((p) => <circle key={p.a} cx={p.x} cy={p.y} r="7.5" fill={tint(c2, 0.08)} />)}
          {around(4, 4.5, 45).map((p) => <circle key={p.a} cx={p.x} cy={p.y} r="4.5" fill={c1} />)}
        </g>
      );
    case "wildflower":
      return (
        <g stroke={tint(c0, -0.3)} strokeWidth={0.7}>
          {around(12, 19).map((p) => <ellipse key={p.a} cx={p.x} cy={p.y} rx="5.5" ry="15" transform={`rotate(${p.a} ${p.x} ${p.y})`} fill={c0} />)}
          <circle r="9" fill="#e2b341" stroke="#b98a22" />
          <circle r="4" fill="#b98a22" stroke="none" opacity=".5" />
        </g>
      );
    case "dried":
      return (
        <g fill="none" strokeLinecap="round">
          {Array.from({ length: 26 }, (_, i) => {
            const a = -62 + i * 4.8;
            const len = 38 + ((i * 7) % 9);
            const x = r2(Math.sin((a * Math.PI) / 180) * len);
            const y = r2(-Math.cos((a * Math.PI) / 180) * len + 12);
            return <path key={i} d={`M0 26Q${r2(x * 0.35)} ${r2(y * 0.3 + 6)} ${x} ${y}`} stroke={[c0, c1, c2][i % 3]} strokeWidth={i % 4 === 0 ? 3.2 : 1.8} opacity=".85" />;
          })}
        </g>
      );
    case "lavender":
      return (
        <g stroke={tint(c0, -0.3)} strokeWidth={0.6}>
          {Array.from({ length: 10 }, (_, i) => (
            <g key={i}>
              <ellipse cx={-5} cy={30 - i * 7} rx="4" ry="6.5" transform={`rotate(-24 -5 ${30 - i * 7})`} fill={i % 2 ? c0 : c1} />
              <ellipse cx={5} cy={27 - i * 7} rx="4" ry="6.5" transform={`rotate(24 5 ${27 - i * 7})`} fill={i % 2 ? c1 : c0} />
            </g>
          ))}
        </g>
      );
    case "hydrangea":
      return (
        <g stroke={tint(c0, -0.3)} strokeWidth={0.5}>
          {[...around(10, 30), ...around(7, 19, 12), ...around(3, 8, 40), { a: 0, x: 0, y: 0 }].map((p, i) => (
            <g key={i} transform={`translate(${p.x} ${p.y})`}>
              {around(4, 5, 45).map((q) => <circle key={q.a} cx={q.x} cy={q.y} r="5.6" fill={i % 3 ? c0 : c2} />)}
              <circle r="1.6" fill={c1} stroke="none" />
            </g>
          ))}
        </g>
      );
  }
}

/** Standalone icon version. */
export function FlowerIcon({ kind, colors, className }: { kind: FlowerKind; colors: string[]; className?: string }) {
  return (
    <svg viewBox="-50 -50 100 100" className={className} aria-hidden="true">
      <FlowerHead kind={kind} colors={colors} />
    </svg>
  );
}
