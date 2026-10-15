export type PoolKey = "roses" | "peony" | "tulips" | "wild" | "arrangement" | "ranunculus" | "dried" | "lavender" | "hydrangea" | "daisy" | "pampas";
export type Occasion = "birthday" | "wedding" | "love" | "sympathy" | "congrats";
export type Collection = "romantic" | "wild" | "minimal" | "seasonal";
export type ColorName = "blush" | "ivory" | "burgundy" | "peach" | "meadow" | "natural";
export type FlowerType = "rose" | "peony" | "tulip" | "ranunculus" | "wildflower" | "dried";

export interface Product {
  slug: string;
  name: string;
  price: number;
  tagline: string;
  description: string;
  flowers: FlowerType[];
  color: ColorName;
  occasions: Occasion[];
  collection: Collection;
  bestseller?: boolean;
  /** Which photo pool supplies this product's imagery. */
  pool: PoolKey;
  /** Contents shown on the detail page. */
  includes: string[];
}

export const POOL_QUERIES: Record<PoolKey, string> = {
  roses: "rose bouquet",
  peony: "peony",
  tulips: "tulips",
  wild: "wildflowers",
  arrangement: "flower arrangement",
  ranunculus: "ranunculus",
  dried: "dried flowers",
  lavender: "lavender",
  hydrangea: "hydrangea",
  daisy: "white daisy flower close up",
  pampas: "pampas grass",
};

export const FLOWER_POOL: Record<FlowerType, PoolKey> = {
  rose: "roses",
  peony: "peony",
  tulip: "tulips",
  ranunculus: "ranunculus",
  wildflower: "wild",
  dried: "dried",
};

export const OCCASIONS: { id: Occasion; label: string }[] = [
  { id: "birthday", label: "Birthday" },
  { id: "wedding", label: "Wedding" },
  { id: "love", label: "Love" },
  { id: "sympathy", label: "Sympathy" },
  { id: "congrats", label: "Congrats" },
];

export const COLORS: { id: ColorName; label: string; swatch: string }[] = [
  { id: "blush", label: "Blush", swatch: "#f2c9c6" },
  { id: "ivory", label: "Ivory", swatch: "#f3eadb" },
  { id: "burgundy", label: "Burgundy", swatch: "#7d2a3f" },
  { id: "peach", label: "Peach", swatch: "#f2a98b" },
  { id: "meadow", label: "Meadow mix", swatch: "#c9b6e4" },
  { id: "natural", label: "Natural", swatch: "#c9a77c" },
];

export const FLOWER_TYPES: { id: FlowerType; label: string }[] = [
  { id: "rose", label: "Roses" },
  { id: "peony", label: "Peonies" },
  { id: "tulip", label: "Tulips" },
  { id: "ranunculus", label: "Ranunculus" },
  { id: "wildflower", label: "Wildflowers" },
  { id: "dried", label: "Dried flowers" },
];

export const COLLECTIONS: { id: Collection; title: string; blurb: string; pool: PoolKey }[] = [
  { id: "romantic", title: "Romantic", blurb: "Blush roses, ruffled peonies and the softest ribbon. Made for saying it with flowers.", pool: "roses" },
  { id: "wild", title: "Wild & Free", blurb: "Loose, windswept armfuls that look like they were picked on the way to you.", pool: "wild" },
  { id: "minimal", title: "Minimal", blurb: "Few stems, quiet colour, lots of air. Sculptural arrangements for calm rooms.", pool: "tulips" },
  { id: "seasonal", title: "Seasonal", blurb: "Whatever is at its most beautiful this week, arranged while it's still fresh.", pool: "arrangement" },
];

