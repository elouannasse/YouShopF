import { z } from "zod";

/**
 * Validation schemas for admin CRUD operations
 */

// Product validation schema
export const productSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(200, "Le nom ne peut pas dépasser 200 caractères"),
  
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(2000, "La description ne peut pas dépasser 2000 caractères"),
  
  price: z
    .number({ required_error: "Le prix est requis" })
    .min(0.01, "Le prix doit être supérieur à 0")
    .multipleOf(0.01, "Le prix ne peut avoir que 2 décimales maximum"),
  
  category: z
    .string({ required_error: "La catégorie est requise" })
    .min(1, "Veuillez sélectionner une catégorie"),
  
  stock: z
    .number({ required_error: "Le stock est requis" })
    .int("Le stock doit être un nombre entier")
    .min(0, "Le stock ne peut pas être négatif"),
  
  images: z
    .array(z.string().url("URL d'image invalide"))
    .min(1, "Au moins une image est requise")
    .max(10, "Maximum 10 images"),
  
  isActive: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Product update schema (all fields optional)
export const productUpdateSchema = productSchema.partial();

export type ProductUpdateData = z.infer<typeof productUpdateSchema>;

// Category validation schema
export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  
  description: z
    .string()
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .optional()
    .or(z.literal("")),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// Order status validation
export const orderStatusSchema = z.enum(["PENDING", "PAID", "CANCELLED", "EXPIRED"]);

export type OrderStatusValue = z.infer<typeof orderStatusSchema>;

// Filters schemas
export const productFiltersSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  sortBy: z.enum(["name", "price", "stock", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ProductFiltersData = z.infer<typeof productFiltersSchema>;

export const orderFiltersSchema = z.object({
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
});

export type OrderFiltersData = z.infer<typeof orderFiltersSchema>;
