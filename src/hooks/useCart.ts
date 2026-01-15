"use client";

import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/types/api.types";
import { toast } from "sonner";

/**
 * Custom hook for cart management
 * Provides all cart operations with toast notifications
 */
export const useCart = () => {
  const {
    items,
    subtotal,
    tax,
    shippingCost,
    total,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  } = useCartStore();

  /**
   * Add item to cart with notification
   */
  const handleAddItem = (product: Product, quantity: number = 1) => {
    addItem(product, quantity);
    toast.success(`${product.name} ajouté au panier`, {
      description: `Quantité: ${quantity}`,
    });
  };

  /**
   * Remove item from cart with notification
   */
  const handleRemoveItem = (productId: string, productName?: string) => {
    removeItem(productId);
    toast.success(
      productName
        ? `${productName} retiré du panier`
        : "Produit retiré du panier"
    );
  };

  /**
   * Update item quantity with notification
   */
  const handleUpdateQuantity = (
    productId: string,
    quantity: number,
    productName?: string
  ) => {
    if (quantity === 0) {
      handleRemoveItem(productId, productName);
      return;
    }

    updateQuantity(productId, quantity);
    toast.success("Quantité mise à jour");
  };

  /**
   * Clear cart with confirmation
   */
  const handleClearCart = () => {
    clearCart();
    toast.success("Panier vidé");
  };

  /**
   * Get cart item count
   */
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  /**
   * Check if product is in cart
   */
  const isInCart = (productId: string): boolean => {
    return items.some(
      (item) =>
        (typeof item.product === "string" ? item.product : item.product._id) ===
        productId
    );
  };

  /**
   * Get item quantity in cart
   */
  const getItemQuantity = (productId: string): number => {
    const item = items.find(
      (item) =>
        (typeof item.product === "string" ? item.product : item.product._id) ===
        productId
    );
    return item?.quantity || 0;
  };

  /**
   * Check if cart is empty
   */
  const isEmpty = items.length === 0;

  /**
   * Check if free shipping threshold is met
   */
  const FREE_SHIPPING_THRESHOLD = 50;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal
  );

  return {
    // State
    items,
    subtotal,
    tax,
    shippingCost,
    total,
    isOpen,
    itemCount,
    isEmpty,
    isFreeShipping,
    remainingForFreeShipping,

    // Actions
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    openCart,
    closeCart,
    toggleCart,

    // Utility functions
    isInCart,
    getItemQuantity,
  };
};
