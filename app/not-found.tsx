import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" className="flex min-h-svh flex-col items-center justify-center bg-ivory px-6 text-center">
        <LogoMark className="mb-8 h-20 w-20 text-rose" strokeWidth={0.6} />
        <h1 className="font-serif text-6xl font-light text-burgundy sm:text-8xl">This bloom <span className="italic text-rose">wandered off.</span></h1>
        <p className="mt-6 max-w-md text-ink/70">The page you were looking for isn&apos;t here, but there are plenty of flowers that are.</p>
        <Link href="/shop" className="mt-10 rounded-full bg-burgundy px-10 py-4 text-sm tracking-[0.16em] text-ivory uppercase transition-colors hover:bg-wine">Browse bouquets</Link>
      </main>
    </>
  );
}
