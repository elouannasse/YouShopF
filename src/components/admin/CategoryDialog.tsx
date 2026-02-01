"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, X, Tag, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { categoriesService } from "@/services/categories.service";
import { categorySchema, type CategoryFormData } from "@/lib/validations/admin.validations";
import type { Category } from "@/types/api.types";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  category?: Category;
}

export function CategoryDialog({
  open,
  onOpenChange,
  mode,
  category,
}: CategoryDialogProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  });

  // Reset form when dialog opens with category data
  useEffect(() => {
    if (open && category) {
      reset({
        name: category.name,
        description: category.description || "",
      });
    } else if (open && !category) {
      reset({
        name: "",
        description: "",
      });
    }
  }, [open, category, reset]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CategoryFormData) => categoriesService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Catégorie créée avec succès");
      reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Erreur lors de la création");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: CategoryFormData) => {
      const categoryId = category?.id || category?._id;
      console.log("[CategoryDialog] Updating category with ID:", categoryId, category);
      if (!categoryId) {
        throw new Error("Category ID is missing");
      }
      return categoriesService.updateCategory(categoryId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Catégorie mise à jour avec succès");
      reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error("[CategoryDialog] Update error:", error);
      toast.error(error?.response?.data?.message || "Erreur lors de la mise à jour");
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    if (mode === "create") {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-0 gap-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              {mode === "create" ? "Créer une nouvelle catégorie" : "Modifier la catégorie"}
            </DialogTitle>
            <DialogDescription className="text-blue-100">
              {mode === "create"
                ? "Ajoutez une nouvelle catégorie pour organiser vos produits."
                : "Modifiez les informations de la catégorie existante."}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-6">
          {/* Nom */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Tag className="h-4 w-4 text-blue-600" />
              Nom de la catégorie
              <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("name")}
              placeholder="Ex: Électronique, Vêtements, Alimentation..."
              className={`
                h-11 transition-all duration-200
                ${errors.name 
                  ? "border-red-500 focus-visible:ring-red-500" 
                  : "border-gray-300 focus-visible:ring-blue-500"
                }
                focus-visible:ring-2 focus-visible:ring-offset-2
              `}
              autoFocus
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <span className="inline-block w-1 h-1 rounded-full bg-red-600" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              Description
              <span className="text-sm font-normal text-gray-500">(optionnel)</span>
            </label>
            <Textarea
              {...register("description")}
              placeholder="Décrivez brièvement cette catégorie pour aider vos clients..."
              rows={4}
              className={`
                resize-none transition-all duration-200
                ${errors.description 
                  ? "border-red-500 focus-visible:ring-red-500" 
                  : "border-gray-300 focus-visible:ring-purple-500"
                }
                focus-visible:ring-2 focus-visible:ring-offset-2
              `}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <span className="inline-block w-1 h-1 rounded-full bg-red-600" />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Footer with buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="min-w-[100px] transition-all duration-200 hover:bg-gray-100"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className={`
                min-w-[120px] transition-all duration-200
                ${mode === "create" 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                  : "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                }
                shadow-lg hover:shadow-xl
              `}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enregistrement...
                </span>
              ) : mode === "create" ? (
                "Créer la catégorie"
              ) : (
                "Enregistrer"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
