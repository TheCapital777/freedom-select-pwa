"use client";
import { useRoleStore } from "@/lib/roleStore";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/types";
import {
  UserIcon,
  CartIcon,
  StoreIcon,
  TruckIcon,
  ShieldIcon,
  ChevronDownIcon,
  type IconProps,
} from "@/app/_components/icons/StatusIcons";

/* Visible focus ring on every interactive element (MASTER.md checklist).
   #FFBB1C is the existing --color-accent — no new colours introduced. */
const FOCUS_RING = "focus-visible:[outline:2px_solid_#FFBB1C] focus-visible:[outline-offset:2px]";

const ROLE_ROUTES: Record<Role, string> = {
  guest: "/",
  customer: "/products",
  vendor: "/dashboard/vendor",
  transport: "/dashboard/transport",
  admin: "/dashboard/admin",
};

/* Plain words only. An <option> cannot contain an SVG, so the glyph for the
   currently selected role is rendered beside the control instead of inside it —
   the word and the glyph still read together, and the native select is kept
   because it is the accessible, keyboard- and Android-friendly control. */
const ROLE_LABELS: Record<Role, string> = {
  guest: "Guest",
  customer: "Customer",
  vendor: "Vendor",
  transport: "Transport",
  admin: "Admin",
};

const ROLE_ICONS: Record<Role, (p: IconProps) => React.ReactElement> = {
  guest: UserIcon,
  customer: CartIcon,
  vendor: StoreIcon,
  transport: TruckIcon,
  admin: ShieldIcon,
};

export default function RoleSwitcher() {
  const { role, setRole } = useRoleStore();
  const router = useRouter();
  const RoleIcon = ROLE_ICONS[role] ?? UserIcon;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const r = e.target.value as Role;
    setRole(r);
    router.push(ROLE_ROUTES[r]);
  }

  return (
    <div className="relative flex items-center flex-shrink-0">
      {/* Current-role glyph — decorative, the selected word carries the meaning.
          Drawn on a 24px artboard but rendered at 20 so it sits optically with
          11px text and the whole pill still fits beside the logo at 375px. */}
      <RoleIcon
        size={20}
        className="absolute left-2.5 pointer-events-none"
        style={{ color: "#FFBB1C" }}
      />
      <select
        value={role}
        onChange={handleChange}
        aria-label={"Switch role, currently " + ROLE_LABELS[role]}
        /* Was px-3 py-1.5 text-xs — a 32px tall target. Now 44px. */
        className={"text-[11px] font-semibold pl-9 pr-7 rounded-full border cursor-pointer appearance-none min-h-11 " + FOCUS_RING}
        style={{
          background: "rgba(255,187,28,0.1)",
          borderColor: "rgba(255,187,28,0.3)",
          color: "#FFBB1C",
          height: "44px",
          transition: "background 200ms cubic-bezier(0.4,0,0.2,1), border-color 200ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {(Object.entries(ROLE_LABELS) as [Role, string][]).map(([r, label]) => (
          <option key={r} value={r} style={{ background: "#161616", color: "#F0F0F0" }}>
            {label}
          </option>
        ))}
      </select>
      {/* appearance-none removed the native affordance; put one back. */}
      <ChevronDownIcon
        size={16}
        className="absolute right-2.5 pointer-events-none"
        style={{ color: "#FFBB1C" }}
      />
    </div>
  );
}
