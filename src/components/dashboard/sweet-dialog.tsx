'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Sweet } from '@/lib/types';
import { createSweet, updateSweet } from '@/lib/actions/sweets';
import { useToast } from '@/hooks/use-toast';
import { type ReactNode, useState, useTransition } from 'react';

type SweetDialogProps = {
  sweet?: Sweet;
  children: ReactNode;
};

export function SweetDialog({ sweet, children }: SweetDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const isEditMode = !!sweet;

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const action = isEditMode
        ? updateSweet.bind(null, sweet.id)
        : createSweet;
      const result = await action(formData);

      if (result.success) {
        toast({
          title: 'Success!',
          description: `Sweet ${
            isEditMode ? 'updated' : 'created'
          } successfully.`,
        });
        setOpen(false);
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Something went wrong.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Sweet' : 'Add New Sweet'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Make changes to your sweet here. Click save when you are done.'
              : 'Add a new sweet to your inventory. Click save when you are done.'}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" defaultValue={sweet?.name} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Input id="category" name="category" defaultValue={sweet?.category} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price</Label>
              <Input id="price" name="price" type="number" step="0.01" defaultValue={sweet?.price} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" defaultValue={sweet?.quantity} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
              <Input id="imageUrl" name="imageUrl" defaultValue={sweet?.imageUrl} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
