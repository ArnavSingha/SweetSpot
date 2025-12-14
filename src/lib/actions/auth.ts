'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { findUserByEmail, createUser } from '../data';
import { createSession, deleteSession } from '../auth';
import { getSessionUser } from '@/lib/server/auth';
import type { User } from '../types';
import { verifyPassword, hashPassword } from '../server/password';
import { loginSchema, registerSchema } from '../validation/userSchemas';

type AuthState = {
  error?: string;
  success?: boolean;
  issues?: Record<string, string[]>;
};

export async function login(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return { error: 'Invalid email or password.' };
  }

  const { email, password } = validatedFields.data;
  const user = await findUserByEmail(email);

  if (!user) {
    return { error: 'Invalid email or password.' };
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) {
    return { error: 'Invalid email or password.' };
  }

  await createSession(user);

  if (user.role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/');
  }
}

export async function register(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
    const validatedFields = registerSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return { 
          error: 'Invalid data provided. Please check the fields.',
          issues: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, email, password } = validatedFields.data;

    try {
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
          return { error: 'An account with this email already exists.' };
      }

      const passwordHash = await hashPassword(password);
      const newUser = await createUser({
          name,
          email,
          passwordHash,
          role: 'user',
      });

      await createSession(newUser);
    } catch (e) {
      console.error(e);
      return { error: 'Something went wrong on the server. Please try again.' };
    }
    
    redirect('/');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}

export async function getSessionUserAction(): Promise<User | null> {
    return getSessionUser();
}
