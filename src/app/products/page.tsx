"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/ProductGrid";
import {
  ProductFilters,
  type ProductFiltersState,
} from "@/components/product/ProductFilters";
import { SearchBar } from "@/components/product/SearchBar";
import { productsService } from "@/services/products.service";
import { useAuth } from "@/hooks/useAuth";
import type { ProductsResponse } from "@/types/api.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "@/components/admin/ProductForm";
import type { ProductFormData } from "@/lib/validations/admin.validations";
import { toast } from "sonner";

/**
 * Products catalog page with advanced filtering, search, and pagination
 */
export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const queryClient = useQueryClient();

  // Dialog state for adding new product
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Parse filters from URL searchParams
  const filters = useMemo<ProductFiltersState>(
    () => ({
      categoryId: searchParams.get("categoryId") || undefined,
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      inStock: searchParams.get("inStock") === "true" || undefined,
      sort:
        (searchParams.get("sort") as ProductFiltersState["sort"]) || undefined,
    }),
    [searchParams],
  );

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = 12;

  // Fetch products with React Query
  const { data, isLoading } = useQuery<ProductsResponse>({
    queryKey: ["products", filters, search, page],
    queryFn: () =>
      productsService.getProducts({
        ...filters,
        search: search || undefined,
        page,
        limit,
        isActive: true,
      }),
  });

  // Update URL searchParams
  const updateSearchParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  // Handle filters change
  const handleFiltersChange = useCallback(
    (newFilters: ProductFiltersState) => {
      updateSearchParams({
        categoryId: newFilters.categoryId,
        minPrice: newFilters.minPrice?.toString(),
        maxPrice: newFilters.maxPrice?.toString(),
        inStock: newFilters.inStock?.toString(),
        sort: newFilters.sort,
        page: "1", // Reset to page 1 when filters change
      });
    },
    [updateSearchParams],
  );

  // Handle search
  const handleSearch = useCallback(
    (query: string) => {
      updateSearchParams({
        search: query || undefined,
        page: "1", // Reset to page 1 when search changes
      });
    },
    [updateSearchParams],
  );

  // Handle pagination
  const handlePageChange = useCallback(
    (newPage: number) => {
      updateSearchParams({
        page: newPage.toString(),
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateSearchParams],
  );

  const products = data?.products || [];
  const pagination = data?.pagination;
  const totalProducts = pagination?.total || 0;

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: (data: ProductFormData) => productsService.createProduct(data),
    onSuccess: () => {
      toast.success("Produit ajouté avec succès !");
      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Erreur lors de l'ajout du produit",
      );
    },
  });

  const handleCreateProduct = async (data: ProductFormData) => {
    await createProductMutation.mutateAsync(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Catalogue produits
            </h1>
            {/* Admin: Add Product Button */}
            {isAdmin && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Produit
              </Button>
            )}
          </div>
          <p className="text-gray-600">
            {totalProducts}{" "}
            {totalProducts > 1 ? "produits trouvés" : "produit trouvé"}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            onSearch={handleSearch}
            defaultValue={search}
            placeholder="Rechercher un produit..."
          />
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-4">
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                isMobile={false}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile Filters Button */}
            <div className="lg:hidden mb-6">
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                isMobile={true}
              />
            </div>

            {/* Products Grid */}
            <ProductGrid products={products} isLoading={isLoading} />

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Précédent
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter((p) => {
                      // Show first page, last page, current page, and 2 pages around current
                      return (
                        p === 1 ||
                        p === pagination.pages ||
                        Math.abs(p - page) <= 2
                      );
                    })
                    .map((p, i, arr) => {
                      // Add ellipsis
                      const showEllipsis = i > 0 && p - arr[i - 1] > 1;
                      return (
                        <React.Fragment key={p}>
                          {showEllipsis && (
                            <span className="px-2 text-muted-foreground">
                              ...
                            </span>
                          )}
                          <Button
                            variant={p === page ? "default" : "outline"}
                            onClick={() => handlePageChange(p)}
                            className="min-w-[40px]"
                          >
                            {p}
                          </Button>
                        </React.Fragment>
                      );
                    })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.pages}
                >
                  Suivant
                </Button>
              </div>
            )}

            {/* Results Summary */}
            {pagination && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Page {pagination.page} sur {pagination.pages} (
                {pagination.total} produits)
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau produit</DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour créer un nouveau
              produit
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            onSubmit={handleCreateProduct}
            isLoading={createProductMutation.isPending}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
