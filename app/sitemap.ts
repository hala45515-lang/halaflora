import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";
import { SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/shop", "/about", "/contact"].map((p) => ({ url: `${SITE_URL}${p}` }));
  const products = PRODUCTS.map((p) => ({ url: `${SITE_URL}/shop/${p.slug}` }));
  return [...pages, ...products];
}
