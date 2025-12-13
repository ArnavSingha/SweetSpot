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
import { ShoppingCart } from 'lucide-react';

type SweetCardProps = {
  sweet: Sweet;
};

export default function SweetCard({ sweet }: SweetCardProps) {
  const { addToCart } = useCartStore();
  const isOutOfStock = sweet.quantity <= 0;

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
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
            ${sweet.price.toFixed(2)}
          </p>
          <Button
            onClick={() => addToCart(sweet)}
            disabled={isOutOfStock}
            size="sm"
            aria-label={`Add ${sweet.name} to cart`}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
