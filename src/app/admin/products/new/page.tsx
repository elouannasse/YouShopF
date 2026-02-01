"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProductForm } from "@/components/admin/ProductForm";
import { productsService } from "@/services/products.service";
import type { ProductFormData } from "@/lib/validations/admin.validations";

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: ProductFormData) => {
      console.log("[NewProductPage] Creating product with data:", data);
      return productsService.createProduct(data);
    },
    onSuccess: (result) => {
      console.log("[NewProductPage] Product created successfully:", result);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Produit créé avec succès");
      router.push("/admin/products");
    },
    onError: (error: any) => {
      console.error("[NewProductPage] Creation error:", error);
      toast.error(
        error?.response?.data?.message || "Erreur lors de la création du produit"
      );
    },
  });

  const handleSubmit = async (data: ProductFormData) => {
    console.log("[NewProductPage] Submitting product data:", data);
    try {
      await createMutation.mutateAsync(data);
    } catch (error) {
      console.error("[NewProductPage] Submit error:", error);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">Nouveau Produit</h1>
          <p className="text-muted-foreground mt-1">
            Ajoutez un nouveau produit à votre catalogue
        </p>
      </div>

      {/* Form */}
      <Card className="p-6">
        <ProductForm
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
        />
      </Card>
    </div>
    </ProtectedRoute>
  );
}
