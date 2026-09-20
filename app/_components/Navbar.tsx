"use client";
import Link from "next/link";
import { useCartStore } from "@/lib/cartStore";
import RoleSwitcher from "./RoleSwitcher";
import { useRoleStore } from "@/lib/roleStore";

/* Visible focus ring on every interactive element (MASTER.md checklist).
   #FFBB1C is the existing --color-accent — no new colours introduced. */
const FOCUS_RING = "focus-visible:[outline:2px_solid_#FFBB1C] focus-visible:[outline-offset:2px]";

const CartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
      aria-label="Site header"
      className="glass"
      style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "12px",
        padding: "0 16px",
        borderRadius: 0,
        borderTop: 0, borderLeft: 0, borderRight: 0,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "none",
      }}
    >
      {/* Logo — portrait art cropped to a letterbox. Sizing lives in
          globals.css so the width shrinks with the viewport; hard-coding it
          here at 197px is what squeezed the role pill off the row. */}
      <Link
        href="/"
        aria-label="Freedom Select — home"
        className={"brand-lockup cursor-pointer " + FOCUS_RING}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Freedom Select" />
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <RoleSwitcher />
        <Link
          href="/cart"
          /* Icon-only control: was a bare 22px icon, so a 22x22 touch target. */
          aria-label={
            totalItems > 0
              ? `Cart, ${totalItems} item${totalItems === 1 ? "" : "s"}`
              : "Cart, empty"
          }
          className={"cursor-pointer " + FOCUS_RING}
          style={{
            position: "relative",
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "44px", height: "44px", flexShrink: 0,
            borderRadius: "var(--radius-input)",
            color: "#B0B0B0",
            transition: "color 200ms cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <CartIcon />
          {totalItems > 0 && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "2px", right: "2px",
                /* Grown with the type: this held 9px text in a 17px circle.
                   minWidth + padding so "9+" is not clipped the way a fixed
                   square would clip it. */
                minWidth: "20px", height: "20px", padding: "0 4px",
                background: "#FFBB1C", color: "#0A0A0A",
                borderRadius: "var(--radius-pill)",
                fontSize: "12px", fontWeight: 800, lineHeight: 1,
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
