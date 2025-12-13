'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import {
  createSweetSchema,
  updateSweetSchema,
} from '@/lib/validation/sweetSchemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Sweet } from '@/lib/types';
import { createSweet, updateSweet } from '@/lib/actions/sweets';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

type SweetFormProps = {
  mode: 'create' | 'update';
  sweet?: Sweet;
  onSuccess?: () => void;
};

type SweetFormValues = z.infer<
  typeof createSweetSchema | typeof updateSweetSchema
>;

export default function SweetForm({ mode, sweet, onSuccess }: SweetFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const formSchema = mode === 'create' ? createSweetSchema : updateSweetSchema;

  const form = useForm<SweetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:
      mode === 'update' && sweet
        ? {
            name: sweet.name,
            category: sweet.category,
            price: sweet.price,
            quantity: sweet.quantity,
            imageUrl: sweet.imageUrl,
          }
        : {
            name: '',
            category: '',
            price: 0.01,
            quantity: 0,
            imageUrl: '',
          },
  });

  const onSubmit = (values: SweetFormValues) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (value !== undefined) {
             formData.append(key, String(value));
          }
        });

        const result =
          mode === 'create'
            ? await createSweet(formData)
            : await updateSweet(sweet!.id, formData);

        if (result.success) {
          toast({
            title: `Sweet ${mode === 'create' ? 'created' : 'updated'}`,
            description: `${(values as any).name} has been successfully saved.`,
          });
          router.refresh();
          onSuccess?.();
        } else {
          // Handle server-side validation errors
          if (result.issues) {
            Object.entries(result.issues).forEach(([key, value]) => {
                if (value) {
                    form.setError(key as keyof SweetFormValues, {
                        type: 'server',
                        message: value.join(', '),
                    });
                }
            });
          }
           toast({
            title: 'An error occurred',
            description: result.error || 'Something went wrong.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'An unexpected error occurred',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sweet Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Chocolate Lava Cake" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Cake, Cookie, Pastry" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending
            ? 'Saving...'
            : mode === 'create'
            ? 'Create Sweet'
            : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
