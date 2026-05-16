"use client";
import Link from "next/link";
import { useCartStore } from "@/lib/cartStore";
import { formatTZS } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
        <span style={{ fontSize: "52px" }}>🛒</span>
        <h2 style={{ fontWeight: 900, fontSize: "22px", letterSpacing: "-0.02em" }}>Cart is Empty</h2>
        <p style={{ fontSize: "13px", color: "#555", fontWeight: 500 }}>Add products to get started</p>
        <Link
          href="/products"
          style={{
            marginTop: "8px", padding: "16px 36px",
            background: "#FFBB1C", color: "#0C0C0C",
            fontWeight: 800, fontSize: "12px",
            letterSpacing: "0.14em", textTransform: "uppercase",
            textDecoration: "none", borderRadius: "8px",
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
        <div style={{ width: "3px", height: "22px", background: "#FFBB1C", borderRadius: "2px", flexShrink: 0 }} />
        <h1 style={{ fontWeight: 900, fontSize: "22px", letterSpacing: "-0.02em" }}>Your Cart</h1>
        <span style={{
          fontSize: "11px", fontWeight: 800,
          background: "#FFBB1C", color: "#0C0C0C",
          padding: "3px 10px", borderRadius: "4px", letterSpacing: "0.06em",
        }}>
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
                borderRadius: "12px",
                padding: "20px 20px 18px",
              }}
            >
              {/* Name row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                <p style={{ fontWeight: 700, fontSize: "17px", lineHeight: 1.3, flex: 1, paddingRight: "16px" }}>
                  {item.name}
                </p>
                <button
                  onClick={() => removeItem(item.product_id)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#3A3A3A", fontSize: "20px", padding: "0",
                    flexShrink: 0, lineHeight: 1, marginTop: "-2px",
                  }}
                >
                  ×
                </button>
              </div>

              {/* Unit price */}
              <p style={{ fontSize: "13px", color: "#555", fontWeight: 500, marginBottom: "20px" }}>
                {formatTZS(item.price)} per {item.unit}
              </p>

              {/* Qty controls + line total */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{
                  display: "flex", alignItems: "center",
                  background: "#0C0C0C",
                  border: "1px solid #2A2A2A",
                  borderRadius: "8px", overflow: "hidden",
                }}>
                  <button
                    onClick={() => updateQty(item.product_id, item.qty - 1)}
                    style={{
                      width: "44px", height: "44px",
                      background: "none", border: "none", cursor: "pointer",
                      color: "#FFBB1C", fontWeight: 900, fontSize: "20px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >−</button>
                  <span style={{
                    width: "36px", textAlign: "center",
                    fontWeight: 800, fontSize: "16px",
                  }}>{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.product_id, item.qty + 1)}
                    style={{
                      width: "44px", height: "44px",
                      background: "none", border: "none", cursor: "pointer",
                      color: "#FFBB1C", fontWeight: 900, fontSize: "20px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >+</button>
                </div>

                <p style={{ fontWeight: 900, fontSize: "20px", color: "#FFBB1C" }}>
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
        borderRadius: "12px",
        padding: "20px 20px 18px",
        marginBottom: "18px",
      }}>
        <p style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em",
          textTransform: "uppercase", color: "#444", marginBottom: "18px",
        }}>Order Summary</p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontSize: "14px", color: "#777" }}>Subtotal</span>
          <span style={{ fontSize: "14px", fontWeight: 700 }}>{formatTZS(totalPrice())}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <span style={{ fontSize: "14px", color: "#777" }}>Delivery — Arusha</span>
          <span style={{ fontSize: "14px", fontWeight: 700 }}>{formatTZS(DELIVERY_FEE)}</span>
        </div>

        <div style={{ borderTop: "1px solid #222", paddingTop: "18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 900, fontSize: "15px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Total</span>
          <span style={{ fontWeight: 900, fontSize: "22px", color: "#FFBB1C" }}>
            {formatTZS(totalPrice() + DELIVERY_FEE)}
          </span>
        </div>
      </div>

      <Link
        href="/checkout"
        style={{
          display: "block", width: "100%",
          padding: "18px 0",
          background: "#FFBB1C", color: "#0C0C0C",
          fontWeight: 900, fontSize: "13px", textAlign: "center",
          letterSpacing: "0.14em", textTransform: "uppercase",
          textDecoration: "none", borderRadius: "10px",
        }}
      >
        Proceed to Checkout →
      </Link>

      <Link href="/products" style={{
        display: "block", textAlign: "center",
        marginTop: "16px", fontSize: "13px",
        fontWeight: 600, color: "#3A3A3A", textDecoration: "none",
      }}>
        + Add more products
      </Link>
    </div>
  );
}
