"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { X, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { categoriesService } from "@/services/categories.service";
import { productSchema, type ProductFormData } from "@/lib/validations/admin.validations";
import type { Product } from "@/types/api.types";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function ProductForm({
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
}: ProductFormProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialData?.images || []
  );
  const [newImageUrl, setNewImageUrl] = useState("");

  // Fetch categories for select dropdown
  const { data: categoriesResponse, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getCategories(),
    retry: 3,
    retryDelay: 1000,
  });

  const categories = categoriesResponse?.categories || [];
  
  // Debug logging
  useEffect(() => {
    console.log("[ProductForm] Categories query state:", {
      isLoading: categoriesLoading,
      hasError: !!categoriesError,
      error: categoriesError,
      response: categoriesResponse,
      categoriesCount: categories.length,
      categories: categories
    });
  }, [categories, categoriesError, categoriesLoading, categoriesResponse]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      category: initialData?.category?.id || initialData?.category?._id || "",
      stock: initialData?.stock || 0,
      images: initialData?.images || [],
      isActive: initialData?.isActive ?? true,
    },
  });

  const isActive = watch("isActive");

  // Sync imageUrls with form
  useEffect(() => {
    setValue("images", imageUrls);
  }, [imageUrls, setValue]);

  const handleAddImage = () => {
    if (newImageUrl.trim() && imageUrls.length < 10) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    console.log("[ProductForm] Form submitted with data:", data);
    
    // Validation manuelle
    if (!data.name || data.name.trim().length < 3) {
      console.error("[ProductForm] Validation error: Name too short");
      return;
    }
    
    if (!data.description || data.description.trim().length < 10) {
      console.error("[ProductForm] Validation error: Description too short");
      return;
    }
    
    if (!data.price || data.price <= 0) {
      console.error("[ProductForm] Validation error: Invalid price");
      return;
    }
    
    if (!data.category) {
      console.error("[ProductForm] Validation error: No category selected");
      return;
    }
    
    if (!data.images || data.images.length === 0) {
      console.error("[ProductForm] Validation error: No images provided");
      return;
    }
    
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("[ProductForm] Submit error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Nom */}
      <div>
        <label className="text-sm font-medium">
          Nom du produit <span className="text-destructive">*</span>
        </label>
        <Input
          {...register("name")}
          placeholder="Ex: iPhone 15 Pro Max"
          className="mt-1.5"
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium">
          Description <span className="text-destructive">*</span>
        </label>
        <Textarea
          {...register("description")}
          placeholder="Décrivez le produit en détail..."
          rows={6}
          className="mt-1.5"
        />
        {errors.description && (
          <p className="text-sm text-destructive mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Prix et Stock */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">
            Prix (€) <span className="text-destructive">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            placeholder="99.99"
            className="mt-1.5"
          />
          {errors.price && (
            <p className="text-sm text-destructive mt-1">
              {errors.price.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">
            Stock <span className="text-destructive">*</span>
          </label>
          <Input
            type="number"
            {...register("stock", { valueAsNumber: true })}
            placeholder="50"
            className="mt-1.5"
          />
          {errors.stock && (
            <p className="text-sm text-destructive mt-1">
              {errors.stock.message}
            </p>
          )}
        </div>
      </div>

      {/* Catégorie */}
      <div>
        <label className="text-sm font-medium">
          Catégorie <span className="text-destructive">*</span>
        </label>
        <Select
          onValueChange={(value) => setValue("category", value)}
          defaultValue={initialData?.category?.id || initialData?.category?._id}
          disabled={categoriesLoading || isLoading}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder={
              categoriesLoading 
                ? "Chargement des catégories..." 
                : categoriesError 
                  ? "Erreur de chargement"
                  : categories.length === 0
                    ? "Aucune catégorie disponible"
                    : "Sélectionnez une catégorie"
            } />
          </SelectTrigger>
          <SelectContent>
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : categoriesError ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Erreur lors du chargement
              </div>
            ) : categories.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Aucune catégorie disponible
              </div>
            ) : (
              categories.map((category) => {
                const categoryId = category.id || category._id;
                return (
                  <SelectItem key={categoryId} value={categoryId}>
                    {category.name}
                  </SelectItem>
                );
              })
            )}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-destructive mt-1">
            {errors.category.message}
          </p>
        )}
        {categoriesError && (
          <p className="text-sm text-yellow-600 mt-1">
            ⚠️ Impossible de charger les catégories. Vérifiez votre connexion.
          </p>
        )}
      </div>

      {/* Images */}
      <div>
        <label className="text-sm font-medium">
          Images <span className="text-destructive">*</span>
        </label>
        <p className="text-xs text-muted-foreground mt-1">
          Ajoutez jusqu'à 10 images (URLs)
        </p>

        {/* Input pour ajouter une image */}
        <div className="flex gap-2 mt-2">
          <Input
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="https://exemple.com/image.jpg"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddImage();
              }
            }}
          />
          <Button
            type="button"
            onClick={handleAddImage}
            disabled={!newImageUrl.trim() || imageUrls.length >= 10}
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {errors.images && (
          <p className="text-sm text-destructive mt-1">
            {errors.images.message}
          </p>
        )}

        {/* Preview des images */}
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {imageUrls.map((url, index) => (
              <Card key={index} className="relative overflow-hidden p-2">
                <div className="relative aspect-square">
                  <Image
                    src={url}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.png";
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Actif */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) => setValue("isActive", !!checked)}
        />
        <label
          htmlFor="isActive"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Produit actif (visible sur le site)
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : initialData ? (
            "Enregistrer"
          ) : (
            "Créer"
          )}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
}
