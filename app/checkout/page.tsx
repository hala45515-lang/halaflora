import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Halaflora order. Demo checkout only; no payment is processed.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="min-h-svh bg-ivory px-5 pt-28 pb-24 sm:px-8 sm:pt-36 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <CheckoutClient />
        </div>
      </main>
      <footer className="border-t border-burgundy/10 bg-ivory px-5 py-8 text-center text-xs text-ink/50">
        <Logo className="mx-auto mb-3 h-7 w-auto text-burgundy/60" />
        Demo checkout · no payment is processed and no real orders are placed.
      </footer>
    </>
  );
}
