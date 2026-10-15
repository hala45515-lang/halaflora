import type { FlowerPhoto } from "@/lib/types";

/** Unsplash attribution: "Photo by X on Unsplash", both linked. Renders nothing for placeholders. */
export function PhotoCredit({ photo, className = "" }: { photo: FlowerPhoto; className?: string }) {
  if (!photo.credit) return null;
  return (
    <p className={`text-[11px] tracking-wide ${className}`}>
      Photo by{" "}
      <a href={photo.credit.url} target="_blank" rel="noopener noreferrer" className="underline decoration-current/40 underline-offset-2 hover:decoration-current">
        {photo.credit.name}
      </a>{" "}
      on{" "}
      <a href="https://unsplash.com/?utm_source=halaflora&utm_medium=referral" target="_blank" rel="noopener noreferrer" className="underline decoration-current/40 underline-offset-2 hover:decoration-current">
        Unsplash
      </a>
    </p>
  );
}
