import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductDetail } from "@/components/ProductDetail";
import { getCatalog } from "@/lib/catalog";
import { PRODUCTS, getProduct } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return { title: p.name, description: `${p.name}: ${p.tagline}. ${p.description}` };
}

export default function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  return (
    <>
      <Navbar />
      <main id="main" className="min-h-svh bg-ivory pt-28 sm:pt-36">
        {/* params is request-time data, so it is read inside a Suspense boundary. */}
        <Suspense fallback={<div className="min-h-[70svh]" aria-busy="true" />}>
          <ProductContent params={params} />
        </Suspense>
      </main>
    </>
  );
}

async function ProductContent({ params }: { params: PageProps<"/shop/[slug]">["params"] }) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const product = catalog.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = catalog
    .filter((p) => p.slug !== slug)
    .map((p) => ({ p, score: (p.collection === product.collection ? 2 : 0) + p.occasions.filter((o) => product.occasions.includes(o)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.p);

  return (
    <>
      <ProductDetail product={product} related={related} />
      <Footer credits={[...product.photos, ...related.map((r) => r.photos[0])]} />
    </>
  );
}
