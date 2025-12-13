'use server';

import { suggestRelatedSweets } from '@/ai/flows/suggest-related-sweets';
import { getAllSweets, getSweetById } from '../data';

type SuggestionResult = {
  suggestions?: { id: string; name: string }[];
  error?: string;
};

export async function getSuggestedSweets(
  cartItemNames: string[]
): Promise<SuggestionResult> {
  try {
    const allSweets = await getAllSweets();
    const inventory = allSweets.map((s) => s.name);

    const result = await suggestRelatedSweets({
      cartItems: cartItemNames,
      inventory,
    });

    const suggestionsWithDetails = result.suggestions
      .map((name) => {
        const sweet = allSweets.find((s) => s.name === name);
        return sweet ? { id: sweet.id, name: sweet.name } : null;
      })
      .filter((s): s is { id: string; name: string } => s !== null);

    return { suggestions: suggestionsWithDetails };
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    return { error: 'Failed to get suggestions.' };
  }
}
