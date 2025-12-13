'use server';

import { revalidatePath } from 'next/cache';
import { 
  createPurchase, 
  getSweetById, 
  updateSweet as dbUpdateSweet, 
} from '../data';
import type { CartItem } from '../types';
import { getSessionUser } from '../server/auth';
import { restockSchema } from '../validation/sweetSchemas';

/**
 * Processes the purchase of a list of sweets from the cart.
 * It atomically updates the quantity of each sweet in the database.
 * If any sweet doesn't have enough stock, the entire transaction fails.
 *
 * @param cart - An array of cart items to be purchased.
 * @returns An object indicating success or failure with an error message.
 */
export async function purchaseSweetsAction(cart: CartItem[]) {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: 'User not authenticated. Please log in.' };
  }
  if (cart.length === 0) {
    return { success: false, error: 'Your cart is empty.' };
  }

  try {
    for (const item of cart) {
      const sweet = await getSweetById(item.id);

      if (!sweet) {
        throw new Error(`The sweet "${item.name}" is no longer available.`);
      }

      if (sweet.quantity < item.quantity) {
        throw new Error(`Not enough stock for ${item.name}. Only ${sweet.quantity} left.`);
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
    revalidatePath('/profile');
    
    return { success: true, message: 'Purchase successful!' };

  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred during checkout.' 
    };
  }
}

/**
 * Restocks a sweet by increasing its quantity. This is an admin-only action.
 *
 * @param formData - The form data containing the sweetId and restock quantity.
 * @returns An object indicating success or failure with the updated sweet data or an error message.
 */
export async function restockSweetAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    return { success: false, error: 'Unauthorized operation.' };
  }

  const validatedFields = restockSchema.safeParse({
    sweetId: formData.get('sweetId'),
    quantity: formData.get('quantity'),
  });

  if (!validatedFields.success) {
    return { 
      success: false, 
      error: 'Invalid data provided.', 
      issues: validatedFields.error.flatten().fieldErrors 
    };
  }
  
  const { sweetId, quantity } = validatedFields.data;

  try {
    const sweet = await getSweetById(sweetId);
    if (!sweet) {
      return { success: false, error: 'Sweet not found.' };
    }

    const newQuantity = sweet.quantity + quantity;
    const updatedSweet = await dbUpdateSweet(sweetId, { quantity: newQuantity });

    revalidatePath('/admin');
    revalidatePath('/');

    return { success: true, data: updatedSweet };
  } catch (e) {
    return { success: false, error: 'Database error: failed to restock sweet.' };
  }
}
