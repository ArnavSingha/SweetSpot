'use server';

import 'server-only';
import '@/lib/env';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import type { User } from './types';

const TOKEN_COOKIE_NAME = 'sweetspot_jwt';
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export async function createSession(user: User) {
  const payload = { userId: user.id, role: user.role, name: user.name };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

  (await cookies()).set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  (await cookies()).set(TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    expires: new Date(0),
  });
}
