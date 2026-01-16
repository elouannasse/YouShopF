"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { categoriesService } from "@/services/categories.service";
import { formatPrice } from "@/lib/utils";
import type { Category } from "@/types/api.types";

export interface ProductFiltersState {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: "newest" | "price-asc" | "price-desc" | "popular" | "rating";
}

interface ProductFiltersProps {
  filters: ProductFiltersState;
  onFiltersChange: (filters: ProductFiltersState) => void;
  isMobile?: boolean;
}

const MIN_PRICE = 0;
const MAX_PRICE = 1000;

/**
 * ProductFilters component
 * Desktop: Sidebar | Mobile: Drawer with toggle button
 * Updates URL searchParams on each filter change
 */
export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  isMobile = false,
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice ?? MIN_PRICE,
    filters.maxPrice ?? MAX_PRICE,
  ]);

  // Fetch categories with React Query (cache 5 minutes)
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["categories"],
    queryFn: categoriesService.getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update price range when filters change
  useEffect(() => {
    setPriceRange([
      filters.minPrice ?? MIN_PRICE,
      filters.maxPrice ?? MAX_PRICE,
    ]);
  }, [filters.minPrice, filters.maxPrice]);

  const handleCategoryChange = (categoryId: string) => {
    onFiltersChange({
      ...filters,
      categoryId: categoryId === "all" ? undefined : categoryId,
    });
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value as [number, number]);
  };

  const handlePriceChangeComplete = () => {
    onFiltersChange({
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  const handleInStockChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      inStock: checked || undefined,
    });
  };

  const handleSortChange = (sort: string) => {
    onFiltersChange({
      ...filters,
      sort: sort as ProductFiltersState["sort"],
    });
  };

  const handleResetFilters = () => {
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.categoryId ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.inStock ||
    filters.sort;

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Catégorie</Label>
        <Select
          value={filters.categoryId || "all"}
          onValueChange={handleCategoryChange}
          disabled={categoriesLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Price Range Filter */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold">Prix</Label>
        <div className="space-y-4">
          <Slider
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={10}
            value={priceRange}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceChangeComplete}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* In Stock Filter */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="inStock"
          checked={filters.inStock || false}
          onCheckedChange={handleInStockChange}
        />
        <Label
          htmlFor="inStock"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          En stock uniquement
        </Label>
      </div>

      <Separator />

      {/* Sort Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Trier par</Label>
        <Select
          value={filters.sort || "newest"}
          onValueChange={handleSortChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Plus récents" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Plus récents</SelectItem>
            <SelectItem value="price-asc">Prix croissant</SelectItem>
            <SelectItem value="price-desc">Prix décroissant</SelectItem>
            <SelectItem value="popular">Popularité</SelectItem>
            <SelectItem value="rating">Meilleures notes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={handleResetFilters}
          className="w-full"
        >
          <X className="mr-2 h-4 w-4" />
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );

  // Mobile: Drawer
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
            {hasActiveFilters && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                •
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filtres</SheetTitle>
            <SheetDescription>
              Affinez votre recherche avec les filtres ci-dessous
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <FiltersContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Sidebar
  return (
    <div className="w-64 space-y-6 rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filtres</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleResetFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <FiltersContent />
    </div>
  );
};
