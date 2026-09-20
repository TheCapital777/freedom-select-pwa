"use client";
import { motion } from "framer-motion";
import { ORDERS, VENDORS } from "@/lib/mockData";
import { formatTZS } from "@/lib/utils";
import VendorMark from "@/app/_components/VendorMark";

const card: React.CSSProperties = {
  background: "#161616",
  border: "1px solid #242424",
  borderRadius: "14px",
};

const num: React.CSSProperties = { fontVariantNumeric: "tabular-nums" };

const microLabel: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#B0B0B0",
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
          <p style={{ fontSize: "13px", color: "#B0B0B0", marginTop: "3px" }}>Platform financial performance · All time</p>
        </div>
      </div>

      {/* Hero P&L card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        style={{
          ...card, padding: "28px 22px", marginBottom: "20px",
          background: "linear-gradient(135deg, #0d1a0d, #131313)",
          border: "1px solid rgba(34,197,94,0.3)",
          position: "relative", overflow: "hidden",
        }}>
        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "160px", height: "160px", borderRadius: "50%", background: "#22c55e", opacity: 0.06, filter: "blur(50px)", pointerEvents: "none" }} />
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#22c55e", marginBottom: "8px" }}>Net Platform Revenue</p>
        {/* Was a fixed 44px: "TZS 1,352,000" overran the 287px card interior at 375px */}
        <p style={{ ...num, fontWeight: 900, fontSize: "clamp(1.75rem, 8.5vw, 2.75rem)", letterSpacing: "-0.04em", color: "#22c55e", lineHeight: 1.05, marginBottom: "6px" }}>{formatTZS(totalRevenue)}</p>
        <p style={{ fontSize: "13px", color: "#B0B0B0", marginBottom: "24px" }}>Commission + delivery margin across {ORDERS.length} orders</p>

        {/* Revenue breakdown rows */}
        {[
          { label: "Total GMV",          val: formatTZS(totalGMV),           color: "#F0F0F0", note: "Gross customer spend"          },
          { label: "Commission (8%)",     val: formatTZS(totalCommission),    color: "#22c55e", note: "Auto-deducted per order"        },
          { label: "Delivery Margin",     val: formatTZS(totalDelivery),      color: "#60a5fa", note: "Collected delivery fees"        },
          { label: "Total Platform Rev",  val: formatTZS(totalRevenue),       color: "#FFBB1C", note: "Commission + delivery"          },
          { label: "Vendor Payouts",      val: `− ${formatTZS(totalPayout)}`, color: "#ef4444", note: "Net disbursed to vendors"       },
        ].map((row, i) => (
          <div key={row.label} style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            gap: "14px", padding: "16px 0",
            borderBottom: i < 4 ? "1px solid #1A1A1A" : "none",
          }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#F0F0F0", marginBottom: "3px" }}>{row.label}</p>
              <p style={{ fontSize: "12px", color: "#B0B0B0" }}>{row.note}</p>
            </div>
            <p style={{ ...num, fontWeight: 900, fontSize: "17px", color: row.color, textAlign: "right" }}>{row.val}</p>
          </div>
        ))}
      </motion.div>

      {/* Quick stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(148px, 1fr))", gap: "14px", marginBottom: "20px" }}>
        {[
          { val: String(ORDERS.length),        label: "Orders",       color: "#60a5fa" },
          { val: String(VENDORS.length),       label: "Vendors",      color: "#a78bfa" },
          { val: formatTZS(totalCommission),   label: "Commission",   color: "#22c55e" },
          { val: formatTZS(totalDelivery),     label: "Delivery Rev", color: "#FFBB1C" },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
            style={{ ...card, padding: "20px 18px" }}>
            {/* Colour rule replaces the emoji that used to head each tile */}
            <div aria-hidden style={{ width: "26px", height: "3px", borderRadius: "2px", background: k.color, marginBottom: "14px" }} />
            <p style={{ ...num, fontWeight: 900, fontSize: k.val.startsWith("TZS") ? "18px" : "32px", color: k.color, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "8px" }}>{k.val}</p>
            <p style={{ ...microLabel, letterSpacing: "0.12em" }}>{k.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Vendor revenue contribution */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ ...card, padding: "24px 20px", marginBottom: "20px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#FFBB1C", marginBottom: "22px" }}>Vendor Revenue Contribution</p>
        {VENDORS.map((v, i) => {
          const share = Math.round((v.total_sales / totalVendorSales) * 100);
          const comm  = Math.round(v.total_sales * v.commission_rate);
          return (
            <motion.div key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 + i * 0.08 }}
              style={{ marginBottom: i < VENDORS.length - 1 ? "24px" : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "12px", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                  <VendorMark name={v.name} size={36} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 800, fontSize: "15px", marginBottom: "4px" }}>{v.name}</p>
                    <p style={{ ...num, fontSize: "13px", color: "#B0B0B0" }}>
                      {formatTZS(v.total_sales)} sales · <span style={{ color: "#22c55e" }}>{formatTZS(comm)}</span> commission
                    </p>
                  </div>
                </div>
                <p style={{ ...num, fontWeight: 900, fontSize: "22px", color: "#FFBB1C", letterSpacing: "-0.02em", flexShrink: 0 }}>{share}%</p>
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
        style={{ ...card, padding: "24px 20px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#FFBB1C", marginBottom: "20px" }}>Order Revenue Ledger</p>
        {ORDERS.map((o, i) => (
          <div key={o.id} style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            gap: "14px", padding: "18px 0",
            borderBottom: i < ORDERS.length - 1 ? "1px solid #1A1A1A" : "none",
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontWeight: 800, fontSize: "16px", color: "#FFBB1C", marginBottom: "5px" }}>{o.id}</p>
              <p style={{ fontSize: "13px", color: "#B0B0B0" }}>{o.customer_name}</p>
              <p style={{ fontSize: "12px", color: "#B0B0B0", marginTop: "3px" }}>{o.items.length} item{o.items.length !== 1 ? "s" : ""} · {o.delivery_address}</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ ...num, fontSize: "15px", fontWeight: 900, color: "#22c55e", marginBottom: "5px" }}>+{formatTZS(o.commission)}</p>
              <p style={{ ...num, fontSize: "13px", color: "#60a5fa", fontWeight: 700, marginBottom: "4px" }}>+{formatTZS(o.delivery_fee)} delivery</p>
              <p style={{ ...num, fontSize: "12px", color: "#ef4444", fontWeight: 600 }}>−{formatTZS(o.vendor_payout)} vendor</p>
            </div>
          </div>
        ))}

        {/* Totals footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "14px", paddingTop: "20px", borderTop: "1px solid #242424", marginTop: "4px" }}>
          <p style={{ fontWeight: 800, fontSize: "14px", color: "#F0F0F0" }}>Total Platform Revenue</p>
          <p style={{ ...num, fontWeight: 900, fontSize: "19px", color: "#22c55e", textAlign: "right" }}>{formatTZS(totalRevenue)}</p>
        </div>
      </motion.div>
    </div>
  );
}
