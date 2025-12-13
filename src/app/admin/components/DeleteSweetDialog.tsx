'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteSweet } from '@/lib/actions/sweets';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

type DeleteSweetDialogProps = {
  sweetId: string;
  sweetName: string;
  children: ReactNode;
};

export function DeleteSweetDialog({ sweetId, sweetName, children }: DeleteSweetDialogProps) {
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    const result = await deleteSweet(sweetId);
    if (result.success) {
      toast({ title: 'Success', description: `${sweetName} deleted successfully.` });
      router.refresh();
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to delete sweet.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{' '}
            <span className="font-semibold">{sweetName}</span> from your
            inventory.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
