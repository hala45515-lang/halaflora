import { OG_SIZE, renderOg } from "@/lib/og";

export const alt = "Contact Halaflora";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOg("Let's talk flowers", "Contact");
}
