import type { CartItem } from "./types";

export function formatTZS(amount: number): string {
  return "TZS " + new Intl.NumberFormat("en-TZ").format(Math.round(amount));
}

export function calcCommission(total: number, rate = 0.08) {
  return Math.round(total * rate);
}

export function buildWhatsAppMessage(
  items: CartItem[],
  name: string,
  phone: string,
  address: string,
  notes: string,
  total: number,
  deliveryFee: number
): string {
  const lines = items
    .map((i) => `• ${i.name} ×${i.qty} ${i.unit} — ${formatTZS(i.price * i.qty)}`)
    .join("\n");

  const msg = [
    "🛒 *Freedom Select — Order Request*",
    "",
    lines,
    "",
    `🚚 Delivery Fee: ${formatTZS(deliveryFee)}`,
    `💰 *Total: ${formatTZS(total + deliveryFee)}*`,
    "",
    `👤 Name: ${name}`,
    `📱 Phone: ${phone}`,
    `📍 Delivery: ${address}, Arusha`,
    notes ? `📝 Notes: ${notes}` : "",
  ]
    .filter((l) => l !== undefined)
    .join("\n")
    .trim();

  return msg;
}

export function buildWhatsAppURL(message: string): string {
  return `https://wa.me/255745877423?text=${encodeURIComponent(message)}`;
}

export const ARUSHA_AREAS = [
  "Arusha CBD",
  "Njiro",
  "Kijenge",
  "Sakina",
  "Kaloleni",
  "Themi",
  "Unga Ltd",
  "Kimandolu",
  "Kwa Mrombo",
  "Lemara",
  "Moshono",
  "Ngarenaro",
  "Sekei",
  "Sokon I",
  "Sokon II",
];
