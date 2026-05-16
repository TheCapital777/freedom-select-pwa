"use client";
import { motion } from "framer-motion";
import { ORDERS, VENDORS } from "@/lib/mockData";
import { formatTZS } from "@/lib/utils";

const card: React.CSSProperties = {
  background: "#161616",
  border: "1px solid #242424",
  borderRadius: "14px",
};

export default function AdminRevenuePage() {
  const totalGMV        = ORDERS.reduce((s, o) => s + o.total, 0);
  const totalCommission = ORDERS.reduce((s, o) => s + o.commission, 0);
  const totalPayout     = ORDERS.reduce((s, o) => s + o.vendor_payout, 0);
  const totalDelivery   = ORDERS.reduce((s, o) => s + o.delivery_fee, 0);
  const totalRevenue    = totalCommission + totalDelivery;
  const totalVendorSales = VENDORS.reduce((s, v) => s + v.total_sales, 0);

  return (
    <div style={{ background: "#0C0C0C", minHeight: "100vh", padding: "28px 20px 80px" }}>

      {/* Page title */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <div style={{ width: "3px", height: "26px", background: "#22c55e", borderRadius: "2px", flexShrink: 0 }} />
        <div>
          <h1 style={{ fontWeight: 900, fontSize: "22px", letterSpacing: "-0.02em" }}>Revenue</h1>
          <p style={{ fontSize: "13px", color: "#555", marginTop: "3px" }}>Platform financial performance · All time</p>
        </div>
      </div>

      {/* Hero P&L card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        style={{
          ...card, padding: "28px 24px", marginBottom: "20px",
          background: "linear-gradient(135deg, #0d1a0d, #131313)",
          border: "1px solid rgba(34,197,94,0.3)",
          position: "relative", overflow: "hidden",
        }}>
        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "160px", height: "160px", borderRadius: "50%", background: "#22c55e", opacity: 0.06, filter: "blur(50px)", pointerEvents: "none" }} />
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#22c55e", marginBottom: "8px" }}>Net Platform Revenue</p>
        <p style={{ fontWeight: 900, fontSize: "44px", letterSpacing: "-0.04em", color: "#22c55e", lineHeight: 1, marginBottom: "6px" }}>{formatTZS(totalRevenue)}</p>
        <p style={{ fontSize: "13px", color: "#555", marginBottom: "28px" }}>Commission + delivery margin across {ORDERS.length} orders</p>

        {/* Revenue breakdown rows */}
        {[
          { label: "Total GMV",          val: formatTZS(totalGMV),           color: "#F0F0F0", note: "Gross customer spend"          },
          { label: "Commission (8%)",     val: formatTZS(totalCommission),    color: "#22c55e", note: "Auto-deducted per order"        },
          { label: "Delivery Margin",     val: formatTZS(totalDelivery),      color: "#60a5fa", note: "Collected delivery fees"        },
          { label: "Total Platform Rev",  val: formatTZS(totalRevenue),       color: "#FFBB1C", note: "Commission + delivery"          },
          { label: "Vendor Payouts",      val: `− ${formatTZS(totalPayout)}`, color: "#ef4444", note: "Net disbursed to vendors"       },
        ].map((row, i) => (
          <div key={row.label} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "16px 0",
            borderBottom: i < 4 ? "1px solid #1A1A1A" : "none",
          }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#888", marginBottom: "3px" }}>{row.label}</p>
              <p style={{ fontSize: "12px", color: "#3A3A3A" }}>{row.note}</p>
            </div>
            <p style={{ fontWeight: 900, fontSize: "18px", color: row.color }}>{row.val}</p>
          </div>
        ))}
      </motion.div>

      {/* Quick stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
        {[
          { icon: "📦", val: ORDERS.length,          label: "Orders",          color: "#60a5fa" },
          { icon: "🏪", val: VENDORS.length,          label: "Vendors",         color: "#a78bfa" },
          { icon: "💰", val: formatTZS(totalCommission), label: "Commission",   color: "#22c55e" },
          { icon: "🚛", val: formatTZS(totalDelivery),   label: "Delivery Rev", color: "#FFBB1C" },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
            style={{ ...card, padding: "20px 18px" }}>
            <p style={{ fontSize: "24px", marginBottom: "12px" }}>{k.icon}</p>
            <p style={{ fontWeight: 900, fontSize: typeof k.val === "number" ? "32px" : "18px", color: k.color, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "8px" }}>{k.val}</p>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#444" }}>{k.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Vendor revenue contribution */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ ...card, padding: "24px 22px", marginBottom: "20px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#FFBB1C", marginBottom: "22px" }}>Vendor Revenue Contribution</p>
        {VENDORS.map((v, i) => {
          const share = Math.round((v.total_sales / totalVendorSales) * 100);
          const comm  = Math.round(v.total_sales * v.commission_rate);
          return (
            <motion.div key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 + i * 0.08 }}
              style={{ marginBottom: i < VENDORS.length - 1 ? "24px" : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "10px" }}>
                <div>
                  <p style={{ fontWeight: 800, fontSize: "15px", marginBottom: "4px" }}>{v.emoji} {v.name}</p>
                  <p style={{ fontSize: "13px", color: "#555" }}>{formatTZS(v.total_sales)} sales · <span style={{ color: "#22c55e" }}>{formatTZS(comm)}</span> commission</p>
                </div>
                <p style={{ fontWeight: 900, fontSize: "22px", color: "#FFBB1C", letterSpacing: "-0.02em" }}>{share}%</p>
              </div>
              <div style={{ height: "8px", borderRadius: "6px", background: "#1E1E1E" }}>
                <motion.div
                  initial={{ width: "0%" }} animate={{ width: `${share}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: [0, 0, 0.2, 1] }}
                  style={{ height: "8px", borderRadius: "6px", background: "#FFBB1C" }} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Per-order ledger */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ ...card, padding: "24px 22px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#FFBB1C", marginBottom: "20px" }}>Order Revenue Ledger</p>
        {ORDERS.map((o, i) => (
          <div key={o.id} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "18px 0",
            borderBottom: i < ORDERS.length - 1 ? "1px solid #1A1A1A" : "none",
          }}>
            <div>
              <p style={{ fontWeight: 800, fontSize: "16px", color: "#FFBB1C", marginBottom: "5px" }}>{o.id}</p>
              <p style={{ fontSize: "13px", color: "#555" }}>{o.customer_name}</p>
              <p style={{ fontSize: "12px", color: "#3A3A3A", marginTop: "3px" }}>{o.items.length} item{o.items.length !== 1 ? "s" : ""} · {o.delivery_address}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "15px", fontWeight: 900, color: "#22c55e", marginBottom: "5px" }}>+{formatTZS(o.commission)}</p>
              <p style={{ fontSize: "13px", color: "#60a5fa", fontWeight: 700, marginBottom: "4px" }}>+{formatTZS(o.delivery_fee)} delivery</p>
              <p style={{ fontSize: "12px", color: "#ef4444", fontWeight: 600 }}>−{formatTZS(o.vendor_payout)} vendor</p>
            </div>
          </div>
        ))}

        {/* Totals footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "20px", borderTop: "1px solid #242424", marginTop: "4px" }}>
          <p style={{ fontWeight: 800, fontSize: "14px", color: "#888" }}>Total Platform Revenue</p>
          <p style={{ fontWeight: 900, fontSize: "20px", color: "#22c55e" }}>{formatTZS(totalRevenue)}</p>
        </div>
      </motion.div>
    </div>
  );
}