export const PRODUCTS: Product[] = [
  {
    slug: "blush-reverie", name: "Blush Reverie", price: 78, tagline: "Peonies and roses in powder pink",
    description: "A cloud of blush peonies and garden roses, tied by hand and wrapped in soft tissue. It is the bouquet people describe as 'a hug you can look at'.",
    flowers: ["peony", "rose"], color: "blush", occasions: ["love", "birthday"], collection: "romantic", bestseller: true, pool: "peony",
    includes: ["5 blush peonies", "6 garden roses", "Eucalyptus & seasonal greens", "Silk ribbon"],
  },
  {
    slug: "velvet-promise", name: "Velvet Promise", price: 92, tagline: "Deep red roses, long-stemmed",
    description: "Twelve velvety roses in deep burgundy, trimmed and tied with a wine-coloured ribbon. Classic, unhurried and unmistakably romantic.",
    flowers: ["rose"], color: "burgundy", occasions: ["love"], collection: "romantic", bestseller: true, pool: "roses",
    includes: ["12 burgundy roses", "Ruscus greens", "Silk ribbon", "Handwritten note"],
  },
  {
    slug: "ivory-hours", name: "Ivory Hours", price: 110, tagline: "Ranunculus and white roses",
    description: "Layered ranunculus and cream roses in the quietest shades of ivory. A favourite for ceremonies, tables and brides' arms.",
    flowers: ["ranunculus", "rose"], color: "ivory", occasions: ["wedding"], collection: "minimal", bestseller: true, pool: "ranunculus",
    includes: ["8 ivory ranunculus", "6 cream roses", "Olive branches", "Linen wrap"],
  },
  {
    slug: "wild-meadow", name: "Wild Meadow", price: 64, tagline: "A loose, windswept armful",
    description: "Cornflowers, daisies and grasses gathered into a relaxed, just-picked bunch. No two are ever the same, which is rather the point.",
    flowers: ["wildflower"], color: "meadow", occasions: ["birthday", "congrats"], collection: "wild", bestseller: true, pool: "wild",
    includes: ["Seasonal wildflowers", "Meadow grasses", "Kraft & twine wrap"],
  },
  {
    slug: "little-tulip-cloud", name: "Little Tulip Cloud", price: 54, tagline: "Ten blush tulips, softly tied",
    description: "Ten tulips that keep curving and leaning for days. Simple, sweet and exactly right for a 'well done'.",
    flowers: ["tulip"], color: "blush", occasions: ["congrats", "birthday"], collection: "minimal", pool: "tulips",
    includes: ["10 tulips", "Paper wrap", "Twine"],
  },
  {
    slug: "quiet-tribute", name: "Quiet Tribute", price: 88, tagline: "White blooms for gentle moments",
    description: "White roses, ranunculus and soft greenery, arranged calmly and without fuss. A tender way to say what's hard to say.",
    flowers: ["rose", "ranunculus"], color: "ivory", occasions: ["sympathy"], collection: "minimal", pool: "arrangement",
    includes: ["White roses", "Ivory ranunculus", "Soft greenery", "Handwritten note"],
  },
  {
    slug: "peony-season", name: "Peony Season", price: 124, tagline: "An armful of full, fragrant peonies",
    description: "Ten generous peonies, as fragrant as they are fleeting. Available while the season lasts, and worth every petal.",
    flowers: ["peony"], color: "blush", occasions: ["wedding", "love"], collection: "seasonal", pool: "peony",
    includes: ["10 peonies", "Garden greens", "Silk ribbon"],
  },
  {
    slug: "golden-hour", name: "Golden Hour", price: 68, tagline: "Peach ranunculus and tulips",
    description: "Warm apricot and peach, like the last light of a good day. Cheerful without being loud.",
    flowers: ["ranunculus", "tulip"], color: "peach", occasions: ["congrats", "birthday"], collection: "seasonal", pool: "ranunculus",
    includes: ["6 peach ranunculus", "6 tulips", "Seasonal greens"],
  },
  {
    slug: "dried-dreamer", name: "Dried Dreamer", price: 72, tagline: "Everlasting, in soft earth tones",
    description: "Bunny tails, pampas and dried roses in warm neutrals. It never wilts, so it keeps saying thank you for months.",
    flowers: ["dried"], color: "natural", occasions: ["birthday", "love"], collection: "seasonal", pool: "dried",
    includes: ["Pampas grass", "Bunny tails", "Dried roses", "Kraft wrap"],
  },
  {
    slug: "garden-confession", name: "Garden Confession", price: 84, tagline: "Roses and wildflowers, tangled",
    description: "Pink roses woven through wildflowers and trailing greens. Romantic, but with its hair down.",
    flowers: ["rose", "wildflower"], color: "blush", occasions: ["love", "birthday"], collection: "wild", pool: "wild",
    includes: ["6 roses", "Seasonal wildflowers", "Trailing greens"],
  },
  {
    slug: "sage-and-cream", name: "Sage & Cream", price: 96, tagline: "Ranunculus with soft greenery",
    description: "Cream ranunculus nested in layers of sage and eucalyptus. Fresh and airy, and gentle enough for any room.",
    flowers: ["ranunculus"], color: "ivory", occasions: ["wedding", "sympathy"], collection: "minimal", pool: "arrangement",
    includes: ["10 cream ranunculus", "Eucalyptus", "Sage greens", "Linen wrap"],
  },
  {
    slug: "burgundy-waltz", name: "Burgundy Waltz", price: 118, tagline: "Dark peonies and ranunculus",
    description: "Wine-dark peonies and ranunculus with deep, dramatic foliage. Moody, lush and made to be remembered.",
    flowers: ["peony", "ranunculus"], color: "burgundy", occasions: ["wedding", "congrats"], collection: "seasonal", pool: "roses",
    includes: ["6 burgundy peonies", "6 ranunculus", "Dark foliage", "Silk ribbon"],
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const BESTSELLERS = PRODUCTS.filter((p) => p.bestseller);
