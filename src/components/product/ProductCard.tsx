"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/api.types";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

/**
 * ProductCard component
 * Displays product with optimized image, price, stock status, and hover effects
 */
export const ProductCard = React.memo(
  ({ product, priority = false }: ProductCardProps) => {
    const { addItem } = useCart();
    const isOutOfStock = product.stock === 0;
    const hasDiscount =
      product.compareAtPrice && product.compareAtPrice > product.price;

    const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isOutOfStock) {
        toast.error("Produit en rupture de stock");
        return;
      }

      addItem(product, 1);
    };

    // Extract category name if it's a populated object
    const categoryName =
      typeof product.category === "object" ? product.category.name : undefined;

    return (
      <Link href={`/products/${product._id}`}>
        <Card className="group h-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            {/* Product Image */}
            <Image
              src={product.images[0] || "/placeholder-product.jpg"}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              priority={priority}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AoNLy8T7Xu0r1dXHVx3L0YL5cZ4qRmF3VZEQV3iiKMR/M//Z"
            />

            {/* Stock Badge */}
            {isOutOfStock && (
              <Badge
                variant="destructive"
                className="absolute top-2 left-2 z-10"
              >
                Rupture de stock
              </Badge>
            )}

            {/* Discount Badge */}
            {hasDiscount && !isOutOfStock && (
              <Badge className="absolute top-2 right-2 z-10 bg-green-500">
                -
                {Math.round(
                  ((product.compareAtPrice! - product.price) /
                    product.compareAtPrice!) *
                    100
                )}
                %
              </Badge>
            )}

            {/* Featured Badge */}
            {product.featured && !isOutOfStock && (
              <Badge className="absolute top-2 left-2 z-10 bg-orange-500">
                ⭐ Mis en avant
              </Badge>
            )}
          </div>

          <CardContent className="p-4">
            {/* Category */}
            {categoryName && (
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                {categoryName}
              </p>
            )}

            {/* Product Name */}
            <h3 className="font-semibold text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>

            {/* Rating & Reviews */}
            {product.rating &&
              product.reviewsCount &&
              product.reviewsCount > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>⭐ {product.rating.toFixed(1)}</span>
                  <span>({product.reviewsCount})</span>
                </div>
              )}

            {/* Stock Info */}
            {!isOutOfStock && product.stock < 10 && (
              <p className="text-xs text-orange-600 mt-2">
                Plus que {product.stock} en stock
              </p>
            )}
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full"
              size="sm"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isOutOfStock ? "Indisponible" : "Ajouter au panier"}
            </Button>
          </CardFooter>
        </Card>
      </Link>
    );
  }
);

ProductCard.displayName = "ProductCard";
