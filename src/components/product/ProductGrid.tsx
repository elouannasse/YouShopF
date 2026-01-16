"use client";

import React from "react";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types/api.types";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  priority?: boolean;
}

/**
 * ProductGrid component
 * Responsive grid: 1 col (mobile), 3 cols (tablet), 4 cols (desktop)
 * Shows skeleton loaders during loading
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  priority = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
        <p className="text-muted-foreground">
          Essayez de modifier vos filtres ou votre recherche
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          priority={priority && index < 4} // Priority for first 4 products (above the fold)
        />
      ))}
    </div>
  );
};

/**
 * Skeleton loader for ProductCard
 */
const ProductCardSkeleton = () => {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="aspect-square w-full" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-3 w-32" />
      </div>

      {/* Button skeleton */}
      <div className="p-4 pt-0">
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
};
