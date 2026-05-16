"use client";
import { useState, useMemo } from "react";
import { PRODUCTS } from "@/lib/mockData";
import ProductCard from "../_components/ProductCard";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"default" | "asc" | "desc">("default");

  const filtered = useMemo(() => {
    let list = PRODUCTS;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [search, sort]);

  return (
    <div style={{ background: "#0C0C0C", minHeight: "100vh", paddingBottom: "24px" }}>

      {/* Header */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <span style={{ width: "3px", height: "16px", background: "#FFBB1C", borderRadius: "2px", display: "block" }} />
          <h1 style={{ fontWeight: 900, fontSize: "18px", letterSpacing: "-0.01em" }}>Marketplace</h1>
        </div>
        <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3A3A3A", paddingLeft: "13px" }}>
          {filtered.length} products · Arusha
        </p>
      </div>

      {/* Search */}
      <div style={{ padding: "14px 20px 0" }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#4A4A4A" strokeWidth="2.2" strokeLinecap="round"
            style={{ position: "absolute", left: "14px", pointerEvents: "none", flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search cement, steel, tiles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "12px 14px 12px 38px",
              background: "#141414",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              fontSize: "13px", color: "#F0F0F0", outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Sort row */}
      <div style={{ padding: "10px 20px 0", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          style={{
            padding: "7px 12px",
            background: "#141414",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "8px",
            fontSize: "11px", fontWeight: 700,
            letterSpacing: "0.07em", textTransform: "uppercase",
            color: "#5A5A5A", outline: "none", cursor: "pointer",
          }}
        >
          <option value="default">Sort: Default</option>
          <option value="asc">Price: Low → High</option>
          <option value="desc">Price: High → Low</option>
        </select>
      </div>

      {/* Grid */}
      <div style={{ padding: "14px 20px 0" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: "60px", paddingBottom: "60px" }}>
            <p style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</p>
            <p style={{ fontWeight: 800, fontSize: "14px", letterSpacing: "-0.01em", marginBottom: "6px" }}>No results</p>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3A3A3A" }}>Try a different search or category</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
