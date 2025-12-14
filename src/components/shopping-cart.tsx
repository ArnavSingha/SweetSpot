'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/hooks/use-cart';
import { ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useTransition } from 'react';
import SuggestedSweets from './suggested-sweets';
import { purchaseSweetsAction } from '@/lib/actions/inventory';
import { useToast } from '@/hooks/use-toast';
import { useSessionUser } from '@/hooks/use-session-user';
import Link from 'next/link';

function CartItem({ item }: { item: import('@/lib/types').CartItem }) {
  const { removeFromCart, updateQuantity } = useCartStore();

  return (
    <div className="flex items-start gap-4 py-4">
      <Image
        src={item.imageUrl}
        alt={item.name}
        width={64}
        height={64}
        className="rounded-md object-cover"
      />
      <div className="flex-1">
        <h4 className="font-semibold">{item.name}</h4>
        <p className="text-sm text-muted-foreground">Rs.{item.price.toFixed(2)}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span>{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => removeFromCart(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ShoppingCartButton() {
  const { cart, clearCart } = useCartStore();
  const { user } = useSessionUser();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const handleCheckout = async () => {
    startTransition(async () => {
      const result = await purchaseSweetsAction(cart);
      if (result.success) {
        toast({
          title: 'Checkout Successful',
          description: 'Your order has been placed.',
        });
        clearCart();
      } else {
        toast({
          title: 'Checkout Failed',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge
              variant="default"
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        {cart.length > 0 ? (
          <>
            <ScrollArea className="flex-1 -mx-6">
              <div className="px-6">
                {cart.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <SuggestedSweets />
            <SheetFooter className="mt-auto">
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between font-semibold">
                  <p>Subtotal</p>
                  <p>Rs.{subtotal.toFixed(2)}</p>
                </div>
                {user ? (
                   <Button className="w-full" onClick={handleCheckout} disabled={isPending}>
                     {isPending ? 'Processing...' : 'Checkout'}
                   </Button>
                ): (
                  <Button className="w-full" asChild>
                    <Link href="/login">Login to Checkout</Link>
                  </Button>
                )}
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground">
              Add some sweets to get started!
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
