"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { FlowerHead, FlowerIcon, tint, type FlowerKind } from "../FlowerArt";
import { money, useCart } from "../CartProvider";
import { SectionHeading, Reveal } from "../Reveal";
import { r2 } from "@/lib/svg";
import { FLOWER_TYPES, type FlowerType } from "@/lib/products";
import { closestPhoto } from "@/lib/color";
import type { FlowerPhoto } from "@/lib/types";
import { EmptyState, FlowerChips, FlowerThumb, PhotoCredit, PhotoStage, Preloader, WrapBand, type ChipData } from "./builder-photos";

const FLOWER_META: Record<FlowerType, { kind: FlowerKind; price: number; scale: number }> = {
  rose: { kind: "rose", price: 4.5, scale: 1 },
  peony: { kind: "peony", price: 8, scale: 1.12 },
  tulip: { kind: "tulip", price: 3, scale: 0.9 },
  ranunculus: { kind: "ranunculus", price: 4, scale: 0.92 },
  wildflower: { kind: "wildflower", price: 2.5, scale: 0.72 },
  dried: { kind: "dried", price: 3.5, scale: 0.95 },
};

const PALETTES = [
  { id: "blush", label: "Blush", colors: ["#f2c4c1", "#e59aa4", "#f9dcd8"] },
  { id: "ivory", label: "Ivory", colors: ["#f8f0e2", "#e9d9bd", "#fffaf0"] },
  { id: "burgundy", label: "Burgundy", colors: ["#8a2c45", "#5c1a2b", "#b04c66"] },
  { id: "peach", label: "Peach", colors: ["#f5b996", "#ee9a78", "#fad7bf"] },
  { id: "meadow", label: "Meadow", colors: ["#d9c6ef", "#f6e08f", "#fbf4e8"] },
] as const;

/** Average photo colour each colour story is matched against. */
const PALETTE_TARGET: Record<string, string> = { blush: "#f2c4c1", ivory: "#f8f0e2", burgundy: "#7a2a3d", peach: "#f5b996", meadow: "#c9b6e4" };

const DRIED = ["#c9a77c", "#b58a5e", "#e6d3b3"];

const WRAPS = [
  { id: "kraft", label: "Kraft paper", price: 0, fill: "#cfae85", front: "#dcc096" },
  { id: "blush", label: "Blush tissue", price: 4, fill: "#f0bdbb", front: "#f7d3d0" },
  { id: "linen", label: "Ivory linen", price: 8, fill: "#e6dcc8", front: "#f3ecdc" },
  { id: "silk", label: "Burgundy silk", price: 12, fill: "#6c2236", front: "#843049" },
] as const;

const BASE_FEE = 12;
const MAX_STEMS = 24;
const MIN_STEMS = 5;

type Counts = Record<FlowerType, number>;

/** Deterministic dome layout (golden-angle spiral). */
function layout(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const r = 118 * Math.sqrt((i + 0.4) / Math.max(n, 6));
    const a = i * 2.39996;
    return { x: r2(200 + Math.cos(a) * r * 1.05), y: r2(205 + Math.sin(a) * r * 0.82), r: r2(r) };
  });
}

function interleave(counts: Counts): FlowerType[] {
  const pool = (Object.entries(counts) as [FlowerType, number][]).flatMap(([k, n]) => Array<FlowerType>(n).fill(k));
  // Round-robin so kinds mix instead of clumping.
  const byKind = (Object.keys(counts) as FlowerType[]).map((k) => pool.filter((p) => p === k)).filter((a) => a.length);
  const out: FlowerType[] = [];
  for (let i = 0; byKind.some((a) => a[i]); i++) byKind.forEach((a) => a[i] && out.push(a[i]));
  return out;
}

const LEAVES = Array.from({ length: 9 }, (_, i) => ({ a: -88 + i * 22, len: 150 + (i % 3) * 14 }));

