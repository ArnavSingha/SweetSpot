import { z } from 'zod';

export const createSweetSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  category: z.string().min(2, 'Category is required.'),
  price: z.coerce.number().min(0.01, 'Price must be a positive number.'),
  quantity: z.coerce.number().int().min(0, 'Quantity must be a non-negative integer.'),
  imageUrl: z.string().url('Image URL must be a valid URL.'),
});

export type CreateSweetData = z.infer<typeof createSweetSchema>;

export const updateSweetSchema = createSweetSchema.partial();

export type UpdateSweetData = z.infer<typeof updateSweetSchema>;

export const purchaseSchema = z.object({
    sweetId: z.string().min(1, "Sweet ID is required."),
    quantity: z.number().int().min(1, "Quantity must be at least 1."),
});

export const restockSchema = z.object({
    sweetId: z.string().min(1, "Sweet ID is required."),
    quantity: z.coerce.number().int({ message: "Restock quantity must be a whole number." }).min(1, "Restock quantity must be at least 1."),
});
