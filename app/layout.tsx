import type { Metadata, Viewport } from "next";
import { Amiri, Caveat, Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { IntroProvider } from "@/components/IntroProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Loader } from "@/components/Loader";
import { CartProvider } from "@/components/CartProvider";
import { CartDrawer } from "@/components/CartDrawer";
import { Cursor } from "@/components/Cursor";
import { TransitionProvider } from "@/components/TransitionProvider";
import { SITE_URL } from "@/lib/site-url";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Halaflora — The Sweetness of Every Bloom",
    template: "%s · Halaflora",
  },
  description:
    "Halaflora is a boutique floral atelier. Hand-tied bouquets, wild seasonal blooms and flower subscriptions, made with a little sweetness.",
  openGraph: {
    title: "Halaflora — The Sweetness of Every Bloom",
    description:
      "A boutique floral atelier. Hand-tied bouquets, wild seasonal blooms and flower subscriptions.",
    siteName: "Halaflora",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf5ec",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${amiri.variable} ${caveat.variable} antialiased`}
    >
      <body className="grain min-h-svh font-sans">
        <noscript>
          <style>{`#halaflora-loader{display:none!important}`}</style>
        </noscript>
        <a href="#main" className="sr-only z-[130] rounded-full bg-burgundy px-5 py-3 text-ivory focus:not-sr-only focus:fixed focus:top-4 focus:left-4">Skip to content</a>
        <IntroProvider>
          <CartProvider>
            <SmoothScroll />
            <Loader />
            <TransitionProvider>{children}</TransitionProvider>
            <CartDrawer />
            <Cursor />
          </CartProvider>
        </IntroProvider>
      </body>
    </html>
  );
}
