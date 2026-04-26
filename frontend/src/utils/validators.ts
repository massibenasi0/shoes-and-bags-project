import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const shippingSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip_code: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number({ invalid_type_error: "Price must be a number" }).positive("Price must be positive"),
  category_id: z.string().uuid("Valid category required"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  brand: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ShippingFormData = z.infer<typeof shippingSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
