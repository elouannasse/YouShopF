"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types/api.types";

interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  isOpen: boolean;
}

interface CartActions {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  calculateTotals: () => void;
  getTotalItems: () => number;
  getOrderItems: () => { productId: string; quantity: number; price: number }[];
}

type CartStore = CartState & CartActions;

const TAX_RATE = 0.2; // 20% TVA
const SHIPPING_COST = 5.99;
const FREE_SHIPPING_THRESHOLD = 50;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      subtotal: 0,
      tax: 0,
      shippingCost: 0,
      total: 0,
      isOpen: false,

      // Actions
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          (item) =>
            (typeof item.product === "string"
              ? item.product
              : item.product._id) === product._id
        );

        let newItems: CartItem[];

        if (existingItemIndex > -1) {
          // Item already exists, update quantity
          newItems = items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Add new item
          const newItem: CartItem = {
            product: product._id,
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity,
            subtotal: product.price * quantity,
          };
          newItems = [...items, newItem];
        }

        set({ items: newItems });
        get().calculateTotals();
        get().openCart();
      },

      removeItem: (productId) => {
        const items = get().items.filter(
          (item) =>
            (typeof item.product === "string"
              ? item.product
              : item.product._id) !== productId
        );
        set({ items });
        get().calculateTotals();
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const items = get().items.map((item) => {
          const itemProductId =
            typeof item.product === "string" ? item.product : item.product._id;

          if (itemProductId === productId) {
            return {
              ...item,
              quantity,
              subtotal: (item.price || 0) * quantity,
            };
          }
          return item;
        });

        set({ items });
        get().calculateTotals();
      },

      clearCart: () => {
        set({
          items: [],
          subtotal: 0,
          tax: 0,
          shippingCost: 0,
          total: 0,
        });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      calculateTotals: () => {
        const items = get().items;

        // Calculate subtotal
        const subtotal = items.reduce((sum, item) => {
          const price = item.price || 0;
          return sum + price * item.quantity;
        }, 0);

        // Calculate tax
        const tax = subtotal * TAX_RATE;

        // Calculate shipping
        const shippingCost =
          subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

        // Calculate total
        const total = subtotal + tax + shippingCost;

        set({
          subtotal: Number(subtotal.toFixed(2)),
          tax: Number(tax.toFixed(2)),
          shippingCost: Number(shippingCost.toFixed(2)),
          total: Number(total.toFixed(2)),
        });
      },

      getTotalItems: () => {
        const items = get().items;
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getOrderItems: () => {
        const items = get().items;
        return items.map((item) => ({
          productId:
            typeof item.product === "string" ? item.product : item.product._id,
          quantity: item.quantity,
          price: item.price || 0,
        }));
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
        subtotal: state.subtotal,
        tax: state.tax,
        shippingCost: state.shippingCost,
        total: state.total,
      }),
      onRehydrateStorage: () => (state) => {
        // Recalculate totals after rehydration
        state?.calculateTotals();
      },
    }
  )
);
