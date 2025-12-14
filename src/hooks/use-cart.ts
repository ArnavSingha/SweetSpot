'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, Sweet } from '@/lib/types';
import { toast } from './use-toast';

type CartState = {
  cart: CartItem[];
  addToCart: (sweet: Sweet) => void;
  removeFromCart: (sweetId: string) => void;
  updateQuantity: (sweetId: string, quantity: number) => void;
  decrementQuantity: (sweetId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (sweet) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.id === sweet.id);

        if (existingItem) {
          if (existingItem.quantity < sweet.quantity) {
             set((state) => ({
                cart: state.cart.map((item) =>
                    item.id === sweet.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                ),
            }));
            if (useCartStore.getState().cart.find(item => item.id === sweet.id)!.quantity > existingItem.quantity) {
                 toast({ title: "Added to cart", description: `${sweet.name} quantity updated.` });
            }
          } else {
             toast({ title: "Stock limit reached", description: `You cannot add more of ${sweet.name}.`, variant: "destructive" });
          }
        } else {
          if (sweet.quantity > 0) {
            set((state) => ({
                cart: [...state.cart, { ...sweet, quantity: 1 }],
            }));
            toast({ title: "Added to cart", description: `${sweet.name} has been added to your cart.` });
          } else {
            toast({ title: "Out of stock", description: `${sweet.name} is currently out of stock.`, variant: "destructive" });
          }
        }
      },
      decrementQuantity: (sweetId) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.id === sweetId);

        if (existingItem) {
          if (existingItem.quantity > 1) {
            set((state) => ({
              cart: state.cart.map((item) =>
                item.id === sweetId ? { ...item, quantity: item.quantity - 1 } : item
              ),
            }));
          } else {
            // Remove item if quantity is 1
            set((state) => ({
              cart: state.cart.filter((item) => item.id !== sweetId),
            }));
             toast({ title: "Item removed", description: `${existingItem.name} has been removed from your cart.` });
          }
        }
      },
      removeFromCart: (sweetId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== sweetId),
        }));
      },
      updateQuantity: (sweetId, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === sweetId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => {
        set({ cart: [] });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
