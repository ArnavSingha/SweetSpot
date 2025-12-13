'use client';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import { type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="grid gap-6 text-lg font-medium">
          {/* We can use SheetClose to automatically close the sheet when a link is clicked */}
          {/* We can map over the children and wrap them in SheetClose */}
          {/* This is a bit of a hack, but it works */}
          {Array.isArray(children) ? (
            children.map((child, i) => (
              <SheetClose asChild key={i}>
                {child}
              </SheetClose>
            ))
          ) : (
            <SheetClose asChild>{children}</SheetClose>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
