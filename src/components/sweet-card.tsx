'use client';

import Image from 'next/image';
import type { Sweet } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/hooks/use-cart';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useSessionUser } from '@/hooks/use-session-user';

type SweetCardProps = {
  sweet: Sweet;
};

export default function SweetCard({ sweet }: SweetCardProps) {
  const { cart, addToCart, updateQuantity, decrementQuantity } = useCartStore();
  const { user } = useSessionUser();
  const isOutOfStock = sweet.quantity <= 0;
  const isAdmin = user?.role === 'admin';

  const cartItem = cart.find((item) => item.id === sweet.id);

  const handleAddToCart = () => {
    if (isAdmin) return;
    addToCart(sweet);
  };
  
  const handleDecrement = () => {
    if (isAdmin) return;
    decrementQuantity(sweet.id);
  }

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={sweet.imageUrl}
            alt={sweet.name}
            fill
            className="object-cover"
            data-ai-hint={sweet.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="mb-2 text-lg font-bold font-headline leading-tight">
          {sweet.name}
        </CardTitle>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Badge variant="outline">{sweet.category}</Badge>
          {isOutOfStock ? (
            <Badge variant="destructive">Out of Stock</Badge>
          ) : (
            <p>
              <span className="font-semibold">{sweet.quantity}</span> left
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-primary-foreground/80 bg-primary/80 px-2 py-1 rounded-md">
            Rs.{sweet.price.toFixed(2)}
          </p>
          {cartItem ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={handleDecrement}
                disabled={isAdmin}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold text-lg w-4 text-center">{cartItem.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={handleAddToCart}
                disabled={cartItem.quantity >= sweet.quantity || isAdmin}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdmin}
              size="sm"
              aria-label={`Add ${sweet.name} to cart`}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
