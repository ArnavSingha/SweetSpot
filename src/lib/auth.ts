import 'server-only';
import { cookies } from 'next/headers';
import {
  createSession as dbCreateSession,
  deleteSession as dbDeleteSession,
} from './data';
import { findUserById } from './data';

const SESSION_COOKIE_NAME = 'sweetspot_session';
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

export async function createSession(userId: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('Cannot create session for non-existent user');
  }

  const session = await dbCreateSession(user.id, SESSION_DURATION * 1000);
  cookies().set(SESSION_COOKIE_NAME, session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: session.expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  const sessionId = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (sessionId) {
    await dbDeleteSession(sessionId);
    cookies().set(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      expires: new Date(0),
    });
  }
}
