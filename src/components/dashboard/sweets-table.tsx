'use client';

import Image from 'next/image';
import type { Sweet } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { SweetDialog } from './sweet-dialog';
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

function DeleteAction({ sweetId }: { sweetId: string }) {
  const { toast } = useToast();
  
  const handleDelete = async () => {
    const result = await deleteSweet(sweetId);
    if(result.success) {
      toast({ title: "Success", description: "Sweet deleted successfully." });
    } else {
      toast({ title: "Error", description: result.error, variant: 'destructive' });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors hover:bg-destructive/10 w-full">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the sweet
            from your inventory.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function SweetsTable({ sweets }: { sweets: Sweet[] }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
              Image
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sweets.map((sweet) => (
            <TableRow key={sweet.id}>
              <TableCell className="hidden sm:table-cell">
                <Image
                  alt={sweet.name}
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  src={sweet.imageUrl}
                  width="64"
                />
              </TableCell>
              <TableCell className="font-medium">{sweet.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{sweet.category}</Badge>
              </TableCell>
              <TableCell>${sweet.price.toFixed(2)}</TableCell>
              <TableCell>{sweet.quantity}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <SweetDialog sweet={sweet}>
                       <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                       </DropdownMenuItem>
                    </SweetDialog>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                       <DeleteAction sweetId={sweet.id} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
