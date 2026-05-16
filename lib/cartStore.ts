"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./types";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string) => void;
  updateQty: (product_id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.product_id === item.product_id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === item.product_id ? { ...i, qty: i.qty + item.qty } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (product_id) =>
        set((state) => ({ items: state.items.filter((i) => i.product_id !== product_id) })),

      updateQty: (product_id, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.product_id !== product_id)
              : state.items.map((i) => (i.product_id === product_id ? { ...i, qty } : i)),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((s, i) => s + i.qty, 0),

      totalPrice: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
    }),
    { name: "freedom-select-cart" }
  )
);
