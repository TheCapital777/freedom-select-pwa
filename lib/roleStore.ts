"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "./types";

interface RoleStore {
  role: Role;
  setRole: (role: Role) => void;
}

export const useRoleStore = create<RoleStore>()(
  persist(
    (set) => ({
      role: "guest",
      setRole: (role) => set({ role }),
    }),
    { name: "freedom-select-role" }
  )
);
