import { z } from "zod";

export const variantSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  compareAtPrice: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  length: z.string().optional(),
  texture: z.string().optional(),
  color: z.string().optional(),
  density: z.string().optional(),
  capSize: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  shortDescription: z.string().optional(),
  fullDescription: z.string().min(1, "Full description is required"),
  productType: z.enum(["WIG", "BUNDLE", "CLOSURE", "FRONTAL", "ACCESSORY"]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  basePrice: z.coerce.number().min(0, "Base price must be positive"),
  compareAtPrice: z.coerce.number().optional(),
  currency: z.string().default("USD"),
  images: z.array(z.string()).default([]),
  hairOrigin: z.string().optional(),
  hairTexture: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  variants: z.array(variantSchema).default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
export type VariantFormValues = z.infer<typeof variantSchema>;
