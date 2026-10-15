"use client";

import { useState } from "react";
import Image from "next/image";
import type { FlowerPhoto } from "@/lib/types";
import { PlaceholderArt } from "./PlaceholderArt";

interface Props {
  photo: FlowerPhoto;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Used for placeholder variety. */
  seed?: number;
}

/**
 * Fills its (relatively positioned) parent. Real photo via next/image, or elegant placeholder art
 * (used when there is no photo, or when the image fails to load).
 */
export function FlowerImage({ photo, sizes, priority, className = "", seed = 0 }: Props) {
  const [failed, setFailed] = useState(false);

  if (photo.placeholder || failed) {
    return <PlaceholderArt tone={photo.tone} seed={seed} alt={photo.alt} className={`absolute inset-0 h-full w-full ${className}`} />;
  }
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={photo.blurDataURL}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
