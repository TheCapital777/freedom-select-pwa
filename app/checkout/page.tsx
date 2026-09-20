"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/cartStore";
import { formatTZS, buildWhatsAppMessage, buildWhatsAppURL, ARUSHA_AREAS } from "@/lib/utils";
import { formatTZS as fmt } from "@/lib/utils";
import Link from "next/link";
import {
  PackageIcon,
  MapPinIcon,
  CreditCardIcon,
  ReceiptIcon,
  ChatIcon,
  CheckIcon,
  ChevronDownIcon,
} from "@/app/_components/icons/StatusIcons";

/* Visible focus ring on every interactive element (MASTER.md checklist).
   #FFBB1C is the existing --color-accent — no new colours introduced. */
const FOCUS_RING = "focus-visible:[outline:2px_solid_#FFBB1C] focus-visible:[outline-offset:2px]";

const inputStyle: React.CSSProperties = {
  background: "#141414",
  border: "1px solid #2A2A2A",
  borderRadius: "var(--radius-input)",
  color: "#F0F0F0",
  /* 44px minimum touch target — py-2.5 + 14px text was 41px. */
  minHeight: "44px",
};

/* .label-industrial hardcodes --color-muted #6B6B6B (3.5:1 on #0C0C0C). These are
   form labels and running copy, so they move to --color-text-dim #B0B0B0 (9.0:1).
   The token itself is left alone — other files rely on it for decorative text. */
