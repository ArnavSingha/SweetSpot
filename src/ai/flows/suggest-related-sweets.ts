'use server';
/**
 * @fileOverview Provides sweet suggestions based on the items in the user's cart.
 *
 * - suggestRelatedSweets - A function that suggests related sweets.
 * - SuggestRelatedSweetsInput - The input type for the suggestRelatedSweets function.
 * - SuggestRelatedSweetsOutput - The return type for the suggestRelatedSweets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelatedSweetsInputSchema = z.object({
  cartItems: z
    .array(z.string())
    .describe('Array of sweet names currently in the cart.'),
  searchHistory: z
    .array(z.string())
    .optional()
    .describe('Optional array of sweet names from the user search history.'),
  inventory: z
    .array(z.string())
    .describe('Array of available sweet names in the inventory.'),
});
export type SuggestRelatedSweetsInput = z.infer<
  typeof SuggestRelatedSweetsInputSchema
>;

const SuggestRelatedSweetsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('Array of suggested sweet names related to the cart items.'),
});
export type SuggestRelatedSweetsOutput = z.infer<
  typeof SuggestRelatedSweetsOutputSchema
>;

export async function suggestRelatedSweets(
  input: SuggestRelatedSweetsInput
): Promise<SuggestRelatedSweetsOutput> {
  return suggestRelatedSweetsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelatedSweetsPrompt',
  input: {schema: SuggestRelatedSweetsInputSchema},
  output: {schema: SuggestRelatedSweetsOutputSchema},
  prompt: `You are a sweet treat expert. Given the current items in the user's cart, suggest other sweets that they might enjoy.

Cart Items: {{cartItems}}

{% if searchHistory %}
Search History: {{searchHistory}}
{% endif %}

Consider also the following sweets currently available in the inventory:
{{inventory}}

Suggest sweets that complement the items in the cart, considering flavor profiles, categories, and common pairings. Only suggest sweets that are in the inventory. Return the suggestions as a list of sweet names.
`,
});

const suggestRelatedSweetsFlow = ai.defineFlow(
  {
    name: 'suggestRelatedSweetsFlow',
    inputSchema: SuggestRelatedSweetsInputSchema,
    outputSchema: SuggestRelatedSweetsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
