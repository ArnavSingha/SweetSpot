'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Sweet } from '@/lib/types';
import { toast } from './use-toast';
import { getSessionUserAction } from '@/lib/actions/auth';

type CartState = {
  cart: CartItem[];
  addToCart: (sweet: Sweet) => void;
  removeFromCart: (sweetId: string) => void;
  updateQuantity: (sweetId: string, quantity: number) => void;
  decrementQuantity: (sweetId: string) => void;
  clearCart: () => void;
  _rehydrated: boolean;
  setRehydrated: (rehydrated: boolean) => void;
};

let userId: string | null = null;
let guestId = 'guest';

// Function to get the current user ID. This is a bit of a hack for the middleware.
async function getUserId() {
  const user = await getSessionUserAction();
  return user ? user.id : null;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      _rehydrated: false,
      setRehydrated: (rehydrated) => set({ _rehydrated: rehydrated }),
      addToCart: (sweet) => {
        getUserId().then(id => {
          if (id) { // Check if user is admin
            getSessionUserAction().then(user => {
              if (user?.role === 'admin') {
                toast({ title: "Admins cannot shop", description: "You are logged in as an admin.", variant: "destructive" });
                return;
              }
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
            });
          } else {
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
          }
        });
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
      name: `cart-storage-${userId || guestId}`, // Dynamic storage name
      onRehydrateStorage: () => (state) => {
        if (state) state.setRehydrated(true);
      },
    }
  )
);

// This function will be called from a client component to update the user context for the store
export function setUserId(newUserId: string | null) {
  userId = newUserId;
  // This is the key part: we update the storage key in the config
  // @ts-ignore - Private API
  useCartStore.persist.setOptions({
    name: `cart-storage-${userId || guestId}`,
  });
  // Force rehydration from the new storage location
  useCartStore.persist.rehydrate();
}
