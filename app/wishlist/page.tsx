"use client";
import Link from "next/link";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useCartStore } from "@/lib/cartStore";
import { formatTZS } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState<Record<string, boolean>>({});

  function handleAddToCart(item: typeof items[0]) {
    addToCart({
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      qty: 1,
      unit: item.unit,
      vendor_id: "",
      emoji: item.emoji,
    });
    setAdded((prev) => ({ ...prev, [item.product_id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [item.product_id]: false })), 1400);
  }

  if (items.length === 0) {
    return (
      <div style={{ background: "#0C0C0C", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem", gap: "1.2rem", textAlign: "center" }}>
        <span style={{ fontSize: "52px" }}>🤍</span>
        <h2 style={{ fontWeight: 900, fontSize: "22px", letterSpacing: "-0.02em" }}>Wishlist is Empty</h2>
        <p style={{ fontSize: "14px", color: "#555", fontWeight: 400 }}>Save products you love while shopping</p>
        <Link href="/products" style={{ marginTop: "8px", padding: "16px 36px", background: "#FFBB1C", color: "#0C0C0C", fontWeight: 800, fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", borderRadius: "8px" }}>
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
        <h1 style={{ fontWeight: 900, fontSize: "22px", letterSpacing: "-0.02em" }}>Wishlist</h1>
        <span style={{ fontSize: "11px", fontWeight: 800, background: "#FFBB1C", color: "#0C0C0C", padding: "3px 10px", borderRadius: "4px" }}>
          {items.length} saved
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div
              key={item.product_id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 28 }}
              transition={{ delay: i * 0.05 }}
              style={{ background: "#161616", border: "1px solid #242424", borderRadius: "12px", padding: "20px 20px 18px" }}
            >
              {/* Name + remove */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1 }}>
                  <span style={{ fontSize: "32px", flexShrink: 0 }}>{item.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: "17px", lineHeight: 1.3, marginBottom: "4px" }}>{item.name}</p>
                    <p style={{ fontSize: "13px", color: "#555" }}>{item.vendor_name}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.product_id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#3A3A3A", fontSize: "20px", padding: "0", flexShrink: 0, lineHeight: 1 }}
                >
                  ×
                </button>
              </div>

              {/* Price + Add to cart */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px" }}>
                <div>
                  <p style={{ fontWeight: 900, fontSize: "20px", color: "#FFBB1C", letterSpacing: "-0.02em" }}>{formatTZS(item.price)}</p>
                  <p style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>per {item.unit}</p>
                </div>
                <button
                  onClick={() => handleAddToCart(item)}
                  style={{
                    padding: "12px 22px",
                    background: added[item.product_id] ? "#22c55e" : "#FFBB1C",
                    color: "#0C0C0C",
                    fontWeight: 800, fontSize: "12px",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    border: "none", borderRadius: "8px", cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  {added[item.product_id] ? "✓ Added" : "+ Order"}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Link href="/products" style={{ display: "block", textAlign: "center", marginTop: "20px", fontSize: "13px", fontWeight: 600, color: "#3A3A3A", textDecoration: "none" }}>
        + Keep shopping
      </Link>
    </div>
  );
}
