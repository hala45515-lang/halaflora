import { OG_SIZE, renderOg } from "@/lib/og";

export const alt = "Halaflora — The Sweetness of Every Bloom";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOg("The Sweetness of Every Bloom");
}
