"use client";
import { DELIVERY_TASKS, ORDERS } from "@/lib/mockData";
import { formatTZS } from "@/lib/utils";
import { motion } from "framer-motion";
import { PackageIcon, MapPinIcon } from "@/app/_components/icons/StatusIcons";

const DELIVERY_FEE = 8000;

const STATUS_COLORS: Record<string, string> = {
  pending:          "#888",
  ready_for_pickup: "#FFBB1C",
  picked_up:        "#60a5fa",
  in_transit:       "#a78bfa",
  delivered:        "#22c55e",
};
const STATUS_LABELS: Record<string, string> = {
  pending:          "Pending",
  ready_for_pickup: "Ready",
  picked_up:        "Picked Up",
  in_transit:       "In Transit",
  delivered:        "Delivered",
};

const card: React.CSSProperties = { background: "#161616", border: "1px solid #242424", borderRadius: "12px" };

const completedTasks = DELIVERY_TASKS.filter((t) => t.status === "delivered");
const totalEarned    = completedTasks.length * DELIVERY_FEE;
const weeklyEarned   = totalEarned; // mock — all are "this week"

export default function TransportOrdersPage() {
  return (
    <div style={{ background: "#0C0C0C", minHeight: "100vh", padding: "24px 16px 32px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <div style={{ width: "3px", height: "22px", background: "#FFBB1C", borderRadius: "2px", flexShrink: 0 }} />
        <h1 style={{ fontWeight: 900, fontSize: "22px", letterSpacing: "-0.02em" }}>Transport Orders</h1>
      </div>

      {/* Earnings summary */}
      <div style={{ ...card, padding: "24px 20px", marginBottom: "24px", background: "linear-gradient(135deg, #0F0F18, #0C0C0C)", border: "1px solid rgba(167,139,250,0.2)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "96px", height: "96px", borderRadius: "50%", background: "#a78bfa", opacity: 0.07, filter: "blur(32px)", pointerEvents: "none" }} />
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B0B0B0", marginBottom: "12px" }}>This Week's Earnings</p>
        <p style={{ fontWeight: 900, fontSize: "clamp(2rem,8vw,2.8rem)", color: "#FFBB1C", letterSpacing: "-0.03em", marginBottom: "20px" }}>{formatTZS(weeklyEarned)}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
          {[
            { label: "Total Jobs",   val: DELIVERY_TASKS.length,    color: "#F0F0F0" },
            { label: "Completed",    val: completedTasks.length,    color: "#22c55e" },
            { label: "Per Delivery", val: formatTZS(DELIVERY_FEE), color: "#FFBB1C" },
          ].map((k) => (
            <div key={k.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "12px 10px", textAlign: "center" }}>
              <p style={{ fontWeight: 900, fontSize: "16px", color: k.color, marginBottom: "5px" }}>{k.val}</p>
              <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#444" }}>{k.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Period tabs — mock */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {["Today", "This Week", "This Month"].map((p, i) => (
          <button key={p} style={{
            padding: "10px 18px",
            background: i === 1 ? "#FFBB1C" : "#161616",
            border: `1px solid ${i === 1 ? "#FFBB1C" : "#242424"}`,
            borderRadius: "8px",
            color: i === 1 ? "#0C0C0C" : "#555",
            fontSize: "12px", fontWeight: 700,
            letterSpacing: "0.06em", cursor: "pointer",
          }}>{p}</button>
        ))}
      </div>

      {/* Orders list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {DELIVERY_TASKS.map((task, i) => {
          const color  = STATUS_COLORS[task.status];
          const label  = STATUS_LABELS[task.status];
          const earned = task.status === "delivered" ? DELIVERY_FEE : 0;
          const matchedOrder = ORDERS.find((o) => o.id === task.order_id);

          return (
            <motion.div key={task.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              style={{ ...card, overflow: "hidden" }}>
              <div style={{ height: "2.5px", background: color, opacity: 0.6 }} />

              {/* Header row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", borderBottom: "1px solid #1E1E1E" }}>
                <div>
                  <p style={{ fontWeight: 800, fontSize: "15px", color: "#FFBB1C", marginBottom: "4px" }}>Order {task.order_id}</p>
                  <p style={{ fontSize: "13px", color: "#B0B0B0" }}>{task.customer_name}</p>
                </div>
                <span style={{ padding: "6px 12px", borderRadius: "6px", background: `${color}18`, color, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
              </div>

              {/* Route */}
              <div style={{ padding: "16px 18px", borderBottom: "1px solid #1A1A1A" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
                  <PackageIcon size={14} style={{ marginTop: "2px", flexShrink: 0, color: "#B0B0B0" }} />
                  <div>
                    <p style={{ fontSize: "12px", color: "#B0B0B0", fontWeight: 600, marginBottom: "2px" }}>Pickup from</p>
                    <p style={{ fontSize: "14px", fontWeight: 700 }}>{task.vendor_name} · {task.pickup_location}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <MapPinIcon size={14} style={{ marginTop: "2px", flexShrink: 0, color: "#B0B0B0" }} />
                  <div>
                    <p style={{ fontSize: "12px", color: "#B0B0B0", fontWeight: 600, marginBottom: "2px" }}>Deliver to</p>
                    <p style={{ fontSize: "14px", fontWeight: 700 }}>{task.delivery_location}</p>
                  </div>
                </div>
              </div>

              {/* Earnings row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px" }}>
                <p style={{ fontSize: "13px", color: "#444" }}>⏱ {task.estimated_time} · {task.items_count} items{matchedOrder ? ` · ${formatTZS(matchedOrder.total)} order` : ""}</p>
                <p style={{ fontWeight: 900, fontSize: "16px", color: task.status === "delivered" ? "#22c55e" : "#444" }}>
                  {task.status === "delivered" ? `+${formatTZS(earned)}` : "Pending"}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
