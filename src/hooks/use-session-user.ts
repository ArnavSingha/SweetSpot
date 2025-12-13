'use client';

import { useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import { getSessionUserAction } from '@/lib/actions/auth';

export function useSessionUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const sessionUser = await getSessionUserAction();
        setUser(sessionUser);
      } catch (error) {
        console.error('Failed to fetch session user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, loading };
}
