"use client";

import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types/api.types";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

/**
 * CartItem component
 * Displays cart item with image, name, price, quantity controls, and remove button
 */
export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const productId =
    typeof item.product === "string" ? item.product : item.product.id;
  const productName =
    item.name ||
    (typeof item.product === "object" ? item.product.name : "Produit");
  const productImage =
    item.image ||
    (typeof item.product === "object" && (item.product.imageUrl || item.product.images?.[0])) ||
    "/placeholder-product.jpg";
  const productPrice =
    item.price || (typeof item.product === "object" ? item.product.price : 0);
  const subtotal = productPrice * item.quantity;

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(productId, item.quantity - 1);
    }
  };

  const handleIncrement = () => {
    onUpdateQuantity(productId, item.quantity + 1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onUpdateQuantity(productId, value);
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b last:border-0">
      {/* Product Image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
        <Image
          src={productImage}
          alt={productName}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-2 mb-1">{productName}</h4>
        <p className="text-sm text-muted-foreground">
          {formatPrice(productPrice)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
            className="h-7 w-7 p-0"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="h-7 w-14 text-center"
            min="1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleIncrement}
            className="h-7 w-7 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Subtotal & Remove */}
      <div className="flex flex-col items-end justify-between">
        <p className="font-semibold text-sm">{formatPrice(subtotal)}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(productId)}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Supprimer</span>
        </Button>
      </div>
    </div>
  );
};
