import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShopClient } from "@/components/ShopClient";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop Bouquets",
  description: "Browse Halaflora's hand-tied bouquets by flower, colour, occasion and price.",
};

export default async function ShopPage() {
  const products = await getCatalog();
  return (
    <>
      <Navbar />
      <main id="main" className="min-h-svh bg-ivory pt-32 sm:pt-40">
        <Suspense fallback={<div className="mx-auto h-[60svh] max-w-[1500px] px-5" aria-busy="true" />}>
          <ShopClient products={products} />
        </Suspense>
      </main>
      <Footer credits={products.map((p) => p.photos[0])} />
    </>
  );
}
