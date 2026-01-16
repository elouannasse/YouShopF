import { z } from "zod";
import { VALIDATION } from "./constants";

export const loginSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Email invalide"),
  password: z
    .string()
    .min(
      VALIDATION.PASSWORD_MIN_LENGTH,
      `Le mot de passe doit contenir au moins ${VALIDATION.PASSWORD_MIN_LENGTH} caractères`
    ),
});

export const registerSchema = z
  .object({
    email: z.string().min(1, "L'email est requis").email("Email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
    firstName: z
      .string()
      .min(2, "Le prénom doit contenir au moins 2 caractères")
      .max(50, "Le prénom ne peut pas dépasser 50 caractères")
      .optional()
      .or(z.literal("")),
    lastName: z
      .string()
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(50, "Le nom ne peut pas dépasser 50 caractères")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Email invalide"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(
        VALIDATION.PASSWORD_MIN_LENGTH,
        `Le mot de passe doit contenir au moins ${VALIDATION.PASSWORD_MIN_LENGTH} caractères`
      ),
    confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

// ============================================
// ADDRESS SCHEMAS
// ============================================

export const addressSchema = z.object({
  firstName: z.string().min(VALIDATION.NAME_MIN_LENGTH, "Le prénom est requis"),
  lastName: z.string().min(VALIDATION.NAME_MIN_LENGTH, "Le nom est requis"),
  addressLine1: z.string().min(1, "L'adresse est requise"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "La ville est requise"),
  postalCode: z
    .string()
    .regex(VALIDATION.POSTAL_CODE_REGEX, "Code postal invalide (5 chiffres)"),
  country: z.string().min(1, "Le pays est requis"),
  phone: z
    .string()
    .regex(VALIDATION.PHONE_REGEX, "Numéro de téléphone invalide"),
  isDefault: z.boolean().optional(),
});

// ============================================
// PRODUCT SCHEMAS
// ============================================

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom du produit est requis")
    .max(200, "Le nom ne peut pas dépasser 200 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  shortDescription: z
    .string()
    .max(300, "La description courte ne peut pas dépasser 300 caractères")
    .optional(),
  price: z.number().min(0.01, "Le prix doit être supérieur à 0"),
  compareAtPrice: z.number().min(0).optional(),
  stock: z
    .number()
    .int("Le stock doit être un nombre entier")
    .min(0, "Le stock ne peut pas être négatif"),
  category: z.string().min(1, "La catégorie est requise"),
  brand: z.string().optional(),
  sku: z.string().optional(),
  images: z.array(z.string().url()).min(1, "Au moins une image est requise"),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
});

// ============================================
// ORDER SCHEMAS
// ============================================

export const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  paymentMethod: z
    .enum(["card", "paypal", "bank_transfer"])
    .refine((val) => ["card", "paypal", "bank_transfer"].includes(val), {
      message: "Veuillez sélectionner un moyen de paiement",
    }),
  notes: z
    .string()
    .max(500, "Les notes ne peuvent pas dépasser 500 caractères")
    .optional(),
  useSameAddress: z.boolean().optional(),
});

// ============================================
// REVIEW SCHEMAS
// ============================================

export const reviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "La note minimum est 1")
    .max(5, "La note maximum est 5"),
  title: z
    .string()
    .max(100, "Le titre ne peut pas dépasser 100 caractères")
    .optional(),
  comment: z
    .string()
    .min(10, "Le commentaire doit contenir au moins 10 caractères")
    .max(1000, "Le commentaire ne peut pas dépasser 1000 caractères"),
});

// ============================================
// PROFILE SCHEMAS
// ============================================

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(
      VALIDATION.NAME_MIN_LENGTH,
      `Le nom doit contenir au moins ${VALIDATION.NAME_MIN_LENGTH} caractères`
    )
    .max(
      VALIDATION.NAME_MAX_LENGTH,
      `Le nom ne peut pas dépasser ${VALIDATION.NAME_MAX_LENGTH} caractères`
    ),
  email: z.string().email("Email invalide"),
  phone: z
    .string()
    .regex(VALIDATION.PHONE_REGEX, "Numéro de téléphone invalide")
    .optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: z
      .string()
      .min(
        VALIDATION.PASSWORD_MIN_LENGTH,
        `Le nouveau mot de passe doit contenir au moins ${VALIDATION.PASSWORD_MIN_LENGTH} caractères`
      ),
    confirmPassword: z
      .string()
      .min(1, "Veuillez confirmer le nouveau mot de passe"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

// ============================================
// TYPE INFERENCE
// ============================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
