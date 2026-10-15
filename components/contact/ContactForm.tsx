"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Field } from "../checkout/Field";
import { MARK_PETALS } from "../Logo";
import { Petals } from "../Petals";

const SUBJECTS = ["General", "Custom Order", "Wedding & Events", "Delivery Question"] as const;
type Subject = (typeof SUBJECTS)[number];
interface Values { name: string; email: string; phone: string; subject: Subject | ""; message: string }
type Errors = Partial<Record<keyof Values, string>>;

const ease = [0.22, 1, 0.36, 1] as const;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "May we have your name?";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "That email doesn't look quite right. Please check it.";
  if (v.phone.trim() && v.phone.replace(/\D/g, "").length < 7) e.phone = "If you add a phone number, it needs at least 7 digits.";
  if (!v.subject) e.subject = "Pick the topic that fits best.";
  if (v.message.trim().length < 10) e.message = "Tell us a little more (at least 10 characters).";
  else if (v.message.length > 1000) e.message = "That's a lovely long note. Please keep it under 1,000 characters.";
  return e;
}

export function ContactForm() {
  const [v, setV] = useState<Values>({ name: "", email: "", phone: "", subject: "", message: "" });
  const [err, setErr] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate(v);
    setErr(e);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid="true"] input')?.focus());
      return;
    }
    setSending(true);
    // UI-only: nothing is sent anywhere.
    window.setTimeout(() => {
      setSent(v.name.trim().split(" ")[0]);
      setSending(false);
    }, 1300);
  };

  const reset = () => {
    setV({ name: "", email: "", phone: "", subject: "", message: "" });
    setErr({});
    setSent(null);
  };

  return (
    <div className="relative min-h-[34rem]">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div key="done" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease }} role="status" className="relative flex min-h-[34rem] flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-ivory px-8 py-14 text-center ring-1 ring-burgundy/10">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0"><Petals /></div>
            <svg viewBox="0 0 48 48" className="relative h-24 w-24 text-burgundy" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {MARK_PETALS.map((p, i) => (
                <motion.path key={p.angle} d={p.d} transform={`rotate(${p.angle} 24 24)`} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.9, delay: 0.1 + i * 0.07, ease }} />
              ))}
              <motion.circle cx="24" cy="24" r="1.5" fill="#5c1a2b" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "24px 24px" }} transition={{ delay: 1, duration: 0.5 }} />
            </svg>
            <h3 className="relative mt-8 font-serif text-5xl leading-none font-light text-burgundy sm:text-6xl">Thank you, <span className="text-rose italic">{sent || "friend"}.</span></h3>
            <p className="relative mt-5 max-w-sm text-[15px] leading-relaxed text-ink/70">Your message is on its way to our studio. We usually reply within one working day.</p>
            <p className="relative mt-4 rounded-full bg-blush/50 px-4 py-1.5 text-xs text-burgundy">Demo form: nothing was actually sent.</p>
            <button type="button" onClick={reset} data-cursor="petal" className="relative mt-8 rounded-full border border-burgundy/30 px-8 py-3.5 text-sm tracking-[0.14em] text-burgundy uppercase transition-colors hover:bg-burgundy hover:text-ivory">Send another note</button>
          </motion.div>
        ) : (
          <motion.form key="form" noValidate onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5 }} className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
            <Field label="Your name" name="name" autoComplete="name" placeholder="Layla Haddad" value={v.name} error={err.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
            <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={v.email} error={err.email} onChange={(e) => setV({ ...v, email: e.target.value })} />
            <Field className="sm:col-span-2" label="Phone (optional)" name="phone" type="tel" autoComplete="tel" placeholder="+1 555 010 2030" value={v.phone} error={err.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} />

            <fieldset className="sm:col-span-2" data-invalid={!!err.subject}>
              <legend className="mb-3 text-[11px] tracking-[0.24em] text-rose uppercase">What&apos;s it about?</legend>
              <div className="flex flex-wrap gap-2.5">
                {SUBJECTS.map((s) => (
                  <label key={s} className="cursor-pointer">
                    <input type="radio" name="subject" value={s} checked={v.subject === s} onChange={() => setV({ ...v, subject: s })} className="peer sr-only" />
                    <span className="block rounded-full border border-burgundy/20 bg-ivory px-5 py-2.5 text-sm transition-colors peer-checked:border-burgundy peer-checked:bg-burgundy peer-checked:text-ivory peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rose">{s}</span>
                  </label>
                ))}
              </div>
              {err.subject && <p role="alert" className="pt-2 text-[13px] text-[#a22f45]">{err.subject}</p>}
            </fieldset>

            <div className="sm:col-span-2">
              <div className="mb-1 flex items-end justify-between">
                <label htmlFor="message" className="text-[11px] tracking-[0.24em] text-rose uppercase">Your message</label>
                <span aria-live="polite" className={`text-xs tabular-nums ${v.message.length > 1000 ? "text-[#a22f45]" : "text-ink/50"}`}>{v.message.length}/1000</span>
              </div>
              <textarea id="message" rows={6} value={v.message} aria-invalid={!!err.message} aria-describedby={err.message ? "message-err" : undefined} onChange={(e) => setV({ ...v, message: e.target.value })} placeholder="Tell us about the occasion, your favourite colours, or anything you'd like us to know…" className={`w-full resize-none rounded-2xl border bg-ivory p-5 font-serif text-xl leading-relaxed text-burgundy placeholder:text-ink/30 focus:border-burgundy focus:outline-none ${err.message ? "border-[#b4384f]" : "border-burgundy/20"}`} />
              {err.message && <p id="message-err" role="alert" className="pt-2 text-[13px] text-[#a22f45]">{err.message}</p>}
            </div>

            <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-ink/50">We&apos;ll only use your details to reply to you.</p>
              <button type="submit" disabled={sending} data-cursor="petal" className="group inline-flex items-center justify-center gap-3 rounded-full bg-burgundy px-10 py-4 text-sm font-medium tracking-[0.14em] text-ivory uppercase transition-colors duration-500 hover:bg-wine disabled:cursor-wait disabled:opacity-70">
                {sending ? "Sending…" : "Send message"}
                <svg className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M1 8h13M9 3l5 5-5 5" /></svg>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