function Preview({ counts, palette, wrap }: { counts: Counts; palette: (typeof PALETTES)[number]; wrap: (typeof WRAPS)[number] }) {
  const order = useMemo(() => interleave(counts), [counts]);
  const pos = useMemo(() => layout(order.length), [order.length]);
  const size = r2(Math.max(0.6, 1.05 - order.length * 0.02));
  // Centre-most heads are drawn last (on top).
  const items = order.map((k, i) => ({ k, i, p: pos[i] })).reverse();
  const empty = order.length === 0;

  return (
    <svg viewBox="0 0 400 540" role="img" aria-label={empty ? "An empty bouquet" : `Bouquet preview with ${order.length} stems in ${palette.label} wrapped in ${wrap.label}`} className="h-full w-full">
      <defs>
        <radialGradient id="halo" cx="50%" cy="42%" r="55%">
          <stop offset="0" stopColor="#fff" stopOpacity=".75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="230" rx="190" ry="210" fill="url(#halo)" />

      {/* greenery */}
      <g fill="#7f946f" stroke="#566a4e" strokeWidth=".8">
        {LEAVES.map((l, i) => (
          <motion.path
            key={i}
            d="M0 0C-16-44-10-96 0-130C10-96 16-44 0 0Z"
            transform={`translate(200 400) rotate(${l.a}) scale(${r2(l.len / 130)})`}
            fill={i % 2 ? "#8ea47d" : "#6f8662"}
            initial={{ opacity: 0 }}
            animate={{ opacity: empty ? 0.35 : 1 }}
          />
        ))}
      </g>

      {/* wrap (back) */}
      <path d="M200 528L78 292Q200 322 322 292Z" fill={wrap.fill} stroke={tint(wrap.fill, -0.25)} strokeWidth="1" strokeLinejoin="round" />

      {/* stems */}
      <g stroke="#566a4e" strokeWidth="2.2" strokeLinecap="round" fill="none">
        {items.map(({ i, p }) => (
          <motion.path key={i} d={`M200 430Q${r2((200 + p.x) / 2)} ${r2((430 + p.y) / 2 + 20)} ${p.x} ${p.y}`} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
        ))}
      </g>

      {/* heads */}
      <AnimatePresence>
        {items.map(({ k, i, p }) => {
          const meta = FLOWER_META[k];
          const base = k === "dried" ? DRIED : palette.colors.map((c, ci) => (ci === 0 && i % 3 === 1 ? tint(c, 0.1) : ci === 0 && i % 3 === 2 ? tint(c, -0.08) : c));
          return (
            <motion.g
              key={`${k}-${i}`}
              initial={{ x: 200, y: 400, scale: 0, opacity: 0 }}
              animate={{ x: p.x, y: p.y, scale: r2(size * meta.scale * 1.3), opacity: 1 }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.25 } }}
              transition={{ type: "spring", stiffness: 140, damping: 16, delay: Math.min(i * 0.015, 0.2) }}
            >
              <g transform={`rotate(${(i * 53) % 360})`}>
                <FlowerHead kind={k} colors={base} />
              </g>
            </motion.g>
          );
        })}
      </AnimatePresence>

      {/* wrap (front) + ribbon */}
      <path d="M200 528L104 346Q200 380 296 346Z" fill={wrap.front} stroke={tint(wrap.fill, -0.25)} strokeWidth="1" strokeLinejoin="round" />
      <path d="M200 528L200 372M200 528L150 368M200 528L250 368" stroke={tint(wrap.fill, -0.18)} strokeWidth=".8" fill="none" opacity=".7" />
      <g transform="translate(200 370)">
        <path d="M0 0C-26-16-40-4-30 8C-24 14-8 8 0 0ZM0 0C26-16 40-4 30 8C24 14 8 8 0 0Z" fill="#5c1a2b" />
        <path d="M-4 6L-18 40L-8 34L0 44L2 10ZM4 6L18 40L8 34L0 44Z" fill="#7a2a3d" />
        <circle r="5.5" fill="#3a0f1b" />
      </g>
    </svg>
  );
}

function Stepper({ label, value, onChange, disabled }: { label: string; value: number; onChange: (n: number) => void; disabled: boolean }) {
  return (
    <div className="flex items-center rounded-full border border-burgundy/25 bg-ivory text-burgundy">
      <button type="button" aria-label={`Fewer ${label}`} onClick={() => onChange(value - 1)} disabled={value === 0} className="h-9 w-9 text-lg leading-none disabled:opacity-30">−</button>
      <span className="w-7 text-center text-sm tabular-nums" aria-live="polite">{value}</span>
      <button type="button" aria-label={`More ${label}`} onClick={() => onChange(value + 1)} disabled={disabled} className="h-9 w-9 text-lg leading-none disabled:opacity-30">+</button>
    </div>
  );
}

