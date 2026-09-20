"use client";
import { ORDERS } from "@/lib/mockData";
import { formatTZS } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  CheckIcon,
  TruckIcon,
  ClipboardCheckIcon,
  ClockIcon,
  MapPinIcon,
} from "@/app/_components/icons/StatusIcons";

/**
 * Status mapping per design-system/MASTER.md → "Status glyphs".
 * Colour is never the only signal: the word sits next to the glyph in every case.
 *
 * Deviation from MASTER.md, deliberate: the table maps Pending to --color-muted
 * (#6B6B6B), but the same document's checklist forbids #6B6B6B for text because it
 * is 3.5:1 on #0C0C0C. The pill word is 10px, so the checklist wins — Pending
 * renders in --color-text-dim (#B0B0B0, 9.0:1) over a muted-tinted background,
 * which keeps it visually the quietest state without failing contrast.
 */
const STATUS_CONFIG = {
  pending:    { label: "Pending",    color: "#B0B0B0", bg: "rgba(107,107,107,0.16)", Icon: ClockIcon },
  confirmed:  { label: "Confirmed",  color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  Icon: ClipboardCheckIcon },
  dispatched: { label: "On the way", color: "#FFBB1C", bg: "rgba(255,187,28,0.12)",  Icon: TruckIcon },
  delivered:  { label: "Delivered",  color: "#22c55e", bg: "rgba(34,197,94,0.12)",   Icon: CheckIcon },
};

export default function OrdersPage() {
  return (
    <div style={{ background: "#0C0C0C", minHeight: "100vh", padding: "24px 16px 32px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <div style={{ width: "3px", height: "22px", background: "#FFBB1C", borderRadius: "2px", flexShrink: 0 }} />
        <h1 style={{ fontWeight: 900, fontSize: "22px", letterSpacing: "-0.02em" }}>My Orders</h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {ORDERS.map((order, i) => {
          const st = STATUS_CONFIG[order.status];
          const StatusIcon = st.Icon;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{
                background: "#161616",
                border: "1px solid #272727",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              {/* Status accent line */}
              <div style={{ height: "2.5px", background: st.color, opacity: 0.55 }} />

              {/* Header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: "12px",
                padding: "18px 20px 16px",
                borderBottom: "1px solid #1E1E1E",
              }}>
                <div>
                  <p style={{ fontWeight: 800, fontSize: "15px", color: "#FFBB1C", marginBottom: "5px" }}>{order.id}</p>
                  <p style={{ fontSize: "12px", color: "#B0B0B0", fontWeight: 500 }}>
                    {new Date(order.created_at).toLocaleDateString("en-TZ", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>

                {/* Status pill — .badge-construction base, colour overridden per state */}
                <span
                  className="badge-construction"
                  style={{
                    background: st.bg,
                    color: st.color,
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    flexShrink: 0,
                  }}
                >
                  <StatusIcon size={24} />
                  {st.label}
                </span>
              </div>

              {/* Items */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #1A1A1A" }}>
                {order.items.map((item) => (
                  <div key={item.product_id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    gap: "12px",
                    paddingBottom: "10px",
                  }}>
                    <p style={{ fontSize: "14px", color: "#F0F0F0", fontWeight: 500 }}>
                      {item.product_name}{" "}
                      <span style={{ color: "#B0B0B0" }}>× {item.qty} {item.unit}</span>
                    </p>
                    <p style={{ fontSize: "14px", fontWeight: 700, flexShrink: 0 }}>{formatTZS(item.subtotal)}</p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: "16px",
                padding: "16px 20px 18px",
              }}>
                <p style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  fontSize: "12px", color: "#B0B0B0", fontWeight: 500,
                }}>
                  <MapPinIcon size={24} style={{ flexShrink: 0 }} />
                  <span>
                    <span className="sr-only">Deliver to: </span>
                    {order.delivery_address}
                  </span>
                </p>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: "10px", color: "#B0B0B0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Total</p>
                  <p style={{ fontWeight: 900, fontSize: "20px", color: "#FFBB1C" }}>{formatTZS(order.total)}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
