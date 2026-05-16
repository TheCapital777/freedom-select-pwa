"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/cartStore";
import { formatTZS, buildWhatsAppMessage, buildWhatsAppURL, ARUSHA_AREAS } from "@/lib/utils";
import { formatTZS as fmt } from "@/lib/utils";
import Link from "next/link";

const inputStyle = {
  background: "#141414",
  border: "1px solid #2A2A2A",
  borderRadius: "8px",
  color: "#F0F0F0",
};

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
        <span className="text-5xl">📦</span>
        <h2 className="font-black text-xl uppercase tracking-wide">Nothing to checkout</h2>
        <Link href="/products" className="px-6 py-3 font-black text-sm uppercase safety-glow" style={{ background: "#FFBB1C", color: "#0C0C0C", borderRadius: "8px" }}>
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
            <span style={{ color: "#FFBB1C" }}>📍</span> Delivery Details
          </h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="label-industrial block mb-1.5">Full Name *</label>
              <input
                name="name" required value={form.name} onChange={handleChange}
                placeholder="e.g. John Mollel"
                className="w-full px-4 py-2.5 text-sm outline-none"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="label-industrial block mb-1.5">Phone Number *</label>
              <input
                name="phone" required value={form.phone} onChange={handleChange}
                placeholder="e.g. 0712 345 678"
                type="tel"
                className="w-full px-4 py-2.5 text-sm outline-none"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="label-industrial block mb-1.5">Delivery Area — Arusha</label>
              <select
                name="area" value={form.area} onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm outline-none appearance-none"
                style={inputStyle}
              >
                {ARUSHA_AREAS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="label-industrial block mb-1.5">Notes (optional)</label>
              <textarea
                name="notes" value={form.notes} onChange={handleChange}
                placeholder="e.g. Call before delivery, deliver Saturday morning..."
                rows={2}
                className="w-full px-4 py-2.5 text-sm outline-none resize-none"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="rounded-xl p-4" style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}>
          <h2 className="font-black text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
            <span style={{ color: "#FFBB1C" }}>💳</span> Payment Method
          </h2>
          <div className="flex flex-col gap-2">
            {["M-Pesa / Mobile Money", "Cash on Delivery"].map((m, idx) => (
              <div
                key={m}
                className="flex items-center gap-3 px-4 py-3"
                style={{ background: "#141414", border: "1px solid rgba(255,187,28,0.2)", borderRadius: "8px" }}
              >
                <span
                  className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                  style={{ borderColor: "#FFBB1C", background: idx === 0 ? "#FFBB1C" : "transparent" }}
                />
                <span className="text-sm font-bold">{m}</span>
              </div>
            ))}
            <p className="label-industrial mt-1">Payment verified by Freedom Select team via WhatsApp.</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="rounded-xl p-4" style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}>
          <h2 className="font-black text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
            <span style={{ color: "#FFBB1C" }}>🧾</span> Order Summary
          </h2>
          <div className="flex flex-col gap-1.5 mb-3">
            {items.map((item) => (
              <div key={item.product_id} className="flex justify-between text-xs">
                <span style={{ color: "#6B6B6B" }}>{item.name} ×{item.qty}</span>
                <span className="font-bold">{fmt(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-1.5" style={{ borderColor: "#2A2A2A" }}>
            <div className="flex justify-between">
              <span className="label-industrial">Delivery — Arusha</span>
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
          className="w-full py-4 font-black text-base flex items-center justify-center gap-2 uppercase tracking-wide"
          style={{ background: "#25D366", color: "#fff", borderRadius: "8px", boxShadow: "0 0 20px rgba(37,211,102,0.3)" }}
        >
          <span className="text-xl">💬</span>
          Send Order via WhatsApp
        </button>

        <p className="label-industrial text-center">
          Order sent to Freedom Select · Team confirms via WhatsApp
        </p>
      </form>
    </div>
  );
}
