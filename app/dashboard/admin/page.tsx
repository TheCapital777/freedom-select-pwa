"use client";
import { useState } from "react";
import { ORDERS, DELIVERY_TASKS, PRODUCTS } from "@/lib/mockData";
import { useDirectoryStore } from "@/lib/directoryStore";
import Link from "next/link";
import { formatTZS } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import VendorMark from "@/app/_components/VendorMark";

const TABS = ["Overview", "Vendors", "Transport", "Orders"] as const;
type Tab = typeof TABS[number];

const STATUS_CONFIG = {
  pending:    { label: "Pending",    color: "#B0B0B0", bg: "rgba(176,176,176,0.1)" },
  confirmed:  { label: "Confirmed",  color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  dispatched: { label: "Dispatched", color: "#FFBB1C", bg: "rgba(255,187,28,0.12)" },
  delivered:  { label: "Delivered",  color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
};

const DELIVERY_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  pending:          { label: "Pending",         color: "#B0B0B0", bg: "rgba(176,176,176,0.1)" },
  ready_for_pickup: { label: "Ready Pickup",    color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  in_transit:       { label: "In Transit",      color: "#FFBB1C", bg: "rgba(255,187,28,0.12)" },
  delivered:        { label: "Delivered",       color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
};

const card: React.CSSProperties = {
  background: "#161616",
  border: "1px solid #242424",
  borderRadius: "var(--radius-card)",
};

/* Figures: tabular so a digit change never shifts the column, and money is
   allowed to break after "TZS" so a narrow cell can never overflow the grid. */
const num: React.CSSProperties = { fontVariantNumeric: "tabular-nums" };

/* Micro label — #B0B0B0 (text-dim, 9.0:1). Was #444 at 2.0:1. */
const microLabel: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#B0B0B0",
};

/* Divider grid: the 1px gap is the rule, so cells can wrap at 375px without
   leaving a dangling border or forcing horizontal scroll. */
const splitGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(108px, 1fr))",
  gap: "1px",
  background: "#1A1A1A",
};
const splitCell: React.CSSProperties = {
  padding: "18px 14px",
  textAlign: "center",
  background: "#161616",
};

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("Overview");
  // Vendors come from the directory store, not the mockData constant, so a vendor
  // an admin adds or suspends on /dashboard/admin/directory shows up here too.
  const VENDORS = useDirectoryStore((s) => s.vendors);
  const totalGMV        = ORDERS.reduce((s, o) => s + o.total, 0);
  const totalCommission = ORDERS.reduce((s, o) => s + o.commission, 0);
  const totalPayout     = ORDERS.reduce((s, o) => s + o.vendor_payout, 0);
  const totalDelivery   = ORDERS.reduce((s, o) => s + o.delivery_fee, 0);
  const activeVendors   = VENDORS.filter(v => v.status === "active").length;
  const inTransit       = DELIVERY_TASKS.filter(d => d.status === "in_transit").length;
  const completedToday  = DELIVERY_TASKS.filter(d => d.status === "delivered").length;
  const totalProducts   = PRODUCTS.length;
  const totalVendorSales = VENDORS.reduce((s, v) => s + v.total_sales, 0);

  return (
    <div style={{ background: "#0C0C0C", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #1A1A1A" }}>
        <div style={{ marginBottom: "24px" }}>
          {/* Logo crop */}
          <Link href="/" style={{ display: "block", overflow: "hidden", height: "52px", flexShrink: 0, width: "fit-content" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Freedom Select"
              style={{ height: "170px", width: "auto", marginTop: "-55px", display: "block" }} />
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <VendorMark initials="CEO" size={56} tone="accent" />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 900, fontSize: "22px", letterSpacing: "-0.02em" }}>CEO Dashboard</p>
            <p style={{ fontSize: "13px", color: "#B0B0B0", marginTop: "4px" }}>Freedom Select · Arusha Operations</p>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", borderBottom: "1px solid #1A1A1A", overflowX: "auto" }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              flexShrink: 0, position: "relative", whiteSpace: "nowrap",
              padding: "18px 22px", minHeight: "48px",
              fontSize: "13px", fontWeight: 700,
              letterSpacing: "0.06em", textTransform: "uppercase",
              color: tab === t ? "#FFBB1C" : "#B0B0B0",
              background: "none", border: "none", cursor: "pointer",
              transition: "color 0.2s",
            }}>
            {t}
            {tab === t && <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "#FFBB1C" }} />}
          </button>
        ))}
      </div>

      <div style={{ padding: "28px 20px 56px" }}>
        <AnimatePresence mode="wait">

          {/* ════════════════ OVERVIEW ════════════════ */}
          {tab === "Overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* Hero revenue strip */}
              <div style={{
                ...card, padding: "28px 24px", marginBottom: "20px",
                background: "linear-gradient(135deg, #181208, #131313)",
                border: "1px solid rgba(255,187,28,0.3)",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "160px", height: "160px", borderRadius: "50%", background: "#FFBB1C", opacity: 0.06, filter: "blur(50px)", pointerEvents: "none" }} />
                <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#FFBB1C", marginBottom: "10px" }}>Platform GMV (All Time)</p>
                <p style={{ ...num, fontWeight: 900, fontSize: "clamp(1.9rem, 9vw, 2.4rem)", letterSpacing: "-0.03em", color: "#F0F0F0", lineHeight: 1, marginBottom: "6px" }}>{formatTZS(totalGMV)}</p>
                <p style={{ fontSize: "13px", color: "#B0B0B0", marginBottom: "28px" }}>Gross Merchandise Value · {ORDERS.length} orders processed</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(104px, 1fr))", gap: "12px" }}>
                  {[
                    { label: "Platform Revenue", val: formatTZS(totalCommission + totalDelivery), color: "#22c55e" },
                    { label: "Vendor Payouts",   val: formatTZS(totalPayout),                     color: "#60a5fa" },
                    { label: "Delivery Margin",  val: formatTZS(totalDelivery),                   color: "#a78bfa" },
                  ].map((s) => (
                    <div key={s.label} style={{ padding: "14px 12px", background: "#0C0C0C", border: "1px solid #2A2A2A", borderRadius: "var(--radius-input)", textAlign: "center" }}>
                      <p style={{ ...num, fontWeight: 900, fontSize: "16px", color: s.color, marginBottom: "6px" }}>{s.val}</p>
                      <p style={{ ...microLabel, fontSize: "12px" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPI row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "14px", marginBottom: "20px" }}>
                {[
                  { val: ORDERS.length,  label: "Total Orders",   color: "#60a5fa" },
                  { val: activeVendors,  label: "Active Vendors", color: "#a78bfa" },
                  { val: inTransit,      label: "In Transit Now", color: "#FFBB1C" },
                  { val: totalProducts,  label: "Live Products",  color: "#22c55e" },
                ].map((k, i) => (
                  <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    style={{ ...card, padding: "22px 20px" }}>
                    {/* Colour rule replaces the emoji that used to sit here */}
                    <div aria-hidden style={{ width: "26px", height: "3px", borderRadius: "var(--radius-stamp)", background: k.color, marginBottom: "16px" }} />
                    <p style={{ ...num, fontWeight: 900, fontSize: "30px", color: k.color, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "8px" }}>{k.val}</p>
                    <p style={{ ...microLabel, fontSize: "12px", letterSpacing: "0.12em" }}>{k.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Orders by status */}
              <div style={{ ...card, padding: "24px 22px", marginBottom: "20px" }}>
                <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#FFBB1C", marginBottom: "20px" }}>Orders by Status</p>
                {(["pending", "confirmed", "dispatched", "delivered"] as const).map((s) => {
                  const count = ORDERS.filter(o => o.status === s).length;
                  const pct = Math.round((count / ORDERS.length) * 100);
                  const cfg = STATUS_CONFIG[s];
                  return (
                    <div key={s} style={{ marginBottom: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                        <span style={{ ...num, fontSize: "13px", color: "#B0B0B0", fontWeight: 600, flexShrink: 0 }}>{count} order{count !== 1 ? "s" : ""} · {pct}%</span>
                      </div>
                      <div style={{ height: "8px", borderRadius: "var(--radius-plate)", background: "#1E1E1E" }}>
                        <div style={{ height: "8px", borderRadius: "var(--radius-plate)", width: `${pct}%`, background: cfg.color, transition: "width 0.7s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live transport snapshot */}
              <div style={{ ...card, padding: "24px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#FFBB1C" }}>Live Transport</p>
                  <span style={{ ...num, fontSize: "12px", fontWeight: 600, color: "#B0B0B0" }}>{inTransit} in transit · {completedToday} done today</span>
                </div>
                {DELIVERY_TASKS.map((dt) => {
                  const ds = DELIVERY_STATUS[dt.status];
                  return (
                    <div key={dt.id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 0", borderBottom: "1px solid #1A1A1A" }}>
                      {/* Status rail — the word is still on the badge, so colour is never the only signal */}
                      <span aria-hidden style={{ width: "3px", alignSelf: "stretch", minHeight: "34px", borderRadius: "var(--radius-stamp)", background: ds.color, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dt.customer_name}</p>
                        <p style={{ fontSize: "12px", color: "#B0B0B0" }}>{dt.delivery_location}</p>
                      </div>
                      <span style={{ padding: "5px 10px", borderRadius: "var(--radius-plate)", background: ds.bg, color: ds.color, fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>{ds.label}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ════════════════ VENDORS ════════════════ */}
          {tab === "Vendors" && (
            <motion.div key="vendors" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* Vendor leaderboard header */}
              <div style={{ ...card, padding: "24px 22px", marginBottom: "20px", background: "linear-gradient(135deg, #12101a, #131313)", border: "1px solid rgba(167,139,250,0.25)" }}>
                <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#a78bfa", marginBottom: "10px" }}>Vendor Network</p>
                <p style={{ ...num, fontWeight: 900, fontSize: "24px", letterSpacing: "-0.02em", marginBottom: "6px" }}>{VENDORS.length} Vendors · {totalProducts} Products</p>
                <p style={{ ...num, fontSize: "13px", color: "#B0B0B0" }}>Combined GMV contribution: {formatTZS(totalVendorSales)}</p>
              </div>

              {/* Add and remove live here rather than on this read-only overview. */}
              <Link
                href="/dashboard/admin/directory"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "7px",
                  minHeight: "44px", padding: "0 16px", marginBottom: "18px",
                  background: "#FFBB1C", color: "#0C0C0C", borderRadius: "var(--radius-input)",
                  fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em",
                  textTransform: "uppercase", textDecoration: "none",
                }}
              >
                Manage vendors &amp; transporters
              </Link>

              {/* Vendor cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {VENDORS.map((v, i) => {
                  const vendorOrders = ORDERS.filter(o => o.items.some(it => it.vendor_id === v.id));
                  const vendorGMV    = vendorOrders.reduce((s, o) => s + o.total, 0);
                  const commission   = Math.round(v.total_sales * v.commission_rate);
                  const salesShare   = Math.round((v.total_sales / totalVendorSales) * 100);
                  return (
                    <motion.div key={v.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      style={{ ...card, overflow: "hidden" }}>

                      {/* Vendor identity */}
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "22px 20px 18px", borderBottom: "1px solid #1E1E1E" }}>
                        <VendorMark name={v.name} size={54} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 900, fontSize: "17px", marginBottom: "5px" }}>{v.name}</p>
                          <p style={{ fontSize: "13px", color: "#B0B0B0" }}>{v.location}</p>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <span style={{ display: "block", padding: "5px 12px", borderRadius: "var(--radius-plate)", background: "rgba(34,197,94,0.1)", color: "#22c55e", fontSize: "12px", fontWeight: 700, marginBottom: "6px", textTransform: "capitalize" }}><i className="dot" aria-hidden="true" />{v.status}</span>
                          <p style={{ ...num, fontSize: "12px", color: "#B0B0B0" }}>{v.rating} / 5 rating</p>
                        </div>
                      </div>

                      {/* Sales share bar */}
                      <div style={{ padding: "18px 20px", borderBottom: "1px solid #1A1A1A" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "#B0B0B0" }}>Platform share</span>
                          <span style={{ ...num, fontSize: "13px", fontWeight: 800, color: "#FFBB1C" }}>{salesShare}%</span>
                        </div>
                        <div style={{ height: "6px", borderRadius: "var(--radius-stamp)", background: "#1E1E1E" }}>
                          <div style={{ height: "6px", borderRadius: "var(--radius-stamp)", width: `${salesShare}%`, background: "#FFBB1C" }} />
                        </div>
                      </div>

                      {/* Financial stats */}
                      <div style={{ ...splitGrid, borderBottom: "1px solid #1A1A1A" }}>
                        {[
                          { label: "Gross Sales", val: formatTZS(v.total_sales),    color: "#F0F0F0" },
                          { label: "Commission",  val: formatTZS(commission),       color: "#22c55e" },
                          { label: "Wallet Bal.", val: formatTZS(v.wallet_balance), color: "#FFBB1C" },
                        ].map((s) => (
                          <div key={s.label} style={splitCell}>
                            <p style={{ ...num, fontWeight: 900, fontSize: "16px", color: s.color, marginBottom: "6px" }}>{s.val}</p>
                            <p style={microLabel}>{s.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Meta + action */}
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: "180px", display: "flex", flexWrap: "wrap", gap: "12px 18px" }}>
                          {[
                            { label: "Products", val: String(v.products_count) },
                            { label: "Orders",   val: String(vendorOrders.length) },
                            { label: "GMV",      val: formatTZS(vendorGMV) },
                          ].map((m) => (
                            <div key={m.label}>
                              <p style={{ ...microLabel, fontSize: "12px", marginBottom: "3px" }}>{m.label}</p>
                              <p style={{ ...num, fontSize: "13px", fontWeight: 700, color: "#F0F0F0" }}>{m.val}</p>
                            </div>
                          ))}
                        </div>
                        <button style={{
                          padding: "12px 20px", minHeight: "44px", background: "rgba(255,187,28,0.1)",
                          border: "1px solid rgba(255,187,28,0.3)", borderRadius: "var(--radius-input)",
                          color: "#FFBB1C", fontSize: "13px", fontWeight: 700, cursor: "pointer", flexShrink: 0,
                        }}>Pay Out</button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ════════════════ TRANSPORT ════════════════ */}
          {tab === "Transport" && (
            <motion.div key="transport" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* Transport summary */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "14px", marginBottom: "20px" }}>
                {[
                  { val: DELIVERY_TASKS.filter(d => d.status === "pending").length,          label: "Awaiting Pickup",  color: "#B0B0B0" },
                  { val: DELIVERY_TASKS.filter(d => d.status === "ready_for_pickup").length, label: "Ready for Pickup", color: "#60a5fa" },
                  { val: DELIVERY_TASKS.filter(d => d.status === "in_transit").length,       label: "In Transit",       color: "#FFBB1C" },
                  { val: DELIVERY_TASKS.filter(d => d.status === "delivered").length,        label: "Delivered Today",  color: "#22c55e" },
                ].map((k, i) => (
                  <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    style={{ ...card, padding: "22px 18px" }}>
                    <div aria-hidden style={{ width: "26px", height: "3px", borderRadius: "var(--radius-stamp)", background: k.color, marginBottom: "14px" }} />
                    <p style={{ ...num, fontWeight: 900, fontSize: "30px", color: k.color, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "8px" }}>{k.val}</p>
                    <p style={{ ...microLabel, fontSize: "12px" }}>{k.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Delivery task list */}
              <div style={{ ...card, padding: "24px 20px" }}>
                <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#FFBB1C", marginBottom: "20px" }}>All Deliveries</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {DELIVERY_TASKS.map((dt, i) => {
                    const ds = DELIVERY_STATUS[dt.status];
                    return (
                      <motion.div key={dt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        style={{ background: "#0C0C0C", border: "1px solid #222", borderRadius: "var(--radius-card)", overflow: "hidden" }}>
                        <div style={{ height: "3px", background: ds.color, opacity: 0.6 }} />
                        <div style={{ padding: "18px 16px 16px" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontWeight: 800, fontSize: "16px", color: "#FFBB1C", marginBottom: "4px" }}>{dt.order_id}</p>
                              <p style={{ fontSize: "14px", fontWeight: 700 }}>{dt.customer_name}</p>
                            </div>
                            <span style={{ padding: "6px 12px", borderRadius: "var(--radius-plate)", background: ds.bg, color: ds.color, fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>{ds.label}</span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" }}>
                            <div>
                              <p style={{ ...microLabel, fontSize: "12px", marginBottom: "3px" }}>Collect from</p>
                              <p style={{ fontSize: "13px", fontWeight: 600, color: "#B0B0B0" }}>{dt.pickup_location}</p>
                            </div>
                            <div>
                              <p style={{ ...microLabel, fontSize: "12px", marginBottom: "3px" }}>Deliver to</p>
                              <p style={{ fontSize: "13px", fontWeight: 700, color: "#F0F0F0" }}>{dt.delivery_location}</p>
                            </div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                            <p style={{ ...num, fontSize: "13px", color: "#B0B0B0" }}>{dt.items_count} items · {dt.vendor_name}</p>
                            <p style={{ ...num, fontSize: "13px", color: "#B0B0B0" }}>ETA {dt.estimated_time}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════════════ ORDERS ════════════════ */}
          {tab === "Orders" && (
            <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {ORDERS.map((o, i) => {
                  const st = STATUS_CONFIG[o.status];
                  return (
                    <motion.div key={o.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      style={{ ...card, overflow: "hidden" }}>
                      <div style={{ height: "3px", background: st.color, opacity: 0.6 }} />

                      {/* Order header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", padding: "20px 20px 16px", borderBottom: "1px solid #1A1A1A" }}>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontWeight: 900, fontSize: "17px", color: "#FFBB1C", marginBottom: "6px" }}>{o.id}</p>
                          <p style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>{o.customer_name}</p>
                          <p style={{ ...num, fontSize: "13px", color: "#B0B0B0" }}>{o.customer_phone}</p>
                        </div>
                        <span style={{ padding: "7px 14px", borderRadius: "var(--radius-input)", background: st.bg, color: st.color, fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0 }}>{st.label}</span>
                      </div>

                      {/* Financial split */}
                      <div style={{ ...splitGrid, borderBottom: "1px solid #1A1A1A" }}>
                        {[
                          { label: "Order Total", val: formatTZS(o.total),         color: "#FFBB1C" },
                          { label: "Commission",  val: formatTZS(o.commission),    color: "#22c55e" },
                          { label: "Vendor Out",  val: formatTZS(o.vendor_payout), color: "#60a5fa" },
                        ].map((c) => (
                          <div key={c.label} style={splitCell}>
                            <p style={{ ...num, fontWeight: 900, fontSize: "16px", color: c.color, marginBottom: "6px" }}>{c.val}</p>
                            <p style={microLabel}>{c.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Items */}
                      <div style={{ padding: "16px 20px 14px", borderBottom: "1px solid #1A1A1A" }}>
                        {o.items.map((it) => (
                          <div key={it.product_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", padding: "8px 0" }}>
                            <p style={{ fontSize: "13px", color: "#B0B0B0", flex: 1, minWidth: 0 }}>{it.product_name}</p>
                            <p style={{ ...num, fontSize: "13px", fontWeight: 700, color: "#F0F0F0", flexShrink: 0 }}>×{it.qty} · {formatTZS(it.subtotal)}</p>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", flexWrap: "wrap" }}>
                        <p style={{ fontSize: "13px", color: "#B0B0B0", flex: 1, minWidth: "140px" }}>
                          <span style={{ ...microLabel, fontSize: "12px", marginRight: "8px" }}>Deliver to</span>
                          {o.delivery_address}
                        </p>
                        <p style={{ ...num, fontSize: "12px", color: "#B0B0B0", flexShrink: 0 }}>{new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
