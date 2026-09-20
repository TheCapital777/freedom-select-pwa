"use client";
import { VENDORS, getOrdersByVendor } from "@/lib/mockData";
import { formatTZS } from "@/lib/utils";
import { motion } from "framer-motion";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: "Pending",    color: "#B0B0B0",    bg: "rgba(136,136,136,0.1)" },
  confirmed:  { label: "Confirmed",  color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  dispatched: { label: "Dispatched", color: "#FFBB1C", bg: "rgba(255,187,28,0.12)" },
  delivered:  { label: "Delivered",  color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
};

const card: React.CSSProperties = { background: "#161616", border: "1px solid #242424", borderRadius: "12px" };

export default function VendorOrdersPage() {
  const vendor = VENDORS[0];
  const orders = getOrdersByVendor(vendor.id);

  const totalGross      = orders.reduce((s, o) => s + o.total, 0);
  const totalCommission = orders.reduce((s, o) => s + o.commission, 0);
  const totalNet        = orders.reduce((s, o) => s + o.vendor_payout, 0);
  const delivered       = orders.filter((o) => o.status === "delivered").length;

  return (
    <div style={{ background: "#0C0C0C", minHeight: "100vh", padding: "24px 16px 32px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <div style={{ width: "3px", height: "22px", background: "#FFBB1C", borderRadius: "2px", flexShrink: 0 }} />
        <h1 style={{ fontWeight: 900, fontSize: "22px", letterSpacing: "-0.02em" }}>My Orders</h1>
      </div>

      {/* Earnings summary */}
      <div style={{ ...card, padding: "24px 20px", marginBottom: "24px", background: "linear-gradient(135deg, #181208, #0C0C0C)", border: "1px solid rgba(255,187,28,0.2)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "96px", height: "96px", borderRadius: "50%", background: "#FFBB1C", opacity: 0.08, filter: "blur(32px)", pointerEvents: "none" }} />
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B0B0B0", marginBottom: "12px" }}>Net Earnings (All Time)</p>
        <p style={{ fontWeight: 900, fontSize: "clamp(2rem,8vw,2.8rem)", color: "#FFBB1C", letterSpacing: "-0.03em", marginBottom: "20px" }}>{formatTZS(totalNet)}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px" }}>
          {[
            { label: "Orders",     val: orders.length,           color: "#F0F0F0" },
            { label: "Completed",  val: delivered,               color: "#22c55e" },
            { label: "Gross",      val: formatTZS(totalGross),   color: "#F0F0F0" },
            { label: "Commission", val: formatTZS(totalCommission), color: "#ef4444" },
          ].map((k) => (
            <div key={k.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "12px 8px", textAlign: "center" }}>
              <p style={{ fontWeight: 900, fontSize: "14px", color: k.color, marginBottom: "4px" }}>{k.val}</p>
              <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444" }}>{k.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Orders list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {orders.map((o, i) => {
          const st = STATUS_CONFIG[o.status];
          const myItems = o.items.filter((it) => it.vendor_id === vendor.id);
          return (
            <motion.div key={o.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              style={{ ...card, overflow: "hidden" }}>
              <div style={{ height: "2.5px", background: st.color, opacity: 0.55 }} />

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", borderBottom: "1px solid #1E1E1E" }}>
                <div>
                  <p style={{ fontWeight: 800, fontSize: "15px", color: "#FFBB1C", marginBottom: "4px" }}>{o.id}</p>
                  <p style={{ fontSize: "13px", color: "#B0B0B0" }}>
                    {new Date(o.created_at).toLocaleDateString("en-TZ", { day: "numeric", month: "short", year: "numeric" })} · {o.customer_name}
                  </p>
                </div>
                <span style={{ padding: "6px 12px", borderRadius: "6px", background: st.bg, color: st.color, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{st.label}</span>
              </div>

              {/* Items packed */}
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #1A1A1A" }}>
                {myItems.map((it) => (
                  <p key={it.product_id} style={{ fontSize: "14px", color: "#B0B0B0", marginBottom: "6px" }}>
                    {it.product_name} <span style={{ color: "#4A4A4A" }}>×{it.qty} {it.unit}</span>
                    <span style={{ float: "right", color: "#F0F0F0", fontWeight: 700 }}>{formatTZS(it.subtotal)}</span>
                  </p>
                ))}
              </div>

              {/* Financials */}
              <div style={{ padding: "14px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", color: "#B0B0B0" }}>Gross Sales</span>
                  <span style={{ fontSize: "14px", fontWeight: 700 }}>{formatTZS(o.total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: "13px", color: "#B0B0B0" }}>Commission (8%)</span>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#ef4444" }}>−{formatTZS(o.commission)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #1E1E1E", paddingTop: "12px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>Your Payout</span>
                  <span style={{ fontSize: "18px", fontWeight: 900, color: "#22c55e" }}>{formatTZS(o.vendor_payout)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