const LABEL_TEXT: React.CSSProperties = { color: "#B0B0B0" };

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [form, setForm] = useState({ name: "", phone: "", area: ARUSHA_AREAS[0], notes: "" });
  const DELIVERY_FEE = 8000;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    const msg = buildWhatsAppMessage(items, form.name, form.phone, form.area, form.notes, totalPrice(), DELIVERY_FEE);
    const url = buildWhatsAppURL(msg);
    window.open(url, "_blank");
    clearCart();
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center gap-4" style={{ background: "#0C0C0C" }}>
        <PackageIcon size={52} style={{ color: "#B0B0B0" }} />
        <h2 className="font-black text-xl uppercase tracking-wide">Nothing to checkout</h2>
        <Link
          href="/products"
          className={"px-6 py-3 font-black text-sm uppercase safety-glow inline-flex items-center min-h-11 cursor-pointer " + FOCUS_RING}
          style={{ background: "#FFBB1C", color: "#0C0C0C", borderRadius: "var(--radius-input)" }}
        >
          Browse Materials
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 pt-5 pb-8" style={{ background: "#0C0C0C", minHeight: "100vh" }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-5 rounded-full" style={{ background: "#FFBB1C" }} />
        <h1 className="font-black text-lg uppercase tracking-wide">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Delivery Details */}
        <div className="rounded-xl p-4 bolt-corner" style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}>
          <h2 className="font-black text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
            <MapPinIcon size={24} style={{ color: "#FFBB1C", flexShrink: 0 }} />
            Delivery Details
          </h2>
          <div className="flex flex-col gap-3">
            <div>
              <label htmlFor="checkout-name" className="label-industrial block mb-1.5" style={LABEL_TEXT}>Full Name *</label>
              <input
                id="checkout-name"
                name="name" required value={form.name} onChange={handleChange}
                placeholder="e.g. John Mollel"
                className={"w-full px-4 py-3 text-sm " + FOCUS_RING}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="checkout-phone" className="label-industrial block mb-1.5" style={LABEL_TEXT}>Phone Number *</label>
              <input
                id="checkout-phone"
                name="phone" required value={form.phone} onChange={handleChange}
                placeholder="e.g. 0712 345 678"
                type="tel"
                className={"w-full px-4 py-3 text-sm " + FOCUS_RING}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="checkout-area" className="label-industrial block mb-1.5" style={LABEL_TEXT}>Delivery Area — Arusha</label>
              <div className="relative">
                <select
                  id="checkout-area"
                  name="area" value={form.area} onChange={handleChange}
                  className={"w-full pl-4 pr-11 py-3 text-sm appearance-none cursor-pointer " + FOCUS_RING}
                  style={inputStyle}
                >
                  {ARUSHA_AREAS.map((a) => <option key={a} style={{ background: "#161616", color: "#F0F0F0" }}>{a}</option>)}
                </select>
                {/* appearance-none removed the native affordance; put one back. */}
                <ChevronDownIcon
                  size={24}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#B0B0B0" }}
                />
              </div>
            </div>
            <div>
              <label htmlFor="checkout-notes" className="label-industrial block mb-1.5" style={LABEL_TEXT}>Notes (optional)</label>
              <textarea
                id="checkout-notes"
                name="notes" value={form.notes} onChange={handleChange}
                placeholder="e.g. Call before delivery, deliver Saturday morning..."
                rows={2}
                className={"w-full px-4 py-3 text-sm resize-none " + FOCUS_RING}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="rounded-xl p-4" style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}>
          <h2 className="font-black text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
            <CreditCardIcon size={24} style={{ color: "#FFBB1C", flexShrink: 0 }} />
            Payment Method
          </h2>
          <div className="flex flex-col gap-2">
            {["M-Pesa / Mobile Money", "Cash on Delivery"].map((m, idx) => (
              <div
                key={m}
                className="flex items-center gap-3 px-4 py-3 min-h-11"
                style={{ background: "#141414", border: "1px solid rgba(255,187,28,0.2)", borderRadius: "var(--radius-input)" }}
              >
                <span
                  aria-hidden="true"
                  className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                  style={{ borderColor: "#FFBB1C", background: idx === 0 ? "#FFBB1C" : "transparent" }}
                />
                <span className="text-sm font-bold">{m}</span>
                {/* Colour alone must never carry the state — the word says it too. */}
                {idx === 0 && (
                  <span className="badge-construction ml-auto" style={{ gap: "6px", padding: "5px 10px" }}>
                    <CheckIcon size={24} strokeWidth={2.25} />
                    Selected
                  </span>
                )}
              </div>
            ))}
            <p className="label-industrial mt-1" style={LABEL_TEXT}>Payment verified by Freedom Select team via WhatsApp.</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="rounded-xl p-4" style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}>
          <h2 className="font-black text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
            <ReceiptIcon size={24} style={{ color: "#FFBB1C", flexShrink: 0 }} />
            Order Summary
          </h2>
          <div className="flex flex-col gap-1.5 mb-3">
            {items.map((item) => (
              <div key={item.product_id} className="flex justify-between gap-3 text-xs">
                <span style={{ color: "#B0B0B0" }}>{item.name} ×{item.qty}</span>
                <span className="font-bold flex-shrink-0">{fmt(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-1.5" style={{ borderColor: "#2A2A2A" }}>
            <div className="flex justify-between">
              <span className="label-industrial" style={LABEL_TEXT}>Delivery — Arusha</span>
              <span className="text-sm font-bold">{fmt(DELIVERY_FEE)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-black text-sm uppercase tracking-wide">Total</span>
              <span className="font-black text-base" style={{ color: "#FFBB1C" }}>{fmt(totalPrice() + DELIVERY_FEE)}</span>
            </div>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <button
          type="submit"
          className={"w-full py-4 min-h-11 font-black text-base flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer " + FOCUS_RING}
          style={{ background: "#25D366", color: "#fff", borderRadius: "var(--radius-input)", boxShadow: "0 0 20px rgba(37,211,102,0.3)" }}
        >
          <ChatIcon size={24} strokeWidth={2} />
          Send Order via WhatsApp
        </button>

        <p className="label-industrial text-center" style={LABEL_TEXT}>
          Order sent to Freedom Select · Team confirms via WhatsApp
        </p>
      </form>
    </div>
  );
}
