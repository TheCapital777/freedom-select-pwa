"use client";
import { useParams, useRouter } from "next/navigation";
import { PRODUCTS, getVendorById } from "@/lib/mockData";
import { formatTZS, buildWhatsAppURL, buildWhatsAppMessage } from "@/lib/utils";
import { useCartStore } from "@/lib/cartStore";
import { useState } from "react";
import Link from "next/link";
import { fluent3D } from "@/lib/fluentEmoji";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const product = PRODUCTS.find((p) => p.id === id);
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div style={{ background: "#0C0C0C", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "0 24px" }}>
        <p style={{ fontSize: "48px" }}>😕</p>
        <p style={{ fontWeight: 900, fontSize: "16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Product not found</p>
        <Link href="/products" style={{ fontSize: "12px", color: "#FFBB1C", textDecoration: "none" }}>← Back to Materials</Link>
      </div>
    );
  }

  const vendor = getVendorById(product.vendor_id);

  function handleAdd() {
    addItem({ product_id: product!.id, name: product!.name, price: product!.price, qty, unit: product!.unit, vendor_id: product!.vendor_id, emoji: product!.emoji });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const waMsg = buildWhatsAppMessage(
    [{ product_id: product.id, name: product.name, price: product.price, qty, unit: product.unit, vendor_id: product.vendor_id, emoji: product.emoji }],
    "Customer", "", "Arusha", "", product.price * qty, 8000
  );

  return (
    <div style={{ background: "#0C0C0C", minHeight: "100vh" }}>

      {/* Hero image */}
      <div style={{
        position: "relative",
        width: "100%",
        minHeight: "46vh",
        background: "#111",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* Subtle glow */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at 50% 60%, rgba(255,187,28,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        {/* 3D icon or fallback emoji */}
        {fluent3D(product.emoji) ? (
          <img
            src={fluent3D(product.emoji)!}
            alt={product.name}
            style={{ width: "55%", maxWidth: "220px", objectFit: "contain", position: "relative", zIndex: 1 }}
          />
        ) : (
          <span style={{ fontSize: "clamp(6rem, 22vw, 9rem)", lineHeight: 1, position: "relative", zIndex: 1 }}>
            {product.emoji}
          </span>
        )}

        {/* Back button */}
        <button
          onClick={() => router.back()}
          style={{
            position: "absolute", top: "16px", left: "16px",
            background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#888", fontSize: "11px", fontWeight: 600,
            letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "7px 12px", borderRadius: "6px", cursor: "pointer",
          }}
        >
          ← Back
        </button>

        {/* Featured badge */}
        {product.featured && (
          <span style={{
            position: "absolute", top: "16px", right: "16px",
            background: "#FFBB1C", color: "#0C0C0C",
            fontSize: "8px", fontWeight: 800, letterSpacing: "0.1em",
            textTransform: "uppercase", padding: "4px 8px", borderRadius: "4px",
          }}>
            ★ Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "20px 20px 32px" }}>

        {/* Vendor + stock */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span style={{ fontSize: "14px" }}>{vendor?.emoji}</span>
          <p style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#444" }}>
            {vendor?.name}
          </p>
          <span style={{
            marginLeft: "auto", fontSize: "9px", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            background: "rgba(34,197,94,0.08)", color: "#22c55e",
            padding: "3px 8px", borderRadius: "4px",
          }}>
            ● {product.stock} {product.unit}s in stock
          </span>
        </div>

        {/* Name */}
        <h1 style={{ fontWeight: 900, fontSize: "22px", lineHeight: 1.2, marginBottom: "6px" }}>
          {product.name}
        </h1>

        {/* Price */}
        <p style={{ fontWeight: 900, fontSize: "24px", color: "#FFBB1C", marginBottom: "2px", letterSpacing: "-0.02em" }}>
          {formatTZS(product.price)}
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#444", marginLeft: "6px" }}>
            / {product.unit}
          </span>
        </p>

        {/* Description */}
        <p style={{ fontSize: "13px", lineHeight: 1.7, color: "#555", marginTop: "12px", marginBottom: "20px" }}>
          {product.description}
        </p>

        {/* Specs */}
        <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "20px" }}>
          <div style={{ padding: "10px 14px", background: "#141414", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#444" }}>
              Specifications
            </p>
          </div>
          {Object.entries(product.specs).map(([key, val], i, arr) => (
            <div key={key} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "11px 14px", background: "#111",
              borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}>
              <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3A3A3A" }}>
                {key}
              </span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#C0C0C0" }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Qty + Total */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", background: "#141414", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px" }}>
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              style={{ width: "28px", height: "28px", background: "#1E1E1E", border: "none", color: "#FFBB1C", fontWeight: 900, fontSize: "18px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >−</button>
            <span style={{ fontWeight: 900, fontSize: "15px", minWidth: "20px", textAlign: "center" }}>{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              style={{ width: "28px", height: "28px", background: "#1E1E1E", border: "none", color: "#FFBB1C", fontWeight: 900, fontSize: "18px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >+</button>
          </div>
          <p style={{ fontWeight: 900, fontSize: "18px", color: "#FFBB1C", flex: 1, textAlign: "right", letterSpacing: "-0.02em" }}>
            {formatTZS(product.price * qty)}
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleAdd}
            style={{
              flex: 1, padding: "15px 0",
              background: added ? "#22c55e" : "#FFBB1C",
              color: "#0C0C0C", border: "none", cursor: "pointer",
              fontWeight: 800, fontSize: "11px",
              letterSpacing: "0.16em", textTransform: "uppercase",
              borderRadius: "6px",
              transition: "background 0.2s ease",
            }}
          >
            {added ? "✓ Added to Cart" : "Add to Cart"}
          </button>
          <a
            href={buildWhatsAppURL(waMsg)}
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: "15px 18px",
              background: "rgba(37,211,102,0.08)",
              border: "1px solid rgba(37,211,102,0.2)",
              color: "#25D366",
              fontWeight: 700, fontSize: "11px",
              letterSpacing: "0.1em", textTransform: "uppercase",
              textDecoration: "none", borderRadius: "6px",
              display: "flex", alignItems: "center", gap: "6px",
            }}
          >
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
