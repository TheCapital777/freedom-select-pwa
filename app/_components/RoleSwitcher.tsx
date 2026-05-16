"use client";
import { useRoleStore } from "@/lib/roleStore";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/types";

const ROLE_ROUTES: Record<Role, string> = {
  guest: "/",
  customer: "/products",
  vendor: "/dashboard/vendor",
  transport: "/dashboard/transport",
  admin: "/dashboard/admin",
};

const ROLE_LABELS: Record<Role, string> = {
  guest: "👤 Guest",
  customer: "🛒 Customer",
  vendor: "🏪 Vendor",
  transport: "🚚 Transport",
  admin: "👑 Admin",
};

export default function RoleSwitcher() {
  const { role, setRole } = useRoleStore();
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const r = e.target.value as Role;
    setRole(r);
    router.push(ROLE_ROUTES[r]);
  }

  return (
    <select
      value={role}
      onChange={handleChange}
      className="text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer outline-none appearance-none"
      style={{
        background: "rgba(255,187,28,0.1)",
        borderColor: "rgba(255,187,28,0.3)",
        color: "#FFBB1C",
      }}
    >
      {(Object.entries(ROLE_LABELS) as [Role, string][]).map(([r, label]) => (
        <option key={r} value={r} style={{ background: "#161616", color: "#fff" }}>
          {label}
        </option>
      ))}
    </select>
  );
}
