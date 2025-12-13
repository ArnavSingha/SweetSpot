'use server';
import '@/lib/env';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { findUserById } from '@/lib/data';
import type { User } from '@/lib/types';

const TOKEN_COOKIE_NAME = 'sweetspot_jwt';
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

type DecodedToken = {
  userId: string;
  role: 'user' | 'admin';
  name: string;
  iat: number;
  exp: number;
};

export async function getSessionUser(): Promise<User | null> {
  const token = (await cookies()).get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    const user = await findUserById(decoded.userId);
    return user;
  } catch (error) {
    console.error('Invalid JWT:', error);
    // If the token is invalid or expired, ensure it's deleted.
    (await cookies()).set(TOKEN_COOKIE_NAME, '', { expires: new Date(0) });
    return null;
  }
}
