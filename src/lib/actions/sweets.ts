'use server';

import { revalidatePath } from 'next/cache';
import {
  updateSweet as dbUpdateSweet,
  createSweet as dbCreateSweet,
  deleteSweet as dbDeleteSweet,
  getSweetById,
} from '../data';
import { getSessionUser } from '../server/auth';
import {
  createSweetSchema,
  updateSweetSchema,
} from '../validation/sweetSchemas';

export async function createSweet(formData: FormData) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }

  const validatedFields = createSweetSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid data provided.',
      issues: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const data = {
    ...validatedFields.data,
    imageHint:
      validatedFields.data.name.toLowerCase().split(' ').slice(0, 2).join(' '),
  };

  try {
    await dbCreateSweet(data);
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Database error: failed to create sweet.' };
  }

  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function updateSweet(sweetId: string, formData: FormData) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }

  const validatedFields = updateSweetSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid data provided.',
      issues: validatedFields.error.flatten().fieldErrors,
    };
  }

  const dataToUpdate: any = validatedFields.data;

  try {
    await dbUpdateSweet(sweetId, dataToUpdate);
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Database error: failed to update sweet.' };
  }

  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function deleteSweet(sweetId: string) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await dbDeleteSweet(sweetId);
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Database error: failed to delete sweet.' };
  }

  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function getSweetAction(sweetId: string) {
    try {
        const sweet = await getSweetById(sweetId);
        return sweet;
    } catch(e) {
        console.error(e);
        return null;
    }
}
