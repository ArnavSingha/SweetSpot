'server-only';
import { cookies } from 'next/headers';
import {
  getSession as dbGetSession,
  findUserById,
} from '@/lib/data';
import type { User } from '@/lib/types';

const SESSION_COOKIE_NAME = 'sweetspot_session';

export async function getSessionUser(): Promise<User | null> {
  const sessionId = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionId) {
    return null;
  }

  const session = await dbGetSession(sessionId);
  if (!session) {
    return null;
  }

  const user = await findUserById(session.userId);
  return user || null;
}
