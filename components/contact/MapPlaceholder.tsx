import { LogoMark } from "../Logo";

/** Decorative, illustrated map. No external map API. */
export function MapPlaceholder({ lines }: { lines: readonly string[] }) {
  return (
    <figure className="relative overflow-hidden rounded-[2rem] ring-1 ring-burgundy/10">
      <svg viewBox="0 0 600 400" className="block h-auto w-full" role="img" aria-label="Illustrated map showing the Halaflora studio location" preserveAspectRatio="xMidYMid slice">
        <rect width="600" height="400" fill="#efe4d2" />
        {/* parks & water */}
        <path d="M-10 290C80 260 140 330 230 300S340 360 420 330 560 330 620 360V410H-10Z" fill="#d3dcc8" />
        <path d="M410 -10C440 60 520 70 540 130S600 200 620 190V-10Z" fill="#cbd9d6" />
        <rect x="70" y="60" width="120" height="80" rx="40" fill="#c9d3be" />
        {/* streets */}
        <g stroke="#faf5ec" strokeWidth="12" strokeLinecap="round" fill="none">
          <path d="M-10 180C120 170 220 200 330 190S520 170 610 200" />
          <path d="M120 -10C130 100 110 200 140 410" />
          <path d="M330 -10C340 80 320 220 350 410" />
          <path d="M-10 90L610 60" strokeWidth="8" />
          <path d="M-10 330L610 300" strokeWidth="8" />
        </g>
        <g stroke="#f3eadb" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M230 -10L240 410M470 -10L450 410M-10 250L610 240" />
          <path d="M-10 130L610 130" />
        </g>
        {/* radius ring */}
        <circle cx="330" cy="190" r="86" fill="#c98b8b" fillOpacity="0.12" stroke="#c98b8b" strokeOpacity="0.5" strokeDasharray="4 6" />
      </svg>
      {/* pin */}
      <div className="absolute top-[47.5%] left-[55%] -translate-x-1/2 -translate-y-full">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full rounded-br-none bg-burgundy text-blush shadow-[0_12px_24px_-8px_rgba(58,15,27,0.6)]" style={{ transform: "rotate(45deg)" }}>
          <LogoMark className="h-8 w-8 -rotate-45" strokeWidth={1} />
        </div>
      </div>
      <figcaption className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-4 rounded-2xl bg-ivory/90 px-5 py-3.5 backdrop-blur sm:right-auto sm:max-w-xs">
        <span><span className="block font-serif text-xl text-burgundy">The Halaflora studio</span><span className="block text-xs text-ink/60">{lines.join(", ")}</span></span>
      </figcaption>
    </figure>
  );
}
