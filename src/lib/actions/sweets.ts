'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createPurchase, getSweetById, updateSweet as dbUpdateSweet, createSweet as dbCreateSweet, deleteSweet as dbDeleteSweet } from '../data';
import type { CartItem, Sweet } from '../types';
import { getSessionUser } from '../server/auth';

export async function checkout(cart: CartItem[]) {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    for (const item of cart) {
      const sweet = await getSweetById(item.id);
      if (!sweet || sweet.quantity < item.quantity) {
        throw new Error(`Not enough stock for ${item.name}`);
      }
      
      const newQuantity = sweet.quantity - item.quantity;
      await dbUpdateSweet(sweet.id, { quantity: newQuantity });
      
      await createPurchase({
        userId: user.id,
        sweetId: sweet.id,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity,
      });
    }
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}

const sweetSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  category: z.string().min(2, 'Category is required'),
  price: z.coerce.number().min(0.01, 'Price must be positive'),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
  imageUrl: z.string().url('Must be a valid URL'),
  imageHint: z.string().optional(),
});

export async function createSweet(formData: FormData) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }

  const validatedFields = sweetSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid data', issues: validatedFields.error.flatten().fieldErrors };
  }

  await dbCreateSweet({
      ...validatedFields.data,
      imageHint: validatedFields.data.imageHint || validatedFields.data.name.toLowerCase()
  });

  revalidatePath('/dashboard/sweets');
  revalidatePath('/');
  return { success: true };
}

export async function updateSweet(sweetId: string, formData: FormData) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }

  const validatedFields = sweetSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid data', issues: validatedFields.error.flatten().fieldErrors };
  }

  await dbUpdateSweet(sweetId, validatedFields.data);

  revalidatePath('/dashboard/sweets');
  revalidatePath('/');
  return { success: true };
}

export async function deleteSweet(sweetId: string) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }

  await dbDeleteSweet(sweetId);

  revalidatePath('/dashboard/sweets');
  revalidatePath('/');
  return { success: true };
}
