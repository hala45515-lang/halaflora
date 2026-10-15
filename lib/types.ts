export type PlaceholderTone = "blush" | "rose" | "sage" | "burgundy" | "ivory";

export interface PhotoCredit {
  name: string;
  /** Photographer profile on Unsplash (with UTM params). */
  url: string;
}

export interface FlowerPhoto {
  id: string;
  /** Remote image URL (empty for placeholders). */
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Dominant colour, used for the blur placeholder. */
  color: string;
  blurDataURL: string;
  credit: PhotoCredit | null;
  /** Photo page on Unsplash (with UTM params). */
  link: string | null;
  placeholder: boolean;
  tone: PlaceholderTone;
}

export type UnsplashColor =
  | "black_and_white" | "black" | "white" | "yellow" | "orange"
  | "red" | "purple" | "magenta" | "green" | "teal" | "blue";

export type Orientation = "landscape" | "portrait" | "squarish";

export interface PhotoQuery {
  query: string;
  orientation?: Orientation;
  /** Unsplash colour filter (pink flowers = "magenta"). */
  color?: UnsplashColor;
  /** How many photos to return. Missing ones are filled with placeholders. */
  count?: number;
  /** Tone used for placeholders if the API can't deliver. */
  tone?: PlaceholderTone;
}
