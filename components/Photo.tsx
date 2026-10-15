import type { FlowerPhoto } from "@/lib/types";
import { FlowerImage } from "./FlowerImage";

/**
 * A photo plus its Unsplash credit chip (shown on hover/focus, always on touch).
 * The parent must be `relative group`. Keep this chip outside any wrapping <a>.
 */
export function Photo({ photo, sizes, seed, priority, className = "", imgClassName = "", credit = true }: { photo: FlowerPhoto; sizes: string; seed?: number; priority?: boolean; className?: string; imgClassName?: string; credit?: boolean }) {
  return (
    <>
      <div className={`absolute inset-0 ${className}`}>
        <FlowerImage photo={photo} sizes={sizes} seed={seed} priority={priority} className={imgClassName} />
      </div>
      {credit && photo.credit && (
        <p className="absolute bottom-2 left-2 z-20 max-w-[calc(100%-1rem)] truncate rounded-full bg-wine/55 px-2.5 py-1 text-[10px] tracking-wide text-ivory opacity-0 backdrop-blur-sm transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-90">
          Photo by{" "}
          <a href={photo.credit.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            {photo.credit.name}
          </a>{" "}
          on{" "}
          <a href="https://unsplash.com/?utm_source=halaflora&utm_medium=referral" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            Unsplash
          </a>
        </p>
      )}
    </>
  );
}
