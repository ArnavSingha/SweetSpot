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
import Image from 'next/image';
import { Edit, PackagePlus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SweetDialog } from './SweetDialog';
import SweetForm from './SweetForm';
import RestockForm from './RestockForm';
import { DeleteSweetDialog } from './DeleteSweetDialog';

export default function AdminSweetCard({ sweet }: { sweet: Sweet }) {
  const isLowStock = sweet.quantity <= 5;

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={sweet.imageUrl}
            alt={sweet.name}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="mb-2 text-lg font-bold font-headline leading-tight">
          {sweet.name}
        </CardTitle>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Badge variant="outline">{sweet.category}</Badge>
          <p
            className={cn(
              'text-sm font-semibold',
              isLowStock ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            <span className="font-bold">{sweet.quantity}</span> in stock
          </p>
        </div>
        <p className="mt-2 text-lg font-semibold text-primary">
          Rs.{sweet.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-2 pt-0 border-t">
        <div className="flex w-full items-center justify-between gap-1">
          <SweetDialog
            title="Edit Sweet"
            description="Make changes to the sweet details."
            trigger={<Button variant="ghost" size="sm"><Edit className="mr-2" />Edit</Button>}
          >
            <SweetForm mode="update" sweet={sweet} />
          </SweetDialog>

          <SweetDialog
            title="Restock Sweet"
            description={`Current quantity for ${sweet.name}: ${sweet.quantity}`}
            trigger={<Button variant="ghost" size="sm"><PackagePlus className="mr-2" />Restock</Button>}
          >
            <RestockForm sweet={sweet} />
          </SweetDialog>

          <DeleteSweetDialog sweetId={sweet.id} sweetName={sweet.name}>
             <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="mr-2" />Delete
             </Button>
          </DeleteSweetDialog>

        </div>
      </CardFooter>
    </Card>
  );
}
