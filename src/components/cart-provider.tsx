'use client';

import type { ReactNode } from 'react';
import { useCartStore } from '@/hooks/use-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const { cart, addToCart, removeFromCart, clearCart, updateQuantity } = useCartStore();
  
  // This component doesn't render anything itself, it just initializes the store.
  // The store is a Zustand store, so it's accessible anywhere via the useCartStore hook.
  
  return <>{children}</>;
}
