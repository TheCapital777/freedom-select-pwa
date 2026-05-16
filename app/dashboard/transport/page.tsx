"use client";
import { useState } from "react";
import { DELIVERY_TASKS } from "@/lib/mockData";
import type { DeliveryTask } from "@/lib/types";
import { motion } from "framer-motion";

const STATUS_CONFIG: Record<DeliveryTask["status"], { label: string; color: string; bg: string; icon: string }> = {
  pending:          { label: "Pending",          color: "#888",    bg: "rgba(136,136,136,0.1)",  icon: "🕐" },
  ready_for_pickup: { label: "Ready for Pickup", color: "#FFBB1C", bg: "rgba(255,187,28,0.12)",  icon: "📦" },
  picked_up:        { label: "Picked Up",        color: "#60a5fa", bg: "rgba(96,165,250,0.1)",   icon: "🚗" },
  in_transit:       { label: "In Transit",       color: "#a78bfa", bg: "rgba(167,139,250,0.1)",  icon: "🚚" },
  delivered:        { label: "Delivered",        color: "#22c55e", bg: "rgba(34,197,94,0.1)",    icon: "✅" },
};

const card: React.CSSProperties = { background: "#161616", border: "1px solid #242424", borderRadius: "12px" };

export default function TransportHome() {
  const [tasks, setTasks] = useState(DELIVERY_TASKS);

  const active    = tasks.filter((t) => t.status !== "delivered");
  const inTransit = tasks.filter((t) => t.status === "in_transit");
  const completed = tasks.filter((t) => t.status === "delivered");

  function advance(id: string) {
    const order: DeliveryTask["status"][] = ["pending", "ready_for_pickup", "picked_up", "in_transit", "delivered"];
    setTasks((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      const idx = order.indexOf(t.status);
      return { ...t, status: order[Math.min(idx + 1, order.length - 1)] };
    }));
  }

  return (
    <div style={{ background: "#0C0C0C", minHeight: "100vh", padding: "24px 16px 32px" }}>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <div style={{ width: "3px", height: "22px", background: "#FFBB1C", borderRadius: "2px", flexShrink: 0 }} />
        <h1 style={{ fontWeight: 900, fontSize: "22px", letterSpacing: "-0.02em" }}>Transport</h1>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "28px" }}>
        {[
          { label: "Active",      val: active.length,    color: "#FFBB1C" },
          { label: "In Transit",  val: inTransit.length, color: "#a78bfa" },
          { label: "Done Today",  val: completed.length, color: "#22c55e" },
        ].map((k) => (
          <div key={k.label} style={{ ...card, padding: "18px 12px", textAlign: "center" }}>
            <p style={{ fontWeight: 900, fontSize: "28px", color: k.color, letterSpacing: "-0.03em", marginBottom: "8px" }}>{k.val}</p>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#444" }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Active Deliveries */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div style={{ width: "3px", height: "20px", background: "#FFBB1C", borderRadius: "2px", flexShrink: 0 }} />
        <h2 style={{ fontWeight: 900, fontSize: "17px", letterSpacing: "-0.01em" }}>Active Deliveries</h2>
        <span style={{ padding: "3px 10px", background: "#FFBB1C", color: "#0C0C0C", borderRadius: "4px", fontSize: "11px", fontWeight: 800 }}>
          {active.length}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "32px" }}>
        {active.map((task, i) => {
          const st = STATUS_CONFIG[task.status];
          return (
            <motion.div key={task.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ ...card, overflow: "hidden" }}>
              <div style={{ height: "2.5px", background: st.color, opacity: 0.6 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", borderBottom: "1px solid #1E1E1E" }}>
                <p style={{ fontWeight: 800, fontSize: "15px", color: "#FFBB1C" }}>Order {task.order_id}</p>
                <span style={{ padding: "6px 12px", display: "flex", alignItems: "center", gap: "6px", background: st.bg, color: st.color, borderRadius: "6px", fontSize: "12px", fontWeight: 700 }}>
                  {st.icon} {st.label}
                </span>
              </div>
              <div style={{ padding: "18px 18px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
                  <span style={{ fontSize: "18px", marginTop: "1px", flexShrink: 0 }}>📦</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>Pickup: {task.vendor_name}</p>
                    <p style={{ fontSize: "13px", color: "#555" }}>{task.pickup_location}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px" }}>
                  <span style={{ fontSize: "18px", marginTop: "1px", flexShrink: 0 }}>📍</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>Deliver to: {task.customer_name}</p>
                    <p style={{ fontSize: "13px", color: "#555" }}>{task.delivery_location}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: "13px", color: "#444" }}>⏱ {task.estimated_time} · {task.items_count} items</p>
                  {task.status !== "delivered" && (
                    <button
                      onClick={() => advance(task.id)}
                      style={{ padding: "11px 18px", background: "rgba(255,187,28,0.1)", border: "1px solid rgba(255,187,28,0.25)", borderRadius: "8px", color: "#FFBB1C", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
                    >
                      {task.status === "ready_for_pickup" ? "Mark Picked Up" :
                       task.status === "picked_up" ? "Mark In Transit" : "Mark Delivered"} →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {active.length === 0 && (
          <div style={{ ...card, padding: "40px 24px", textAlign: "center" }}>
            <p style={{ fontSize: "36px", marginBottom: "12px" }}>✅</p>
            <p style={{ fontWeight: 700, fontSize: "16px", marginBottom: "6px" }}>All clear</p>
            <p style={{ fontSize: "13px", color: "#555" }}>No active deliveries right now</p>
          </div>
        )}
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ width: "3px", height: "20px", background: "#22c55e", borderRadius: "2px", flexShrink: 0 }} />
            <h2 style={{ fontWeight: 900, fontSize: "17px", letterSpacing: "-0.01em" }}>Completed Today</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {completed.map((task) => (
              <div key={task.id} style={{ ...card, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 18px" }}>
                <div>
                  <p style={{ fontWeight: 800, fontSize: "15px", color: "#FFBB1C", marginBottom: "5px" }}>{task.order_id}</p>
                  <p style={{ fontSize: "13px", color: "#555" }}>{task.delivery_location}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "#22c55e", marginBottom: "4px" }}>✅ Delivered</p>
                  <p style={{ fontSize: "13px", fontWeight: 800, color: "#FFBB1C" }}>TZS 8,000</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
