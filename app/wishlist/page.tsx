"use client";
import Link from "next/link";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useCartStore } from "@/lib/cartStore";
import { formatTZS } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { HeartIcon, XIcon, PlusIcon, CheckIcon, PackageIcon } from "@/app/_components/icons/StatusIcons";

/* Visible focus ring on every interactive element (MASTER.md checklist).
   #FFBB1C is the existing --color-accent — no new colours introduced. */
const FOCUS_RING = "focus-visible:[outline:2px_solid_#FFBB1C] focus-visible:[outline-offset:2px]";

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
    });
    setAdded((prev) => ({ ...prev, [item.product_id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [item.product_id]: false })), 1400);
  }

  if (items.length === 0) {
    return (
      <div style={{ background: "#0C0C0C", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem", gap: "1.2rem", textAlign: "center" }}>
        <HeartIcon size={52} style={{ color: "#B0B0B0" }} />
        <h2 style={{ fontWeight: 900, fontSize: "22px", letterSpacing: "-0.02em" }}>Wishlist is Empty</h2>
        <p style={{ fontSize: "14px", color: "#B0B0B0", fontWeight: 400 }}>Save products you love while shopping</p>
        <Link
          href="/products"
          className={"cursor-pointer " + FOCUS_RING}
          style={{ marginTop: "8px", padding: "16px 36px", minHeight: "44px", display: "inline-flex", alignItems: "center", background: "#FFBB1C", color: "#0C0C0C", fontWeight: 800, fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", borderRadius: "8px" }}
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
        <h1 style={{ fontWeight: 900, fontSize: "22px", letterSpacing: "-0.02em" }}>Wishlist</h1>
        <span className="badge-construction">{items.length} saved</span>
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
                <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
                  {/* TODO(handoff): swap this neutral stand-in for the real product icon
                      once lib/productIcon.ts lands — that file is another owner's scope.
                      It replaces the emoji that used to render here at 32px. */}
                  <span
                    style={{
                      width: "44px", height: "44px", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "#141414", border: "1px solid #2A2A2A",
                      borderRadius: "8px", color: "#B0B0B0",
                    }}
                  >
                    <PackageIcon size={24} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: "17px", lineHeight: 1.3, marginBottom: "4px" }}>{item.name}</p>
                    <p style={{ fontSize: "13px", color: "#B0B0B0" }}>{item.vendor_name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.product_id)}
                  aria-label={"Remove " + item.name + " from wishlist"}
                  className={"cursor-pointer " + FOCUS_RING}
                  style={{
                    width: "44px", height: "44px", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "none", border: "none", cursor: "pointer",
                    borderRadius: "8px", color: "#B0B0B0",
                    marginTop: "-10px", marginRight: "-10px",
                    transition: "color 200ms cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  <XIcon size={24} />
                </button>
              </div>

              {/* Price + Add to cart */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginTop: "16px" }}>
                <div>
                  <p style={{ fontWeight: 900, fontSize: "20px", color: "#FFBB1C", letterSpacing: "-0.02em" }}>{formatTZS(item.price)}</p>
                  <p style={{ fontSize: "12px", color: "#B0B0B0", marginTop: "2px" }}>per {item.unit}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddToCart(item)}
                  className={"cursor-pointer " + FOCUS_RING}
                  style={{
                    padding: "0 20px",
                    minHeight: "44px", minWidth: "44px",
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    background: added[item.product_id] ? "#22c55e" : "#FFBB1C",
                    color: "#0C0C0C",
                    fontWeight: 800, fontSize: "12px",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    border: "none", borderRadius: "8px", cursor: "pointer",
                    transition: "background 200ms cubic-bezier(0.4,0,0.2,1)",
                    flexShrink: 0,
                  }}
                >
                  {added[item.product_id] ? <CheckIcon size={24} strokeWidth={2.25} /> : <PlusIcon size={24} strokeWidth={2.25} />}
                  <span aria-live="polite">{added[item.product_id] ? "Added" : "Order"}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Link
        href="/products"
        className={"cursor-pointer " + FOCUS_RING}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          marginTop: "12px", minHeight: "44px",
          fontSize: "13px", fontWeight: 600, color: "#B0B0B0", textDecoration: "none",
          borderRadius: "8px",
        }}
      >
        <PlusIcon size={24} />
        Keep shopping
      </Link>
    </div>
  );
}
