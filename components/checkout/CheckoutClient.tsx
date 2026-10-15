"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../CartProvider";
import { LogoMark } from "../Logo";
import { getLenis } from "@/lib/scroll-lock";
import { Field } from "./Field";
import { GiftCard } from "./GiftCard";
import { StepIndicator } from "./StepIndicator";
import { Summary, computeTotals } from "./Summary";
import { AnimatedNumber } from "./AnimatedNumber";
import { Confirmation, type Order } from "./Confirmation";
import {
  SLOTS, cardBrand, formatCardNumber, formatExpiry, todayISO,
  validateDelivery, validateMessage, validatePayment,
  type Delivery, type Errors, type Message, type Payment,
} from "./validation";

const ease = [0.22, 1, 0.36, 1] as const;
const TITLES = [
  { eyebrow: "Step one", title: "Where should it bloom?", italic: "bloom?" },
  { eyebrow: "Step two", title: "Add a few kind words.", italic: "kind words." },
  { eyebrow: "Step three", title: "Almost there.", italic: "there." },
];

const btnPrimary = "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-burgundy px-10 py-4 text-sm font-medium tracking-[0.14em] text-ivory uppercase transition-colors duration-500 hover:bg-wine disabled:cursor-wait disabled:opacity-70";
const btnGhost = "rounded-full border border-burgundy/30 px-8 py-4 text-sm tracking-[0.14em] text-burgundy uppercase transition-colors hover:bg-burgundy hover:text-ivory";

