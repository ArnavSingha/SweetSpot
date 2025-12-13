import { getAllSweets } from '@/lib/data';
import AdminSweetCard from './components/AdminSweetCard';
import { SweetDialog } from './components/SweetDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import SweetForm from './components/SweetForm';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const sweets = await getAllSweets();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Sweets Management
          </h2>
          <p className="text-muted-foreground">
            Add, edit, and manage your sweet inventory.
          </p>
        </div>
        <SweetDialog
          title="Add New Sweet"
          description="Fill out the form to add a new sweet to the inventory."
          trigger={<Button><PlusCircle />Add New Sweet</Button>}
        >
          <SweetForm mode="create" />
        </SweetDialog>
      </div>

      {sweets.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sweets.map((sweet) => (
            <AdminSweetCard key={sweet.id} sweet={sweet} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center h-[400px]">
          <h3 className="text-xl font-bold tracking-tight text-muted-foreground">
            No sweets in inventory
          </h3>
          <p className="text-muted-foreground">
            Click &quot;Add New Sweet&quot; to get started.
          </p>
        </div>
      )}
    </div>
  );
}
