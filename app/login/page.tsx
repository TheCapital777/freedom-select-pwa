"use client";
import { useRoleStore } from "@/lib/roleStore";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/types";
import { motion } from "framer-motion";
import { CartIcon, StoreIcon, TruckIcon, ShieldIcon, type IconProps } from "@/app/_components/icons/StatusIcons";

const ROLES: { id: Role; Icon: (p: IconProps) => React.ReactElement; title: string; desc: string; color: string }[] = [
  { id: "customer",  Icon: CartIcon  , title: "Customer",   desc: "Browse and order products",              color: "#FFBB1C" },
  { id: "vendor",    Icon: StoreIcon , title: "Vendor",     desc: "Manage your catalog and fulfill orders", color: "#FF6B00" },
  { id: "transport", Icon: TruckIcon , title: "Transport",  desc: "Manage pickups and deliveries",           color: "#a78bfa" },
  { id: "admin",     Icon: ShieldIcon, title: "Admin",      desc: "Platform oversight and financials",       color: "#22c55e" },
];

const ROUTES: Record<Role, string> = {
  guest: "/",
  customer: "/products",
  vendor: "/dashboard/vendor",
  transport: "/dashboard/transport",
  admin: "/dashboard/admin",
};

export default function LoginPage() {
  const { setRole } = useRoleStore();
  const router = useRouter();

  function enter(role: Role) {
    setRole(role);
    router.push(ROUTES[role]);
  }

  return (
    <div style={{
      background: "#0C0C0C", minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center",
      padding: "48px 24px 48px",
    }}>

      {/* Logo — same crop technique as navbar, but taller */}
      <div style={{ overflow: "hidden", height: "120px", marginBottom: "40px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Freedom Select"
          style={{
            height: "390px",
            width: "auto",
            marginTop: "-126px",
            display: "block",
            filter: "drop-shadow(0 4px 24px rgba(255,187,28,0.2))",
          }}
        />
      </div>

      <p style={{
        fontSize: "12px", fontWeight: 600,
        letterSpacing: "0.22em", textTransform: "uppercase",
        color: "#3A3A3A", marginBottom: "40px",
      }}>
        Select your role to continue
      </p>

      {/* Role cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", maxWidth: "440px" }}>
        {ROLES.map((r, i) => (
          <motion.button
            key={r.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, ease: [0, 0, 0.2, 1] }}
            onClick={() => enter(r.id)}
            style={{
              display: "flex", alignItems: "center", gap: "18px",
              padding: "22px 20px",
              background: "#161616",
              border: "1px solid #242424",
              borderRadius: "var(--radius-card)",
              cursor: "pointer", textAlign: "left",
            }}
          >
            <div style={{
              width: "56px", height: "56px", borderRadius: "var(--radius-card)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "30px", flexShrink: 0,
              background: `${r.color}15`, border: `1px solid ${r.color}28`,
            }}>
              <r.Icon size={26} />
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <p style={{ fontWeight: 800, fontSize: "17px", color: "#F0F0F0", marginBottom: "6px" }}>{r.title}</p>
              <p style={{ fontSize: "13px", color: "#B0B0B0", fontWeight: 400, lineHeight: 1.4 }}>{r.desc}</p>
            </div>
            <span style={{ color: r.color, fontWeight: 900, fontSize: "24px", flexShrink: 0, lineHeight: 1 }}>›</span>
          </motion.button>
        ))}
      </div>

      <p style={{
        fontSize: "12px", fontWeight: 500,
        letterSpacing: "0.18em", textTransform: "uppercase",
        color: "#2A2A2A", marginTop: "48px",
      }}>
        Freedom Select · Arusha, Tanzania
      </p>
    </div>
  );
}
