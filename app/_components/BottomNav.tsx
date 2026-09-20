"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useRoleStore } from "@/lib/roleStore";

/* Visible focus ring on every interactive element (MASTER.md checklist).
   #FFBB1C is the existing --color-accent — no new colours introduced.
   -4px offset keeps the ring inside the 66px bar instead of off-screen. */
const FOCUS_RING = "focus-visible:[outline:2px_solid_#FFBB1C] focus-visible:[outline-offset:-4px]";

/* ── Icons ─────────────────────────────────────────── */
const I = {
  home:      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
  shop:      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  cart:      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  orders:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>,
  wishlist:  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  logout:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  revenue:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  followups: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
};

type NavTab =
  | { href: string; icon: React.ReactNode; label: string; badge?: number }
  | { action: "logout"; icon: React.ReactNode; label: string };

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole } = useRoleStore();
  const cartCount = useCartStore((s) => s.totalItems)();
  const wishlistCount = useWishlistStore((s) => s.items.length);

  if (role === "guest") return null;

  function logout() {
    setRole("guest");
    router.push("/");
  }

  const TABS: Record<string, NavTab[]> = {
    customer: [
      { href: "/products",  icon: I.shop,     label: "Shop"     },
      { href: "/cart",      icon: I.cart,     label: "Cart",    badge: cartCount    },
      { href: "/orders",    icon: I.orders,   label: "Orders"   },
      { href: "/wishlist",  icon: I.wishlist, label: "Wishlist", badge: wishlistCount },
      { action: "logout",   icon: I.logout,   label: "Logout"   },
    ],
    vendor: [
      { href: "/dashboard/vendor",         icon: I.home,   label: "Home"   },
      { href: "/dashboard/vendor/orders",  icon: I.orders, label: "Orders" },
      { action: "logout",                  icon: I.logout, label: "Logout" },
    ],
    transport: [
      { href: "/dashboard/transport",         icon: I.home,   label: "Home"   },
      { href: "/dashboard/transport/orders",  icon: I.orders, label: "Orders" },
      { action: "logout",                     icon: I.logout, label: "Logout" },
    ],
    admin: [
      { href: "/dashboard/admin",            icon: I.home,      label: "Dash"      },
      { href: "/dashboard/admin/revenue",    icon: I.revenue,   label: "Revenue"   },
      { href: "/dashboard/admin/followups",  icon: I.followups, label: "Follow Ups" },
      { action: "logout",                    icon: I.logout,    label: "Logout"    },
    ],
  };

  const tabs = TABS[role] ?? TABS.customer;

  function isActive(tab: NavTab): boolean {
    if ("action" in tab) return false;
    if (tab.href === "/products") return pathname === "/products" || pathname.startsWith("/products/");
    if (tab.href === "/dashboard/vendor") return pathname === "/dashboard/vendor";
    if (tab.href === "/dashboard/transport") return pathname === "/dashboard/transport";
    if (tab.href === "/dashboard/admin") return pathname === "/dashboard/admin";
    return pathname === tab.href || pathname.startsWith(tab.href + "/");
  }

  return (
    <nav
      aria-label="Primary"
      style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "stretch",
        height: "72px",
        background: "rgba(8,8,8,0.98)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {tabs.map((tab, idx) => {
        const active = isActive(tab);
        const badge = "badge" in tab && tab.badge != null && tab.badge > 0 ? tab.badge : 0;

        /* Accessible name folds the count in, so the badge itself is decorative.
           Without this a screen reader reads "3 Cart" with no unit. */
        const accessibleName = badge > 0
          ? `${tab.label}, ${badge} item${badge === 1 ? "" : "s"}`
          : tab.label;

        const content = (
          <>
            {/* Active top pill */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute", top: 0, left: "50%",
                transform: "translateX(-50%)",
                width: active ? "26px" : "0px", height: "2.5px",
                background: "#FFBB1C",
                borderRadius: "0 0 4px 4px",
                transition: "width 0.28s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            />

            {/* Icon + badge */}
            <span style={{ position: "relative", display: "flex", lineHeight: 0 }}>
              {badge > 0 && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute", top: "-6px", right: "-9px",
                    minWidth: "19px", height: "19px",
                    background: "#FFBB1C", color: "#0A0A0A",
                    borderRadius: "var(--radius-pill)", fontSize: "12px", fontWeight: 800, lineHeight: 1,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "0 3px",
                  }}
                >
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
              {tab.icon}
            </span>

            {/* Label */}
            <span
              aria-hidden="true"
              style={{
                fontSize: "12px", fontWeight: 600,
                letterSpacing: "0.01em", lineHeight: 1,
                maxWidth: "100%", overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </span>
          </>
        );

        const sharedStyle: React.CSSProperties = {
          flex: 1,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: "5px", position: "relative",
          /* Inactive tabs were #555 — 2.6:1 on #0C0C0C. --color-text-dim is 9.0:1. */
          color: active ? "#FFBB1C" : "#B0B0B0",
          transition: "color 180ms cubic-bezier(0.4,0,0.2,1)",
          paddingBottom: "2px",
          minWidth: "44px", minHeight: "44px",
          textDecoration: "none",
          background: "none", border: "none", cursor: "pointer",
        };

        if ("action" in tab) {
          return (
            <button
              key={idx}
              type="button"
              onClick={logout}
              aria-label={accessibleName}
              className={"cursor-pointer " + FOCUS_RING}
              style={sharedStyle}
            >
              {content}
            </button>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-label={accessibleName}
            aria-current={active ? "page" : undefined}
            className={"cursor-pointer " + FOCUS_RING}
            style={sharedStyle}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
