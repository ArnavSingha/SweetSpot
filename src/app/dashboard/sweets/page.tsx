import { getAllSweets } from '@/lib/data';
import { SweetsTable } from '@/components/dashboard/sweets-table';
import { SweetDialog } from '@/components/dashboard/sweet-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SweetsDashboardPage() {
  const sweets = await getAllSweets();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-2xl font-bold">Sweets Inventory</h2>
            <p className="text-muted-foreground">Manage your products here.</p>
        </div>
        <SweetDialog>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Sweet
            </Button>
        </SweetDialog>
      </div>
      <SweetsTable sweets={sweets} />
    </div>
  );
}
