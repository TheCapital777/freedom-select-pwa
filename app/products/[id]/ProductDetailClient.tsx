"use client";
import { useParams, useRouter } from "next/navigation";
import { PRODUCTS, getVendorById } from "@/lib/mockData";
import { formatTZS, buildWhatsAppURL, buildWhatsAppMessage } from "@/lib/utils";
import { useCartStore } from "@/lib/cartStore";
import { useState } from "react";
import Link from "next/link";
import { getProductIcon, getProductIconLabel } from "@/lib/productIcon";
import { StarIcon, CheckIcon, WhatsAppIcon, EmptyCrateIcon, ArrowLeftIcon } from "@/app/_components/icons/StatusIcons";
import VendorMark from "@/app/_components/VendorMark";

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
        <EmptyCrateIcon size={56} style={{ color: "#6B6B6B" }} label="Not found" />
        <p style={{ fontWeight: 900, fontSize: "16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Product not found</p>
        <Link href="/products" style={{ fontSize: "12px", color: "#FFBB1C", textDecoration: "none" }}>← Back to Materials</Link>
      </div>
    );
  }

  const vendor = getVendorById(product.vendor_id);

  function handleAdd() {
    addItem({ product_id: product!.id, name: product!.name, price: product!.price, qty, unit: product!.unit, vendor_id: product!.vendor_id });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const waMsg = buildWhatsAppMessage(
    [{ product_id: product.id, name: product.name, price: product.price, qty, unit: product.unit, vendor_id: product.vendor_id }],
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

        {/* Product icon. Self-hosted inline SVG per design-system/MASTER.md —
            no hotlinked emoji PNG, so this survives a strict img-src CSP. */}
        {(() => {
          const Icon = getProductIcon(product);
          return (
            <Icon
              size={220}
              label={getProductIconLabel(product)}
              style={{ width: "55%", maxWidth: "220px", height: "auto", position: "relative", zIndex: 1 }}
            />
          );
        })()}

        {/* Back button. Restored after an edit of mine removed it; while here,
            raised from #888 (about 3.3:1 on this hero) to the dim text token, and
            padded out to a 44px touch target per design-system/MASTER.md. */}
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          style={{
            position: "absolute", top: "16px", left: "16px",
            background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#B0B0B0", fontSize: "12px", fontWeight: 600,
            letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "0 14px", minHeight: "44px", minWidth: "44px",
            display: "inline-flex", alignItems: "center", gap: "6px",
            borderRadius: "var(--radius-plate)", cursor: "pointer",
          }}
        >
          <ArrowLeftIcon size={14} />
          Back
        </button>

        {/* Featured badge */}
        {product.featured && (
          <span style={{
            position: "absolute", top: "16px", right: "16px",
            background: "#FFBB1C", color: "#0C0C0C",
            fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em",
            textTransform: "uppercase", padding: "4px 8px", borderRadius: "var(--radius-stamp)",
          }}>
            <StarIcon size={10} style={{ verticalAlign: "-1px", marginRight: "3px" }} />
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "20px 20px 32px" }}>

        {/* Vendor + stock */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <VendorMark name={vendor?.name ?? ""} size={20} />
          <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B0B0B0" }}>
            {vendor?.name}
          </p>
          <span style={{
            marginLeft: "auto", fontSize: "12px", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            background: "rgba(34,197,94,0.08)", color: "#22c55e",
            padding: "3px 8px", borderRadius: "var(--radius-stamp)",
          }}>
            <i className="dot" aria-hidden="true" />{product.stock} {product.unit}s in stock
          </span>
        </div>

        {/* Name */}
        <h1 style={{ fontWeight: 900, fontSize: "22px", lineHeight: 1.2, marginBottom: "6px" }}>
          {product.name}
        </h1>

        {/* Price */}
        <p style={{ fontWeight: 900, fontSize: "24px", color: "#FFBB1C", marginBottom: "2px", letterSpacing: "-0.02em" }}>
          {formatTZS(product.price)}
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#B0B0B0", marginLeft: "6px" }}>
            / {product.unit}
          </span>
        </p>

        {/* Description */}
        <p style={{ fontSize: "13px", lineHeight: 1.7, color: "#B0B0B0", marginTop: "12px", marginBottom: "20px" }}>
          {product.description}
        </p>

        {/* Specs */}
        <div style={{ borderRadius: "var(--radius-input)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "20px" }}>
          <div style={{ padding: "10px 14px", background: "#141414", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B0B0B0" }}>
              Specifications
            </p>
          </div>
          {Object.entries(product.specs).map(([key, val], i, arr) => (
            <div key={key} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "11px 14px", background: "#111",
              borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}>
              <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3A3A3A" }}>
                {key}
              </span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#C0C0C0" }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Qty + Total */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", background: "#141414", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "var(--radius-input)" }}>
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              style={{ width: "28px", height: "28px", background: "#1E1E1E", border: "none", color: "#FFBB1C", fontWeight: 900, fontSize: "17px", borderRadius: "var(--radius-plate)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >−</button>
            <span style={{ fontWeight: 900, fontSize: "16px", minWidth: "20px", textAlign: "center" }}>{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              style={{ width: "28px", height: "28px", background: "#1E1E1E", border: "none", color: "#FFBB1C", fontWeight: 900, fontSize: "17px", borderRadius: "var(--radius-plate)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >+</button>
          </div>
          <p style={{ fontWeight: 900, fontSize: "17px", color: "#FFBB1C", flex: 1, textAlign: "right", letterSpacing: "-0.02em" }}>
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
              fontWeight: 800, fontSize: "12px",
              letterSpacing: "0.16em", textTransform: "uppercase",
              borderRadius: "var(--radius-plate)",
              transition: "background 0.2s ease",
            }}
          >
            {added ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <CheckIcon size={14} />
                Added to Cart
              </span>
            ) : (
              "Add to Cart"
            )}
          </button>
          <a
            href={buildWhatsAppURL(waMsg)}
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: "15px 18px",
              background: "rgba(37,211,102,0.08)",
              border: "1px solid rgba(37,211,102,0.2)",
              color: "#25D366",
              fontWeight: 700, fontSize: "12px",
              letterSpacing: "0.1em", textTransform: "uppercase",
              textDecoration: "none", borderRadius: "var(--radius-plate)",
              display: "flex", alignItems: "center", gap: "6px",
            }}
          >
            <WhatsAppIcon size={14} />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
