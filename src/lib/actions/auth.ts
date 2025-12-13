'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { findUserByEmail } from '../data';
import { createSession, deleteSession } from '../auth';
import { getSessionUser } from '@/lib/server/auth';
import type { User } from '../types';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginState = {
  error?: string;
  success?: boolean;
};

export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return { error: 'Invalid email or password.' };
  }

  const { email, password } = validatedFields.data;
  const user = await findUserByEmail(email);

  if (!user || user.passwordHash !== password) {
    return { error: 'Invalid email or password.' };
  }

  await createSession(user.id);

  if (user.role === 'admin') {
    redirect('/dashboard');
  } else {
    redirect('/');
  }
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}

export async function getSessionUserAction(): Promise<User | null> {
    return getSessionUser();
}
