"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VENDORS, TRANSPORTERS, PRODUCTS } from "./mockData";
import type { Vendor, Transporter, Product } from "./types";

/**
 * The admin's directory of vendors and transporters.
 *
 * WHAT THIS IS, PLAINLY: browser state. The store persists to localStorage, the
 * same way the cart and the role switcher already do. So an admin's changes are
 * real on that device and invisible everywhere else — there is no server in this
 * app to share them with, and the "admin" role is itself a localStorage string
 * anyone can set.
 *
 * That is honest for a prototype and wrong for a business. Making it real means a
 * database with row-level rules and authenticated roles, at which point this file
 * becomes a thin client over it and the shape below barely changes. It is written
 * so that swap is a small job rather than a rewrite.
 *
 * Seeded from mockData on first run; after that the persisted copy wins, so a
 * removed vendor stays removed across reloads.
 */

export interface DirectoryStore {
  vendors: Vendor[];
  transporters: Transporter[];
  products: Product[];

  addVendor: (v: Omit<Vendor, "id">) => void;
  addTransporter: (t: Omit<Transporter, "id">) => void;
  addProduct: (p: Omit<Product, "id">) => void;

  /** Hard delete. Refused for a vendor that still has products — see canRemoveVendor. */
  removeVendor: (id: string) => void;
  removeTransporter: (id: string) => void;
  removeProduct: (id: string) => void;

  setVendorStatus: (id: string, status: Vendor["status"]) => void;
  setTransporterStatus: (id: string, status: Transporter["status"]) => void;
  /** Listings go out of stock rather than being deleted when an order references them. */
  setProductStock: (id: string, in_stock: boolean) => void;

  /** Put the seed data back, for when a demo has been poked out of shape. */
  resetDirectory: () => void;
}

/**
 * Whether a vendor can be deleted outright.
 *
 * Products carry a vendor_id and orders carry vendor payouts, so deleting a
 * vendor who has either would leave listings pointing at nobody. Suspending is
 * the right move there — the same reasoning as parking a product rather than
 * deleting it. Returns the reason so the UI can say it out loud.
 */
export function canRemoveVendor(id: string): { ok: boolean; reason?: string; products: number } {
  const products = PRODUCTS.filter((p) => p.vendor_id === id).length;
  if (products > 0) {
    return {
      ok: false,
      products,
      reason: `${products} listing${products === 1 ? "" : "s"} belong to this vendor. Suspend them instead — deleting would leave those products pointing at nobody.`,
    };
  }
  return { ok: true, products: 0 };
}

const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const useDirectoryStore = create<DirectoryStore>()(
  persist(
    (set) => ({
      vendors: VENDORS,
      transporters: TRANSPORTERS,
      products: PRODUCTS,

      addVendor: (v) =>
        set((s) => ({ vendors: [...s.vendors, { ...v, id: newId("vendor") }] })),

      addTransporter: (t) =>
        set((s) => ({ transporters: [...s.transporters, { ...t, id: newId("trans") }] })),

      addProduct: (p) =>
        set((s) => ({ products: [...s.products, { ...p, id: newId("prod") }] })),

      removeVendor: (id) =>
        set((s) => ({ vendors: s.vendors.filter((v) => v.id !== id) })),

      removeTransporter: (id) =>
        set((s) => ({ transporters: s.transporters.filter((t) => t.id !== id) })),

      removeProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      setVendorStatus: (id, status) =>
        set((s) => ({
          vendors: s.vendors.map((v) => (v.id === id ? { ...v, status } : v)),
        })),

      setTransporterStatus: (id, status) =>
        set((s) => ({
          transporters: s.transporters.map((t) => (t.id === id ? { ...t, status } : t)),
        })),

      setProductStock: (id, in_stock) =>
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, in_stock } : p)),
        })),

      resetDirectory: () =>
        set({ vendors: VENDORS, transporters: TRANSPORTERS, products: PRODUCTS }),
    }),
    {
      name: "freedom-select-directory",
      // Bump this when the seed shape changes, or a returning browser will keep
      // rehydrating the old one. Same trap as the service-worker cache name.
      version: 2,
    },
  ),
);
