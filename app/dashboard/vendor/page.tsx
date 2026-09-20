"use client";
import { useState } from "react";
import { VENDORS, getProductsByVendor, getOrdersByVendor } from "@/lib/mockData";
import { formatTZS } from "@/lib/utils";
import { motion } from "framer-motion";
import { MapPinIcon, CheckIcon, StarIcon, EmptyCrateIcon } from "@/app/_components/icons/StatusIcons";
import VendorMark from "@/app/_components/VendorMark";
import { getProductIcon } from "@/lib/productIcon";

const TABS = ["My Catalog", "Fulfillments", "Wallet"] as const;
type Tab = typeof TABS[number];

const STATUS_CONFIG = {
  pending:    { label: "Pending",    color: "#B0B0B0",    bg: "rgba(136,136,136,0.1)" },
  confirmed:  { label: "Confirmed",  color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  dispatched: { label: "Dispatched", color: "#FFBB1C", bg: "rgba(255,187,28,0.12)" },
  delivered:  { label: "Delivered",  color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
};

const card: React.CSSProperties = { background: "#161616", border: "1px solid #242424", borderRadius: "12px" };

export default function VendorHome() {
  const [tab, setTab] = useState<Tab>("My Catalog");

  const vendor = VENDORS[0];
  const products = getProductsByVendor(vendor.id);
  const orders = getOrdersByVendor(vendor.id);
  const pending = orders.filter((o) => o.status === "pending" || o.status === "confirmed");

  return (
    <div style={{ background: "#0C0C0C", minHeight: "100vh" }}>

      {/* Vendor identity header */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #1E1E1E" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", background: "#1A1A1A", border: "1px solid #2A2A2A", flexShrink: 0 }}>
            <VendorMark name={vendor.name} size={44} tone="accent" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 900, fontSize: "18px", letterSpacing: "-0.01em", marginBottom: "5px" }}>{vendor.name}</p>
            <p style={{ fontSize: "13px", color: "#B0B0B0", display: "flex", alignItems: "center", gap: "5px" }}>
              <MapPinIcon size={13} />
              {vendor.location}
            </p>
          </div>
          <span style={{ padding: "6px 14px", borderRadius: "6px", background: "rgba(34,197,94,0.1)", color: "#22c55e", fontSize: "12px", fontWeight: 700 }}>
            ● Active
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
          {[
            { label: "Products", val: vendor.products_count },
            { label: "Pending",  val: pending.length },
            { label: "Rating",   val: vendor.rating, star: true },
          ].map((k) => (
            <div key={k.label} style={{ ...card, padding: "14px 12px", textAlign: "center" }}>
              <p style={{ fontWeight: 900, fontSize: "20px", color: "#FFBB1C", marginBottom: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                {"star" in k && k.star ? <StarIcon size={15} /> : null}
                {k.val}
              </p>
              <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#444" }}>{k.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #1E1E1E", overflowX: "auto" }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              flex: 1, position: "relative", whiteSpace: "nowrap",
              padding: "18px 12px",
              fontSize: "13px", fontWeight: 700,
              letterSpacing: "0.06em", textTransform: "uppercase",
              color: tab === t ? "#FFBB1C" : "#444",
              background: "none", border: "none", cursor: "pointer",
              transition: "color 0.2s",
            }}
          >
            {t}
            {t === "Fulfillments" && pending.length > 0 && (
              <span style={{ marginLeft: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "18px", height: "18px", borderRadius: "50%", background: "#FFBB1C", color: "#0C0C0C", fontSize: "10px", fontWeight: 900 }}>
                {pending.length}
              </span>
            )}
            {tab === t && <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "#FFBB1C" }} />}
          </button>
        ))}
      </div>

      <div style={{ padding: "24px 20px 48px" }}>

        {/* MY CATALOG */}
        {tab === "My Catalog" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {products.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                style={{ ...card, display: "flex", gap: "16px", padding: "18px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "#0C0C0C", border: "1px solid #2A2A2A", color: "#B0B0B0" }}>
                  {(() => { const Icon = getProductIcon(p); return <Icon size={28} />; })()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: "16px", lineHeight: 1.3, marginBottom: "6px" }}>{p.name}</p>
                  <p style={{ fontWeight: 800, fontSize: "16px", color: "#FFBB1C", marginBottom: "10px" }}>{formatTZS(p.price)} / {p.unit}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: "5px", background: "rgba(34,197,94,0.1)", color: "#22c55e", fontSize: "12px", fontWeight: 700 }}>● {p.stock} in stock</span>
                    {p.featured && <span style={{ padding: "4px 10px", borderRadius: "5px", background: "#FFBB1C", color: "#0C0C0C", fontSize: "11px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "4px" }}><StarIcon size={11} />Featured</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* FULFILLMENTS */}
        {tab === "Fulfillments" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {orders.length === 0 ? (
              <div style={{ ...card, padding: "48px 24px", textAlign: "center" }}>
                <EmptyCrateIcon size={40} style={{ marginBottom: "12px", color: "#6B6B6B" }} label="Nothing here yet" />
                <p style={{ fontSize: "16px", color: "#B0B0B0" }}>No orders yet</p>
              </div>
            ) : orders.map((o, i) => {
              const st = STATUS_CONFIG[o.status];
              const myItems = o.items.filter((it) => it.vendor_id === vendor.id);
              return (
                <motion.div key={o.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ ...card, overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", borderBottom: "1px solid #1E1E1E" }}>
                    <p style={{ fontWeight: 800, fontSize: "15px", color: "#FFBB1C" }}>{o.id}</p>
                    <span style={{ padding: "6px 12px", borderRadius: "6px", background: st.bg, color: st.color, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{st.label}</span>
                  </div>
                  <div style={{ padding: "18px 18px" }}>
                    {myItems.map((it) => (
                      <p key={it.product_id} style={{ fontSize: "14px", color: "#B0B0B0", marginBottom: "8px" }}>
                        → Pack: <span style={{ color: "#F0F0F0", fontWeight: 700 }}>{it.product_name} ×{it.qty} {it.unit}</span>
                      </p>
                    ))}
                    <p style={{ fontSize: "13px", color: "#B0B0B0", marginBottom: "16px", display: "flex", alignItems: "center", gap: "5px" }}>
                    <MapPinIcon size={13} />
                    Deliver to: {o.delivery_address}
                  </p>
                    {o.status === "confirmed" && (
                      <button style={{ width: "100%", padding: "14px", background: "rgba(255,187,28,0.1)", border: "1px solid rgba(255,187,28,0.25)", borderRadius: "8px", color: "#FFBB1C", fontSize: "13px", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>
                        Mark Ready for Pickup
                        <CheckIcon size={13} style={{ marginLeft: "6px", verticalAlign: "-2px" }} />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* WALLET */}
        {tab === "Wallet" && (
          <div>
            <div style={{ ...card, padding: "28px 20px", marginBottom: "20px", textAlign: "center", background: "linear-gradient(135deg, #181208, #141414)", border: "1px solid rgba(255,187,28,0.25)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: "96px", height: "96px", borderRadius: "50%", background: "#FFBB1C", opacity: 0.1, filter: "blur(32px)", pointerEvents: "none" }} />
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B0B0B0", marginBottom: "12px" }}>Available Balance</p>
              <p style={{ fontWeight: 900, fontSize: "clamp(2rem,8vw,3rem)", color: "#FFBB1C", letterSpacing: "-0.03em", marginBottom: "8px" }}>{formatTZS(vendor.wallet_balance)}</p>
              <p style={{ fontSize: "12px", color: "#444", marginBottom: "24px" }}>After 8% platform commission</p>
              <button style={{ padding: "14px 32px", background: "#FFBB1C", color: "#0C0C0C", fontWeight: 900, fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                Request Withdrawal
              </button>
            </div>

            <div style={{ ...card, padding: "20px", marginBottom: "16px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#FFBB1C", marginBottom: "18px" }}>Revenue Breakdown</p>
              {[
                { label: "Gross Sales",             val: formatTZS(vendor.total_sales),            color: "#F0F0F0" },
                { label: "Platform Commission (8%)", val: `− ${formatTZS(vendor.total_sales * 0.08)}`, color: "#ef4444" },
                { label: "Net Payout",              val: formatTZS(vendor.wallet_balance),         color: "#22c55e" },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < arr.length - 1 ? "1px solid #1A1A1A" : "none" }}>
                  <span style={{ fontSize: "14px", color: "#B0B0B0" }}>{row.label}</span>
                  <span style={{ fontWeight: 800, fontSize: "15px", color: row.color }}>{row.val}</span>
                </div>
              ))}
            </div>

            <div style={{ ...card, padding: "20px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#FFBB1C", marginBottom: "18px" }}>Recent Transactions</p>
              {getOrdersByVendor(vendor.id).map((o, i, arr) => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < arr.length - 1 ? "1px solid #1A1A1A" : "none" }}>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: "14px", color: "#FFBB1C", marginBottom: "4px" }}>{o.id}</p>
                    <p style={{ fontSize: "12px", color: "#B0B0B0" }}>{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "15px", color: "#22c55e", fontWeight: 800, marginBottom: "3px" }}>+{formatTZS(o.vendor_payout)}</p>
                    <p style={{ fontSize: "12px", color: "#444" }}>After commission</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
