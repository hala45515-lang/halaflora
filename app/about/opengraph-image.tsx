import { OG_SIZE, renderOg } from "@/lib/og";

export const alt = "About Halaflora — Hala means sweetness";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOg("Hala means sweetness", "Our Story");
}
