"use client";
import Link from "next/link";
import { useCartStore } from "@/lib/cartStore";
import { formatTZS } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CartIcon, XIcon, PlusIcon, MinusIcon, ArrowRightIcon } from "@/app/_components/icons/StatusIcons";

/* Visible focus ring on every interactive element (MASTER.md checklist).
   #FFBB1C is the existing --color-accent — no new colours introduced. */
const FOCUS_RING = "focus-visible:[outline:2px_solid_#FFBB1C] focus-visible:[outline-offset:2px]";

/* 44x44 minimum touch target for icon-only controls. */
const ICON_BUTTON: React.CSSProperties = {
  width: "44px", height: "44px",
  display: "flex", alignItems: "center", justifyContent: "center",
  background: "none", border: "none", cursor: "pointer",
  borderRadius: "var(--radius-input)", flexShrink: 0,
  transition: "color 200ms cubic-bezier(0.4,0,0.2,1), background 200ms cubic-bezier(0.4,0,0.2,1)",
};

export default function CartPage() {
  const { items, removeItem, updateQty, totalPrice } = useCartStore();
  const DELIVERY_FEE = 8000;

  if (items.length === 0) {
    return (
      <div style={{
        background: "#0C0C0C", minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "2rem 1.5rem", gap: "1.2rem", textAlign: "center",
      }}>
        <CartIcon size={52} style={{ color: "#B0B0B0" }} />
        <h2 style={{ fontWeight: 900, fontSize: "22px", letterSpacing: "-0.02em" }}>Cart is Empty</h2>
        <p style={{ fontSize: "13px", color: "#B0B0B0", fontWeight: 500 }}>Add products to get started</p>
        <Link
          href="/products"
          className={"cursor-pointer " + FOCUS_RING}
          style={{
            marginTop: "8px", padding: "16px 36px",
            minHeight: "44px", display: "inline-flex", alignItems: "center",
            background: "#FFBB1C", color: "#0C0C0C",
            fontWeight: 800, fontSize: "12px",
            letterSpacing: "0.14em", textTransform: "uppercase",
            textDecoration: "none", borderRadius: "var(--radius-input)",
          }}
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#0C0C0C", minHeight: "100vh", padding: "24px 16px 32px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <div style={{ width: "3px", height: "22px", background: "#FFBB1C", borderRadius: "var(--radius-stamp)", flexShrink: 0 }} />
        <h1 style={{ fontWeight: 900, fontSize: "22px", letterSpacing: "-0.02em" }}>Your Cart</h1>
        <span className="badge-construction" style={{ letterSpacing: "0.06em" }}>
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.product_id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 28 }}
              style={{
                background: "#161616",
                border: "1px solid #272727",
                borderRadius: "var(--radius-card)",
                padding: "20px 20px 18px",
              }}
            >
              {/* Name row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                <p style={{ fontWeight: 700, fontSize: "17px", lineHeight: 1.3, flex: 1, paddingRight: "12px" }}>
                  {item.name}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(item.product_id)}
                  aria-label={"Remove " + item.name + " from cart"}
                  className={"cursor-pointer " + FOCUS_RING}
                  style={{ ...ICON_BUTTON, color: "#B0B0B0", marginTop: "-10px", marginRight: "-10px" }}
                >
                  <XIcon size={24} />
                </button>
              </div>

              {/* Unit price */}
              <p style={{ fontSize: "13px", color: "#B0B0B0", fontWeight: 500, marginBottom: "20px" }}>
                {formatTZS(item.price)} per {item.unit}
              </p>

              {/* Qty controls + line total */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <div style={{
                  display: "flex", alignItems: "center",
                  background: "#0C0C0C",
                  border: "1px solid #2A2A2A",
                  borderRadius: "var(--radius-input)", overflow: "hidden",
                }}>
                  <button
                    type="button"
                    onClick={() => updateQty(item.product_id, item.qty - 1)}
                    aria-label={"Decrease quantity of " + item.name}
                    className={"cursor-pointer " + FOCUS_RING}
                    style={{ ...ICON_BUTTON, color: "#FFBB1C", borderRadius: 0 }}
                  >
                    <MinusIcon size={24} strokeWidth={2} />
                  </button>
                  <span
                    aria-live="polite"
                    style={{ minWidth: "36px", textAlign: "center", fontWeight: 800, fontSize: "16px" }}
                  >
                    <span className="sr-only">Quantity: </span>{item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.product_id, item.qty + 1)}
                    aria-label={"Increase quantity of " + item.name}
                    className={"cursor-pointer " + FOCUS_RING}
                    style={{ ...ICON_BUTTON, color: "#FFBB1C", borderRadius: 0 }}
                  >
                    <PlusIcon size={24} strokeWidth={2} />
                  </button>
                </div>

                <p style={{ fontWeight: 900, fontSize: "22px", color: "#FFBB1C" }}>
                  {formatTZS(item.price * item.qty)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Order Summary */}
      <div style={{
        background: "#161616",
        border: "1px solid #272727",
        borderRadius: "var(--radius-card)",
        padding: "20px 20px 18px",
        marginBottom: "18px",
      }}>
        <p style={{
          fontSize: "12px", fontWeight: 700, letterSpacing: "0.16em",
          textTransform: "uppercase", color: "#B0B0B0", marginBottom: "18px",
        }}>Order Summary</p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontSize: "14px", color: "#B0B0B0" }}>Subtotal</span>
          <span style={{ fontSize: "14px", fontWeight: 700 }}>{formatTZS(totalPrice())}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <span style={{ fontSize: "14px", color: "#B0B0B0" }}>Delivery — Arusha</span>
          <span style={{ fontSize: "14px", fontWeight: 700 }}>{formatTZS(DELIVERY_FEE)}</span>
        </div>

        <div style={{ borderTop: "1px solid #222", paddingTop: "18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 900, fontSize: "16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Total</span>
          <span style={{ fontWeight: 900, fontSize: "22px", color: "#FFBB1C" }}>
            {formatTZS(totalPrice() + DELIVERY_FEE)}
          </span>
        </div>
      </div>

      <Link
        href="/checkout"
        className={"cursor-pointer " + FOCUS_RING}
        style={{
          display: "flex", width: "100%",
          alignItems: "center", justifyContent: "center", gap: "10px",
          padding: "18px 0", minHeight: "44px",
          background: "#FFBB1C", color: "#0C0C0C",
          fontWeight: 900, fontSize: "13px", textAlign: "center",
          letterSpacing: "0.14em", textTransform: "uppercase",
          textDecoration: "none", borderRadius: "var(--radius-input)",
        }}
      >
        Proceed to Checkout
        <ArrowRightIcon size={24} strokeWidth={2.25} />
      </Link>

      <Link
        href="/products"
        className={"cursor-pointer " + FOCUS_RING}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          marginTop: "8px", minHeight: "44px",
          fontSize: "13px", fontWeight: 600, color: "#B0B0B0", textDecoration: "none",
          borderRadius: "var(--radius-input)",
        }}
      >
        <PlusIcon size={24} />
        Add more products
      </Link>
    </div>
  );
}