export function CheckoutClient() {
  const { items, ready, clear, setOpen } = useCart();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [today, setToday] = useState("");
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const [delivery, setDelivery] = useState<Delivery>({ name: "", phone: "", address: "", city: "", date: "", slot: "" });
  const [message, setMessage] = useState<Message>({ text: "", from: "", anonymous: false });
  const [payment, setPayment] = useState<Payment>({ number: "", name: "", expiry: "", cvc: "" });
  const [dErr, setDErr] = useState<Errors<Delivery>>({});
  const [mErr, setMErr] = useState<Errors<Message>>({});
  const [pErr, setPErr] = useState<Errors<Payment>>({});

  const top = useRef<HTMLDivElement>(null);
  const totals = useMemo(() => computeTotals(items, addonIds), [items, addonIds]);

  // `new Date()` is read after mount so server and client markup agree.
  // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only "today" for the date picker's min
  useEffect(() => setToday(todayISO()), []);

  const toggleAddon = (id: string) => setAddonIds((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const scrollTop = () => {
    const el = top.current;
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -110, duration: 1 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 110, behavior: "smooth" });
  };

  const go = useCallback((n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
    requestAnimationFrame(scrollTop);
  }, [step]);

  const focusFirstError = () => requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());

  const next = () => {
    if (step === 0) {
      const e = validateDelivery(delivery, today || todayISO());
      setDErr(e);
      if (Object.keys(e).length) return focusFirstError();
    } else if (step === 1) {
      const e = validateMessage(message);
      setMErr(e);
      if (Object.keys(e).length) return focusFirstError();
    }
    go(step + 1);
  };

  const pay = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validatePayment(payment);
    setPErr(e);
    if (Object.keys(e).length) return focusFirstError();
    setProcessing(true);
    // Demo only: nothing is sent anywhere.
    window.setTimeout(() => {
      const number = `HF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      setOrder({ number, items, addonIds, totals, delivery, message });
      setPayment({ number: "", name: "", expiry: "", cvc: "" });
      clear();
      setProcessing(false);
      setDir(1);
      setStep(3);
      requestAnimationFrame(scrollTop);
    }, 1700);
  };

  // ---- states outside the stepper ----
  if (!order && !ready) return <div className="min-h-[60svh]" aria-busy="true" />;

  if (!order && items.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }} className="mx-auto flex min-h-[60svh] max-w-xl flex-col items-center justify-center text-center">
        <LogoMark className="mb-8 h-20 w-20 text-rose" strokeWidth={0.6} />
        <h1 className="font-serif text-[clamp(2.8rem,7vw,5rem)] leading-[0.95] font-light text-burgundy">Your bag is <span className="text-rose italic">empty.</span></h1>
        <p className="mt-6 max-w-md text-ink/70">There&apos;s nothing to check out yet. Wander through the shop and let a bouquet choose you.</p>
        <Link href="/shop" data-cursor="petal" className={`${btnPrimary} mt-10`}>Browse bouquets</Link>
      </motion.div>
    );
  }

  if (order) {
    return (
      <div ref={top}>
        <Confirmation order={order} />
      </div>
    );
  }

  const t = TITLES[step];
  const brand = cardBrand(payment.number);
  const left = 200 - message.text.length;

  return (
    <div ref={top} className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)] lg:gap-20">
      {/* Mobile: collapsible summary */}
      <div className="lg:hidden">
        <button type="button" onClick={() => setSummaryOpen((o) => !o)} aria-expanded={summaryOpen} aria-controls="mobile-summary" className="flex w-full items-center justify-between rounded-2xl border border-burgundy/15 bg-cream/70 px-5 py-4 text-left">
          <span className="flex items-center gap-3 text-sm text-burgundy">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>
            {summaryOpen ? "Hide" : "Show"} order summary
            <motion.svg animate={{ rotate: summaryOpen ? 180 : 0 }} viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M3 6l5 5 5-5" /></motion.svg>
          </span>
          <AnimatedNumber value={totals.total} className="font-serif text-2xl text-burgundy" />
        </button>
        <AnimatePresence initial={false}>
          {summaryOpen && (
            <motion.div id="mobile-summary" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease }} className="overflow-hidden">
              <div className="pt-6"><Summary items={items} addonIds={addonIds} onToggleAddon={toggleAddon} totals={totals} idPrefix="m" onEditBag={() => setOpen(true)} /></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Steps */}
      <div className="min-w-0">
        <StepIndicator step={step} onJump={go} />

        <div className="mt-12 min-h-[28rem] sm:mt-16">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={step}
              custom={dir}
              variants={{ enter: (d: number) => ({ opacity: 0, x: 48 * d }), center: { opacity: 1, x: 0 }, exit: (d: number) => ({ opacity: 0, x: -48 * d }) }}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.55, ease }}
            >
              <p className="mb-4 flex items-center gap-4 text-[11px] tracking-[0.32em] text-rose uppercase sm:text-xs"><span className="h-px w-10 bg-current opacity-70" />{t.eyebrow}</p>
              <h1 className="mb-10 font-serif text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.98] font-light tracking-[-0.02em] text-burgundy">
                {t.title.replace(t.italic, "")}<span className="text-rose italic">{t.italic}</span>
              </h1>

              {step === 0 && (
                <form noValidate onSubmit={(e) => { e.preventDefault(); next(); }} className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
                  <Field label="Recipient name" name="name" autoComplete="name" placeholder="Layla Haddad" value={delivery.name} error={dErr.name} onChange={(e) => setDelivery({ ...delivery, name: e.target.value })} />
                  <Field label="Phone" name="phone" type="tel" autoComplete="tel" placeholder="+1 555 010 2030" value={delivery.phone} error={dErr.phone} onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })} />
                  <Field className="sm:col-span-2" label="Street address" name="address" autoComplete="street-address" placeholder="12 Garden Lane, Apt 4" value={delivery.address} error={dErr.address} onChange={(e) => setDelivery({ ...delivery, address: e.target.value })} />
                  <Field label="City" name="city" autoComplete="address-level2" placeholder="Amman" value={delivery.city} error={dErr.city} onChange={(e) => setDelivery({ ...delivery, city: e.target.value })} />
                  <Field label="Delivery date" name="date" type="date" min={today || undefined} value={delivery.date} error={dErr.date} hint="Past dates are unavailable." onChange={(e) => setDelivery({ ...delivery, date: e.target.value })} />

                  <fieldset className="sm:col-span-2" aria-describedby={dErr.slot ? "slot-err" : undefined}>
                    <legend className="mb-3 text-[11px] tracking-[0.24em] text-rose uppercase">Time slot</legend>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {SLOTS.map((s) => (
                        <label key={s.id} className="cursor-pointer">
                          <input type="radio" name="slot" value={s.id} checked={delivery.slot === s.id} onChange={() => setDelivery({ ...delivery, slot: s.id })} className="peer sr-only" />
                          <span className="block rounded-2xl border border-burgundy/20 bg-ivory px-5 py-4 transition-colors peer-checked:border-burgundy peer-checked:bg-burgundy peer-checked:text-ivory peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rose">
                            <span className="block font-serif text-2xl leading-none">{s.label}</span>
                            <span className="mt-1.5 block text-xs opacity-70">{s.time}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                    {dErr.slot && <p id="slot-err" role="alert" className="pt-2 text-[13px] text-[#a22f45]">{dErr.slot}</p>}
                  </fieldset>
                  <div className="sm:col-span-2 flex justify-end pt-4"><button type="submit" data-cursor="petal" className={btnPrimary}>Continue to message <Arrow /></button></div>
                </form>
              )}

              {step === 1 && (
                <form noValidate onSubmit={(e) => { e.preventDefault(); next(); }} className="grid items-start gap-12 xl:grid-cols-[1fr_minmax(0,380px)]">
                  <div className="space-y-8">
                    <div>
                      <div className="mb-1 flex items-end justify-between">
                        <label htmlFor="msg" className="text-[11px] tracking-[0.24em] text-rose uppercase">Your message <span className="normal-case tracking-normal text-ink/45">(optional)</span></label>
                        <span aria-live="polite" className={`text-xs tabular-nums ${left < 20 ? "text-[#a22f45]" : "text-ink/50"}`}>{left} left</span>
                      </div>
                      <textarea id="msg" rows={5} maxLength={200} value={message.text} aria-invalid={!!mErr.text} onChange={(e) => setMessage({ ...message, text: e.target.value })} placeholder="Happy birthday, Mama. Thank you for everything…" className="w-full resize-none rounded-2xl border border-burgundy/20 bg-ivory p-5 font-[family-name:var(--font-script)] text-[1.7rem] leading-[1.3] text-burgundy placeholder:text-ink/30 focus:border-burgundy focus:outline-none" />
                      {mErr.text && <p role="alert" className="pt-2 text-[13px] text-[#a22f45]">{mErr.text}</p>}
                    </div>

                    <label htmlFor="anon" className="flex cursor-pointer items-center justify-between gap-6 rounded-2xl border border-burgundy/15 bg-ivory/60 p-4">
                      <span><span className="block text-sm text-burgundy">Send anonymously</span><span className="block text-xs text-ink/55">The card will be signed “A secret admirer”.</span></span>
                      <input id="anon" type="checkbox" role="switch" checked={message.anonymous} onChange={(e) => setMessage({ ...message, anonymous: e.target.checked })} className="peer sr-only" />
                      <span aria-hidden="true" className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rose ${message.anonymous ? "bg-burgundy" : "bg-burgundy/20"}`}>
                        <motion.span animate={{ x: message.anonymous ? 22 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 32 }} className="absolute top-1 h-5 w-5 rounded-full bg-ivory shadow" />
                      </span>
                    </label>

                    <AnimatePresence initial={false}>
                      {!message.anonymous && (
                        <motion.div key="from" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <Field label="Signed by" name="from" autoComplete="given-name" placeholder="Your name" value={message.from} error={mErr.from} onChange={(e) => setMessage({ ...message, from: e.target.value })} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="xl:sticky xl:top-28">
                    <p className="mb-4 text-center text-[11px] tracking-[0.26em] text-rose uppercase">Live preview</p>
                    <GiftCard to={delivery.name.trim().split(" ")[0]} message={message.text} from={message.from} anonymous={message.anonymous} />
                  </div>
                  <div className="flex items-center justify-between pt-2 xl:col-span-2">
                    <button type="button" onClick={() => go(0)} className={btnGhost}>Back</button>
                    <button type="submit" data-cursor="petal" className={btnPrimary}>Continue to payment <Arrow /></button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form noValidate onSubmit={pay} className="space-y-8">
                  <div role="note" className="flex gap-4 rounded-2xl border border-rose/40 bg-blush/40 p-5 text-sm leading-relaxed text-burgundy">
                    <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-burgundy text-xs text-ivory">!</span>
                    <p><strong className="font-medium">Demo checkout.</strong> No payment provider is connected and nothing is charged or stored. Please don&apos;t enter a real card. Try <span className="font-mono">4242 4242 4242 4242</span>, any future date and any 3-digit code.</p>
                  </div>

                  {/* card face */}
                  <div aria-hidden="true" className="relative mx-auto aspect-[1.586] w-full max-w-[360px] overflow-hidden rounded-3xl bg-gradient-to-br from-burgundy via-[#7a2a3d] to-wine p-6 text-ivory shadow-[0_30px_60px_-30px_rgba(58,15,27,0.7)]">
                    <LogoMark className="absolute -right-6 -bottom-6 h-40 w-40 text-blush/15" strokeWidth={0.5} />
                    <div className="flex items-start justify-between"><LogoMark className="h-8 w-8 text-blush" strokeWidth={0.9} /><span className="text-[11px] tracking-[0.2em] uppercase text-blush">{brand === "card" ? "Demo" : brand}</span></div>
                    <p className="mt-9 font-mono text-[1.05rem] tracking-[0.12em] whitespace-nowrap tabular-nums sm:text-xl">{payment.number || "•••• •••• •••• ••••"}</p>
                    <div className="mt-5 flex items-end justify-between text-xs"><span className="max-w-[60%] truncate tracking-[0.14em] uppercase">{payment.name || "Name on card"}</span><span className="font-mono tracking-wider">{payment.expiry || "MM/YY"}</span></div>
                  </div>

                  <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
                    <Field className="sm:col-span-2" label="Card number" name="number" inputMode="numeric" autoComplete="off" placeholder="4242 4242 4242 4242" value={payment.number} error={pErr.number} onChange={(e) => setPayment({ ...payment, number: formatCardNumber(e.target.value) })} trailing={<span className="text-[10px] tracking-[0.16em] text-rose uppercase">{brand === "card" ? "" : brand}</span>} />
                    <Field className="sm:col-span-2" label="Name on card" name="cardname" autoComplete="off" placeholder="Layla Haddad" value={payment.name} error={pErr.name} onChange={(e) => setPayment({ ...payment, name: e.target.value })} />
                    <Field label="Expiry" name="expiry" inputMode="numeric" autoComplete="off" placeholder="MM/YY" value={payment.expiry} error={pErr.expiry} onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })} />
                    <Field label="CVC" name="cvc" inputMode="numeric" autoComplete="off" placeholder={brand === "amex" ? "1234" : "123"} maxLength={4} value={payment.cvc} error={pErr.cvc} onChange={(e) => setPayment({ ...payment, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })} />
                  </div>

                  <div className="flex flex-col-reverse items-stretch justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                    <button type="button" onClick={() => go(1)} disabled={processing} className={btnGhost}>Back</button>
                    <button type="submit" disabled={processing} data-cursor="petal" className={btnPrimary}>
                      {processing ? (<><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }} className="inline-flex"><LogoMark className="h-5 w-5" strokeWidth={1.2} /></motion.span>Wrapping it up…</>) : (<>Place demo order · ${totals.total.toFixed(2)}</>)}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop: sticky summary */}
      <aside aria-label="Order summary" className="hidden lg:block">
        <div className="sticky top-28 rounded-[2rem] bg-cream/70 p-8 ring-1 ring-burgundy/10" data-lenis-prevent>
          <h2 className="mb-6 font-serif text-3xl text-burgundy">Order summary</h2>
          <Summary items={items} addonIds={addonIds} onToggleAddon={toggleAddon} totals={totals} idPrefix="d" onEditBag={() => setOpen(true)} />
        </div>
      </aside>
    </div>
  );
}

function Arrow() {
  return (
    <svg className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M1 8h13M9 3l5 5-5 5" /></svg>
  );
}
