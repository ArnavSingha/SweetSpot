'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { restockSchema } from '@/lib/validation/sweetSchemas';
import type { Sweet } from '@/lib/types';
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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { restockSweetAction } from '@/lib/actions/inventory';

type RestockFormProps = {
  sweet: Sweet;
  onSuccess?: () => void;
};

type RestockFormValues = z.infer<typeof restockSchema>;

export default function RestockForm({ sweet, onSuccess }: RestockFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<RestockFormValues>({
    resolver: zodResolver(restockSchema),
    defaultValues: {
      sweetId: sweet.id,
      quantity: 10,
    },
  });

  const onSubmit = (values: RestockFormValues) => {
    startTransition(async () => {
       const formData = new FormData();
       formData.append('sweetId', values.sweetId);
       formData.append('quantity', String(values.quantity));

      const result = await restockSweetAction(formData);

      if (result.success) {
        toast({
          title: 'Restock Successful',
          description: `${sweet.name} has been restocked.`,
        });
        router.refresh();
        onSuccess?.();
      } else {
        toast({
          title: 'Restock Failed',
          description: result.error || 'An unknown error occurred.',
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
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity to Add</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter quantity" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Restocking...' : 'Restock Sweet'}
        </Button>
      </form>
    </Form>
  );
}
