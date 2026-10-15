import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal, SectionHeading, WordReveal } from "@/components/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { Faq } from "@/components/contact/Faq";
import { MapPlaceholder } from "@/components/contact/MapPlaceholder";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Say hello to Halaflora. Ask about custom bouquets, weddings and events, or delivery, and find our hours and FAQs.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact · Halaflora",
    description: "Custom orders, weddings & events, delivery questions. Say hello, and we'll reply within a working day.",
    url: "/contact",
    type: "website",
  },
};

const Label = ({ children }: { children: React.ReactNode }) => <h3 className="mb-3 text-[11px] tracking-[0.26em] text-rose uppercase">{children}</h3>;

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-ivory">
        <section className="px-5 pt-32 pb-24 sm:px-8 sm:pt-44 sm:pb-32 lg:px-12">
          <div className="mx-auto max-w-[1500px]">
            <Reveal y={16}><p className="mb-6 flex items-center gap-4 text-[11px] tracking-[0.32em] text-rose uppercase sm:text-xs"><span className="h-px w-10 bg-current opacity-70" />Contact</p></Reveal>
            <h1 className="max-w-4xl font-serif text-[clamp(3.2rem,9.5vw,8.5rem)] leading-[0.9] font-light tracking-[-0.025em] text-burgundy">
              <WordReveal text="Let's talk flowers." italic={["flowers."]} />
            </h1>
            <Reveal delay={0.4}><p className="mt-8 max-w-lg text-lg leading-relaxed text-ink/70">A question, a custom idea, or a wedding to dream up? Write to us and a real person will reply, usually within one working day.</p></Reveal>

            <div className="mt-16 grid gap-16 lg:grid-cols-[1.25fr_1fr] lg:gap-24">
              <Reveal y={40}><ContactForm /></Reveal>

              <aside aria-label="Studio details" className="space-y-12">
                <Reveal>
                  <Label>Write or call</Label>
                  <p className="font-serif text-3xl leading-snug text-burgundy sm:text-4xl">
                    <a href={`mailto:${SITE.email}`} data-cursor="petal" className="break-all underline decoration-rose/50 underline-offset-8 transition-colors hover:decoration-burgundy">{SITE.email}</a>
                  </p>
                  <p className="mt-3 font-serif text-2xl text-burgundy"><a href={`tel:${SITE.phoneHref}`} data-cursor="petal" className="hover:text-rose">{SITE.phone}</a></p>
                </Reveal>

                <Reveal delay={0.08}>
                  <Label>Studio hours</Label>
                  <dl className="divide-y divide-burgundy/10 border-y border-burgundy/10 text-[15px]">
                    {SITE.hours.map((h) => (
                      <div key={h.days} className="flex justify-between gap-6 py-3"><dt className="text-ink/70">{h.days}</dt><dd className="text-right text-burgundy">{h.time}</dd></div>
                    ))}
                  </dl>
                </Reveal>

                <Reveal delay={0.16}>
                  <Label>Follow along</Label>
                  <ul className="flex flex-wrap gap-2.5">
                    {SITE.socials.map((s) => (
                      <li key={s.name}>
                        <a href={s.href} target="_blank" rel="noopener noreferrer" data-cursor="petal" className="block rounded-full border border-burgundy/25 px-5 py-2.5 text-sm text-burgundy transition-colors hover:bg-burgundy hover:text-ivory">
                          {s.name}<span className="sr-only">: {s.handle}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </Reveal>

                <Reveal delay={0.24}><MapPlaceholder lines={SITE.address} /></Reveal>
              </aside>
            </div>
          </div>
        </section>

        <section aria-labelledby="faq-title" className="bg-cream px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
            <div id="faq-title" className="lg:sticky lg:top-32 lg:self-start">
              <SectionHeading eyebrow="Good to know" title="Quick answers." italic={["answers."]} />
              <Reveal delay={0.2}><p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink/70">Can&apos;t find what you need? The form above goes straight to our studio.</p></Reveal>
            </div>
            <Reveal><Faq /></Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
