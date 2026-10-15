import { ImageResponse } from "next/og";
import { WORDMARK_GLYPHS } from "@/lib/logo-paths";
import { MARK_PETALS } from "@/components/Logo";

export const OG_SIZE = { width: 1200, height: 630 };

/** Branded Open Graph card shared by every page. */
export function renderOg(subtitle: string, kicker = "Boutique Floral Atelier") {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#faf5ec 0%,#f2d4ce 100%)", position: "relative" }}>
        <svg width="1100" height="700" viewBox="-250 -330 1200 700" style={{ position: "absolute", opacity: 0.35 }}>
          {MARK_PETALS.slice(0, 5).map((p) => (
            <path key={p.angle} d={p.d} transform={`translate(350 20) rotate(${p.angle}) scale(14) translate(-24 -24)`} fill="none" stroke="#c98b8b" strokeWidth="0.12" />
          ))}
        </svg>
        <svg width="820" height="250" viewBox="0 -74 342 104" fill="#5c1a2b">
          {WORDMARK_GLYPHS.map((d, i) => <path key={i} d={d} />)}
        </svg>
        <div style={{ display: "flex", marginTop: 34, fontSize: 34, letterSpacing: 10, color: "#c98b8b", textTransform: "uppercase" }}>{subtitle}</div>
        <div style={{ display: "flex", marginTop: 18, fontSize: 22, letterSpacing: 6, color: "#5c1a2b", opacity: 0.6, textTransform: "uppercase" }}>{kicker}</div>
      </div>
    ),
    OG_SIZE,
  );
}
