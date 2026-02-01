"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ProductForm } from "@/components/admin/ProductForm";
import { productsService } from "@/services/products.service";
import type { ProductFormData } from "@/lib/validations/admin.validations";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch product
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", params.id],
    queryFn: () => productsService.getProductById(params.id),
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProductFormData) =>
      productsService.updateProduct(params.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["product", params.id] });
      toast.success("Produit mis à jour avec succès");
      router.push("/admin/products");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Erreur lors de la mise à jour du produit",
      );
    },
  });

  const handleSubmit = async (data: ProductFormData) => {
    await updateMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card className="p-6">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">Produit introuvable</p>
        <Button onClick={() => router.push("/admin/products")}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
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
        <h1 className="text-3xl font-bold">Modifier le Produit</h1>
        <p className="text-muted-foreground mt-1">
          Modifiez les informations du produit <strong>{product.name}</strong>
        </p>
      </div>

      {/* Form */}
      <Card className="p-6">
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
        />
      </Card>
    </div>
  );
}