export function Builder({ pools }: { pools: Record<FlowerType, FlowerPhoto[]> }) {
  const { add } = useCart();
  const [counts, setCounts] = useState<Counts>({ rose: 3, peony: 2, tulip: 0, ranunculus: 3, wildflower: 0, dried: 0 });
  const [paletteId, setPaletteId] = useState<(typeof PALETTES)[number]["id"]>("blush");
  const [wrapId, setWrapId] = useState<(typeof WRAPS)[number]["id"]>("blush");
  const [note, setNote] = useState("");
  const [failed, setFailed] = useState<string[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const near = useInView(frameRef, { once: true, margin: "500px" });

  const palette = PALETTES.find((p) => p.id === paletteId)!;
  const wrap = WRAPS.find((w) => w.id === wrapId)!;
  const stems = Object.values(counts).reduce((a, b) => a + b, 0);
  const flowersCost = (Object.keys(counts) as FlowerType[]).reduce((n, k) => n + counts[k] * FLOWER_META[k].price, 0);
  const total = stems ? flowersCost + wrap.price + BASE_FEE : 0;
  const ok = stems >= MIN_STEMS;

  // Real photos only: placeholders (no key / rate limit) and photos that failed to load are skipped.
  // Each pool's first photo is the option-card thumbnail; the rest feed the preview and chips,
  // so the same photo is never on screen twice inside the builder either.
  const thumbOf = (t: FlowerType) => pools[t].find((p) => !p.placeholder) ?? null;
  const usable = (t: FlowerType) => pools[t].filter((p) => !p.placeholder && !failed.includes(p.id) && p.id !== thumbOf(t)?.id);
  const types = Object.keys(counts) as FlowerType[];
  const dominant = types.reduce<FlowerType | null>((best, t) => (counts[t] > (best ? counts[best] : 0) ? t : best), null);
  const target = dominant ? closestPhoto(usable(dominant), PALETTE_TARGET[paletteId]) : null;
  const chips: ChipData[] = types.filter((t) => counts[t]).map((t) => ({ id: t, label: FLOWER_TYPES.find((f) => f.id === t)!.label, count: counts[t], photo: closestPhoto(usable(t).filter((p) => !(t === dominant && p.id === target?.id)), PALETTE_TARGET[paletteId]) }));
  const preload = near && dominant ? PALETTES.map((pl) => closestPhoto(usable(dominant), PALETTE_TARGET[pl.id])).filter((p): p is FlowerPhoto => !!p && p.id !== target?.id) : [];

  const set = (k: FlowerType, n: number) => setCounts((c) => ({ ...c, [k]: Math.max(0, Math.min(n, MAX_STEMS - (stems - c[k]))) }));

  const summary = (Object.keys(counts) as FlowerType[]).filter((k) => counts[k]).map((k) => `${counts[k]} ${FLOWER_TYPES.find((f) => f.id === k)!.label.toLowerCase()}`).join(", ");

  const addToBag = () => {
    const id = `custom-${paletteId}-${wrapId}-${(Object.keys(counts) as FlowerType[]).map((k) => counts[k]).join("")}`;
    add({ id, name: "Your bespoke bouquet", price: total, detail: `${summary} · ${palette.label} · ${wrap.label}${note ? ` · “${note}”` : ""}` });
  };

  return (
    <section id="builder" aria-labelledby="builder-title" className="relative overflow-hidden bg-blush/50 py-24 sm:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="mb-14 max-w-3xl">
          <div id="builder-title"><SectionHeading eyebrow="Build your bouquet" title="Design it, stem by stem." italic={["stem"]} /></div>
          <Reveal delay={0.2}><p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink/70 sm:text-base">Choose your flowers, a colour story and the wrapping. Watch it come together, then we&apos;ll hand-tie exactly what you see.</p></Reveal>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,1fr)] lg:gap-16">
          {/* Live preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div ref={frameRef} className="group relative mx-auto aspect-[400/540] w-full max-w-[460px] rounded-t-[999px] rounded-b-[2rem] bg-gradient-to-b from-ivory to-cream shadow-[0_40px_80px_-40px_rgba(92,26,43,0.4)] ring-1 ring-burgundy/10">
              {stems === 0 ? (
                <EmptyState />
              ) : target ? (
                <div className="absolute inset-0 overflow-hidden rounded-t-[999px] rounded-b-[2rem]">
                  <PhotoStage target={target} onFail={(id) => setFailed((f) => (f.includes(id) ? f : [...f, id]))} />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wine/25 via-transparent to-transparent" />
                  <WrapBand wrap={wrap} />
                </div>
              ) : (
                // No usable photos (no key, rate limit, or load failure): the illustrated bouquet.
                <div className="absolute inset-0 px-6 pt-10 pb-4"><Preview counts={counts} palette={palette} wrap={wrap} /></div>
              )}
              {preload.length > 0 && <Preloader photos={preload} />}
            </div>
            <FlowerChips chips={chips} stems={stems} />
            {stems > 0 && target && <PhotoCredit photo={target} className="mt-2 text-center text-ink/45" />}
          </div>

          {/* Controls */}
          <div className="space-y-10">
            <fieldset>
              <legend className="mb-4 font-serif text-2xl text-burgundy"><span className="mr-2 text-rose italic">1.</span>Pick your flowers</legend>
              <ul className="grid gap-3 sm:grid-cols-2">
                {FLOWER_TYPES.map((f) => {
                  const m = FLOWER_META[f.id];
                  return (
                    <li key={f.id} className={`flex items-center gap-3 rounded-2xl border p-3 transition-colors ${counts[f.id] ? "border-burgundy/40 bg-ivory" : "border-burgundy/10 bg-ivory/50"}`}>
                      <FlowerThumb photo={thumbOf(f.id)} fallback={<FlowerIcon kind={m.kind} colors={f.id === "dried" ? DRIED : [...palette.colors]} className="h-14 w-14 shrink-0" />} />
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-xl leading-tight text-burgundy">{f.label}</p>
                        <p className="text-xs text-ink/60">{money(m.price)} / stem</p>
                      </div>
                      <Stepper label={f.label} value={counts[f.id]} onChange={(n) => set(f.id, n)} disabled={stems >= MAX_STEMS} />
                    </li>
                  );
                })}
              </ul>
            </fieldset>

            <fieldset>
              <legend className="mb-4 font-serif text-2xl text-burgundy"><span className="mr-2 text-rose italic">2.</span>Choose a colour story</legend>
              <div className="flex flex-wrap gap-3">
                {PALETTES.map((p) => (
                  <label key={p.id} className="cursor-pointer">
                    <input type="radio" name="palette" value={p.id} checked={paletteId === p.id} onChange={() => setPaletteId(p.id)} className="peer sr-only" />
                    <span className="flex items-center gap-3 rounded-full border border-burgundy/15 bg-ivory py-2 pr-5 pl-2 text-sm transition-colors peer-checked:border-burgundy peer-checked:bg-burgundy peer-checked:text-ivory peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rose">
                      <span className="flex -space-x-2" aria-hidden="true">{p.colors.map((c) => <span key={c} className="h-6 w-6 rounded-full ring-2 ring-ivory" style={{ background: c }} />)}</span>
                      {p.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-4 font-serif text-2xl text-burgundy"><span className="mr-2 text-rose italic">3.</span>Select the wrapping</legend>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {WRAPS.map((w) => (
                  <label key={w.id} className="cursor-pointer">
                    <input type="radio" name="wrap" value={w.id} checked={wrapId === w.id} onChange={() => setWrapId(w.id)} className="peer sr-only" />
                    <span className="flex h-full flex-col items-center gap-2 rounded-2xl border border-burgundy/15 bg-ivory p-3 text-center text-sm transition-colors peer-checked:border-burgundy peer-checked:ring-1 peer-checked:ring-burgundy peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rose">
                      <span aria-hidden="true" className="h-10 w-10 rounded-t-full rounded-b-md ring-1 ring-black/10" style={{ background: `linear-gradient(135deg, ${w.front}, ${w.fill})` }} />
                      <span className="leading-tight">{w.label}</span>
                      <span className="text-xs text-ink/55">{w.price ? `+${money(w.price)}` : "Included"}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="note" className="mb-3 block font-serif text-2xl text-burgundy"><span className="mr-2 text-rose italic">4.</span>Add a note <span className="text-base text-ink/50">(optional)</span></label>
              <input id="note" value={note} onChange={(e) => setNote(e.target.value.slice(0, 80))} placeholder="Happy birthday, Mama…" className="w-full rounded-full border border-burgundy/15 bg-ivory px-6 py-3.5 text-sm placeholder:text-ink/40" />
            </div>

            <div className="rounded-3xl bg-burgundy p-6 text-ivory sm:p-8">
              <dl className="space-y-2 text-sm text-ivory/80">
                <div className="flex justify-between"><dt>Flowers ({stems})</dt><dd>{money(flowersCost)}</dd></div>
                <div className="flex justify-between"><dt>{wrap.label}</dt><dd>{wrap.price ? money(wrap.price) : "Included"}</dd></div>
                <div className="flex justify-between"><dt>Hand-tying</dt><dd>{stems ? money(BASE_FEE) : money(0)}</dd></div>
              </dl>
              <div className="mt-5 flex items-end justify-between border-t border-ivory/20 pt-5">
                <span className="text-sm tracking-[0.14em] uppercase text-blush">Total</span>
                <motion.span key={total} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-serif text-5xl leading-none">{money(total)}</motion.span>
              </div>
              <button type="button" disabled={!ok} onClick={addToBag} data-cursor="petal" className="mt-6 w-full rounded-full bg-ivory py-4 text-sm font-medium tracking-[0.16em] text-burgundy uppercase transition-colors hover:bg-blush disabled:cursor-not-allowed disabled:opacity-50">
                {ok ? "Add to bag" : `Add ${MIN_STEMS - stems} more ${MIN_STEMS - stems === 1 ? "stem" : "stems"}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
