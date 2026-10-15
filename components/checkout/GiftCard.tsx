import { LogoMark } from "../Logo";

/** Styled gift card with a handwritten message. Used for the live preview and the confirmation. */
export function GiftCard({ to, message, from, anonymous }: { to: string; message: string; from: string; anonymous: boolean }) {
  const signature = anonymous ? "A secret admirer" : from.trim() || "Your name";
  return (
    <figure className="relative mx-auto w-full max-w-[420px] rotate-[-1.5deg] rounded-[6px] bg-[#fffaf0] p-7 shadow-[0_30px_60px_-30px_rgba(58,15,27,0.45),0_2px_0_rgba(92,26,43,0.05)] ring-1 ring-burgundy/10 sm:p-9">
      {/* deckled inner border */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-2.5 rounded-[3px] border border-dashed border-rose/45" />
      <LogoMark className="absolute top-5 right-5 h-9 w-9 text-rose/70" strokeWidth={0.8} />
      <figcaption className="sr-only">Gift card preview</figcaption>
      <p className="font-[family-name:var(--font-script)] text-2xl text-rose">Dear {to.trim() || "you"},</p>
      <p className="mt-3 min-h-[7.5rem] font-[family-name:var(--font-script)] text-[1.7rem] leading-[1.3] break-words whitespace-pre-wrap text-burgundy">
        {message.trim() || <span className="text-ink/30">Your message will appear here…</span>}
      </p>
      <p className="mt-4 text-right font-[family-name:var(--font-script)] text-2xl text-burgundy">
        <span className="text-rose">with love,</span> {signature}
      </p>
      <p className="mt-5 border-t border-burgundy/10 pt-3 text-center text-[10px] tracking-[0.3em] text-ink/40 uppercase">Halaflora · The Sweetness of Every Bloom</p>
    </figure>
  );
}
