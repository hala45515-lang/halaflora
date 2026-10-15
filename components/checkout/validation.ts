export interface Delivery { name: string; phone: string; address: string; city: string; date: string; slot: "" | "morning" | "afternoon" | "evening" }
export interface Message { text: string; from: string; anonymous: boolean }
export interface Payment { number: string; name: string; expiry: string; cvc: string }
export type Errors<T> = Partial<Record<keyof T, string>>;

export const SLOTS = [
  { id: "morning", label: "Morning", time: "9am – 12pm" },
  { id: "afternoon", label: "Afternoon", time: "12pm – 4pm" },
  { id: "evening", label: "Evening", time: "4pm – 8pm" },
] as const;

export const ADDONS = [
  { id: "card", name: "Letterpress greeting card", price: 6, blurb: "Blank inside, with envelope" },
  { id: "chocolates", name: "Belgian chocolates", price: 14, blurb: "Box of 9, dark & milk" },
  { id: "vase", name: "Hand-glazed ceramic vase", price: 28, blurb: "Ready to place your bouquet" },
] as const;

export const FREE_DELIVERY_FROM = 100;
export const DELIVERY_FEE = 9;

/** Local YYYY-MM-DD (the format <input type="date"> uses). Call from effects/handlers only. */
export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function validateDelivery(v: Delivery, today: string): Errors<Delivery> {
  const e: Errors<Delivery> = {};
  if (v.name.trim().length < 2) e.name = "Who are we delivering to? Please add the recipient's name.";
  if (v.phone.replace(/\D/g, "").length < 7) e.phone = "We need a phone number the courier can reach (at least 7 digits).";
  if (v.address.trim().length < 5) e.address = "Please add a street address so the flowers find their way.";
  if (v.city.trim().length < 2) e.city = "Which city should we deliver to?";
  if (!v.date) e.date = "Pick a delivery date.";
  else if (v.date < today) e.date = "That date has passed. Please choose today or later.";
  if (!v.slot) e.slot = "Choose a time slot that suits.";
  return e;
}

export function validateMessage(v: Message): Errors<Message> {
  const e: Errors<Message> = {};
  if (v.text.length > 200) e.text = "Your message is a little long. 200 characters at most.";
  if (v.text.trim() && !v.anonymous && v.from.trim().length < 2) e.from = "Sign your card, or switch on “Send anonymously”.";
  return e;
}

export function formatCardNumber(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

export function formatExpiry(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

function luhn(num: string): boolean {
  let sum = 0;
  for (let i = 0; i < num.length; i++) {
    let d = Number(num[num.length - 1 - i]);
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return sum % 10 === 0;
}

export function cardBrand(num: string): "visa" | "mastercard" | "amex" | "card" {
  const n = num.replace(/\D/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  return "card";
}

export function validatePayment(v: Payment): Errors<Payment> {
  const e: Errors<Payment> = {};
  const digits = v.number.replace(/\D/g, "");
  if (digits.length < 13) e.number = "That card number looks too short.";
  else if (!luhn(digits)) e.number = "That card number doesn't look right. Please check it. (Demo tip: 4242 4242 4242 4242)";
  if (v.name.trim().length < 2) e.name = "Add the name as it appears on the card.";
  const m = /^(\d{2})\/(\d{2})$/.exec(v.expiry);
  if (!m) e.expiry = "Use the format MM/YY.";
  else {
    const month = Number(m[1]), year = 2000 + Number(m[2]);
    const now = new Date();
    if (month < 1 || month > 12) e.expiry = "The month should be between 01 and 12.";
    else if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) e.expiry = "This card has expired.";
  }
  const cvcLen = cardBrand(v.number) === "amex" ? 4 : 3;
  if (!new RegExp(`^\\d{${cvcLen}}$`).test(v.cvc)) e.cvc = `The security code is ${cvcLen} digits.`;
  return e;
}
