"use client";
import Link from "next/link";
import { useCartStore } from "@/lib/cartStore";
import RoleSwitcher from "./RoleSwitcher";
import { useRoleStore } from "@/lib/roleStore";

const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

export default function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems)();
  const role = useRoleStore((s) => s.role);

  // Vendor and transport have their own identity headers; admin has its own
  if (role === "guest" || role === "vendor" || role === "transport" || role === "admin") return null;

  return (
    <nav
      style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px",
        background: "rgba(10,10,10,0.97)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        height: "88px",
      }}
    >
      {/* Logo — crop into the visible content using overflow:hidden */}
      <Link href="/" style={{ display: "block", overflow: "hidden", height: "88px", flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Freedom Select"
          style={{
            height: "280px",
            width: "auto",
            marginTop: "-92px",
            display: "block",
            filter: "drop-shadow(0 2px 12px rgba(255,187,28,0.15))",
          }}
        />
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <RoleSwitcher />
        <Link
          href="/cart"
          style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}
        >
          <CartIcon />
          {totalItems > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-5px", right: "-7px",
                width: "17px", height: "17px",
                background: "#FFBB1C", color: "#0A0A0A",
                borderRadius: "50%",
                fontSize: "9px", fontWeight: 900,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
