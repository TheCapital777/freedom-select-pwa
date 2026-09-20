"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { formatTZS } from "@/lib/utils";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useState } from "react";
import { getVendorById } from "@/lib/mockData";
import { getProductIcon } from "@/lib/productIcon";
import { ICON_STROKE } from "@/app/_components/icons/ProductIcons";
import { useRoleStore } from "@/lib/roleStore";

interface Props {
  product: Product;
  index?: number;
}

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#FFBB1C" : "none"} stroke={filled ? "#FFBB1C" : "#888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);

/** Confirmation tick. MASTER.md: status glyphs are SVG, never the ✓ character. */
const CheckMark = ({ size = 14, color = "#22c55e" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable={false}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

/* Below this many units, the count is worth showing on the tile. Chosen against
   the real catalogue (stock runs 45-500) so the badge means "short" rather than
   appearing on everything, which is how scarcity cues stop being believed. */
const LOW_STOCK = 50;

export default function ProductCard({ product, index = 0 }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const { addItem: saveWish, removeItem: removeWish, hasItem } = useWishlistStore();
  const role = useRoleStore((s) => s.role);
  const [added, setAdded] = useState(false);
  const [shared, setShared] = useState(false);
  const vendor = getVendorById(product.vendor_id);
  const wishlisted = hasItem(product.id);
  // Product type → icon. Never keyed on product.emoji (see lib/productIcon.ts).
  const ProductIcon = getProductIcon(product);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      unit: product.unit,
      vendor_id: product.vendor_id,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (wishlisted) {
      removeWish(product.id);
    } else {
      saveWish({
        product_id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        vendor_name: vendor?.name ?? "",
      });
    }
  }

  async function handleShare(e: React.MouseEvent) {
    e.preventDefault();
    const url = `${window.location.origin}/products/${product.id}`;
    const shareData = {
      title: product.name,
      text: `${product.name} — ${formatTZS(product.price)} / ${product.unit} on Freedom Select`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 1800);
      }
    } catch {
      // user cancelled share — do nothing
    }
  }

  const iconBtn: React.CSSProperties = {
    width: "32px", height: "32px", borderRadius: "var(--radius-plate)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, border: "1px solid #2A2A2A",
    background: "#0C0C0C", cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
    >
      <Link
        href={`/products/${product.id}`}
        className="product-tile"
        style={{ display: "block", textDecoration: "none" }}
      >
        {/* Image frame — 1:1 locked by .tile-image-frame; every direct child is
            absolute inset-0 and centred by globals.css. */}
        <div className="tile-image-frame">
          <div style={{
            background: "radial-gradient(circle at 50% 55%, rgba(255,187,28,0.07) 0%, transparent 65%)",
            pointerEvents: "none",
          }} />

          {/* .tile-emoji keeps the hover scale (transform only, no layout shift).
              Decorative: the product name is rendered directly below. */}
          <div className="tile-emoji">
            <ProductIcon size="58%" strokeWidth={ICON_STROKE.lg} />
          </div>

          {product.featured && (
            <span style={{
              inset: "8px 8px auto auto",
              background: "#FFBB1C", color: "#0C0C0C",
              fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "2px 6px", borderRadius: "var(--radius-stamp)",
            }}>Hot</span>
          )}

          {!product.in_stock && (
            <div style={{ background: "rgba(0,0,0,0.7)" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FF6B00" }}>Out of Stock</span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="tile-info">
          <p style={{
            fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
            color: "#B0B0B0", marginBottom: "4px",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{vendor?.name}</p>

          <h3 style={{
            fontSize: "15px", fontWeight: 700, lineHeight: 1.32, color: "#F0F0F0",
            letterSpacing: "-0.01em", marginBottom: "10px", minHeight: "40px",
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const, overflow: "hidden",
          }}>{product.name}</h3>

          {/* Availability — rendered only when it carries information.
              Never colour alone: each pill keeps its word. */}
          {(!product.in_stock || product.stock === 0) ? (
            <span className="pill pill-out" style={{ marginBottom: "10px" }}>Sold out</span>
          ) : product.stock < LOW_STOCK ? (
            <span className="pill pill-low" style={{ marginBottom: "10px" }}>
              {product.stock} {product.unit}{product.stock === 1 ? "" : "s"} left
            </span>
          ) : null}

          {/* Price */}
          <div style={{ marginBottom: "12px" }}>
            <p style={{ fontSize: "17px", fontWeight: 800, color: "#FFBB1C", lineHeight: 1, letterSpacing: "-0.02em" }}>
              {formatTZS(product.price)}
            </p>
            <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#B0B0B0", marginTop: "4px" }}>
              / {product.unit}
            </p>
          </div>

          {/* Action buttons row: wishlist, share, add to cart */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              style={{
                ...iconBtn,
                borderColor: wishlisted ? "rgba(255,187,28,0.45)" : "#2A2A2A",
                background: wishlisted ? "rgba(255,187,28,0.08)" : "#0C0C0C",
              }}
            >
              <HeartIcon filled={wishlisted} />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              title="Share product"
              style={{
                ...iconBtn,
                borderColor: shared ? "rgba(34,197,94,0.45)" : "#2A2A2A",
                background: shared ? "rgba(34,197,94,0.08)" : "#0C0C0C",
              }}
            >
              {shared ? <CheckMark /> : <ShareIcon />}
            </button>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Add to cart */}
            <button
              onClick={handleAdd}
              disabled={!product.in_stock}
              title="Add to cart"
              aria-label={added ? `${product.name} added to cart` : `Add ${product.name} to cart`}
              style={{
                width: "32px", height: "32px", borderRadius: "var(--radius-plate)",
                background: added ? "#22c55e" : "#FFBB1C",
                color: "#0C0C0C", fontSize: "16px", fontWeight: 900,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, border: "none", cursor: "pointer",
                transition: "background 0.2s ease, transform 0.2s ease",
                transform: added ? "scale(1.1)" : "scale(1)",
              }}
            >
              {added
                ? <CheckMark size={16} color="#0C0C0C" />
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0C0C0C" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable={false}><line x1="12" y1="5.5" x2="12" y2="18.5" /><line x1="5.5" y1="12" x2="18.5" y2="12" /></svg>
              }
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
