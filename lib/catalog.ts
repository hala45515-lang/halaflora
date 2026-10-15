import { getBank } from "./bank";
import { PRODUCTS } from "./products";
import type { ProductWithPhotos } from "@/components/ProductCard";

/** Every product with its (cached) Unsplash photos. */
export async function getCatalog(): Promise<ProductWithPhotos[]> {
  const bank = await getBank();
  return PRODUCTS.map((p) => ({ ...p, photos: bank.productPhotos(p) }));
}
