import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/server/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, GaugeCircle } from 'lucide-react';
import MobileNav from '@/components/MobileNav';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getSessionUser();

  if (user?.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <GaugeCircle className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-bold font-headline whitespace-nowrap">Admin Dashboard</h1>
          </Link>
        </nav>
        
        <MobileNav>
          <Link
            href="/admin"
            className="text-foreground transition-colors hover:text-foreground text-lg font-bold font-headline"
          >
            Admin Dashboard
          </Link>
           <Button variant="outline" asChild>
              <Link href="/"><Home className="mr-2 h-4 w-4"/> Back to Store</Link>
          </Button>
        </MobileNav>

        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div className="ml-auto flex-1 sm:flex-initial hidden md:block">
                 <Button variant="outline" asChild>
                    <Link href="/"><Home className="mr-2 h-4 w-4"/> Back to Store</Link>
                </Button>
            </div>
        </div>
      </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
    </div>
  );
}
