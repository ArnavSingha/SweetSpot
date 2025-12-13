'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/hooks/use-cart';
import { getSuggestedSweets } from '@/lib/actions/ai';
import { Button } from './ui/button';
import { Wand2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export default function SuggestedSweets() {
  const { cart, addToCart } = useCartStore();
  const [suggestions, setSuggestions] = useState<
    { id: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSuggestions() {
      if (cart.length > 0) {
        setLoading(true);
        try {
          const cartItemNames = cart.map((item) => item.name);
          const result = await getSuggestedSweets(cartItemNames);
          if (result.suggestions) {
            setSuggestions(result.suggestions);
          }
        } catch (error) {
          console.error('Failed to fetch sweet suggestions:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }
    
    // Debounce the call to avoid excessive API calls
    const handler = setTimeout(() => {
        fetchSuggestions();
    }, 500);

    return () => {
        clearTimeout(handler);
    }

  }, [cart]);

  if (cart.length === 0) return null;

  return (
    <div className="my-4">
      <h4 className="flex items-center text-sm font-semibold mb-2">
        <Wand2 className="h-4 w-4 mr-2" />
        You might also like
      </h4>
      {loading ? (
        <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
        </div>
      ) : suggestions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion.id}
              variant="outline"
              size="sm"
              onClick={() => addToCart({ id: suggestion.id } as any)} // A bit of a hack, addToCart expects a full Sweet
            >
              {suggestion.name}
            </Button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">No suggestions right now.</p>
      )}
    </div>
  );
}
