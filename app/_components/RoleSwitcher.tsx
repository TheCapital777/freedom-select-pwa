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

/**
 * The header role switcher.
 *
 * Previously this was a native <select> with the glyph and the chevron
 * absolutely positioned on top of it and pl-9/pr-7 padding reserving their
 * space. That arrangement is only correct while the label fits the padding it
 * was given, and on a 375px screen it did not: the brand lockup laid out 197px
 * wide, the cart button took 44px, and the select was left roughly 70px to
 * render about 116px of padded text. A <select> has no intrinsic minimum width,
 * so instead of forcing the row to overflow it simply compressed, and the word
 * "Customer" spilled out of its own padding box and printed across the cart
 * glyph. That is the collision in the screenshot.
 *
 * Now the pill is a flex row — glyph, label, chevron — and the <select> is a
 * transparent layer over the whole thing. Flex children cannot overlap, so the
 * failure mode is gone by construction rather than by having picked better
 * padding. The label is fixed-width and truncates, so the pill is also the same
 * size for every role: a control that resizes under your finger as you use it
 * was the other half of the problem. Styles live in globals.css under
 * "Role pill".
 */
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
    <div className="role-pill">
      {/* Decorative: the word beside it carries the meaning. Drawn on a 24px
          artboard, rendered at 18 so it sits optically with 11px text. */}
      <RoleIcon size={18} aria-hidden="true" />
      <span className="role-pill-label" aria-hidden="true">
        {ROLE_LABELS[role]}
      </span>
      <ChevronDownIcon size={14} aria-hidden="true" />
      <select
        value={role}
        onChange={handleChange}
        aria-label={"Switch role, currently " + ROLE_LABELS[role]}
      >
        {(Object.entries(ROLE_LABELS) as [Role, string][]).map(([r, label]) => (
          <option key={r} value={r} style={{ background: "#161616", color: "#F0F0F0" }}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
