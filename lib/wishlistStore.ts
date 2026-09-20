"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  product_id: string;
  name: string;
  price: number;
  unit: string;
  vendor_name: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (product_id: string) => void;
  hasItem: (product_id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          if (state.items.find((i) => i.product_id === item.product_id)) return state;
          return { items: [...state.items, item] };
        }),
      removeItem: (product_id) =>
        set((state) => ({ items: state.items.filter((i) => i.product_id !== product_id) })),
      hasItem: (product_id) => get().items.some((i) => i.product_id === product_id),
    }),
    { name: "freedom-select-wishlist" }
  )
);
