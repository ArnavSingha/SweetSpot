import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/server/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getSessionUser();

  if (user?.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div>
        <div className="border-b">
            <div className="container flex h-16 items-center justify-between">
                <h1 className="text-xl font-bold font-headline">Admin Dashboard</h1>
                 <Button variant="outline" asChild>
                    <Link href="/"><Home className="mr-2 h-4 w-4"/> Back to Store</Link>
                </Button>
            </div>
        </div>
        <div className="container py-8">{children}</div>
    </div>
  );
}
