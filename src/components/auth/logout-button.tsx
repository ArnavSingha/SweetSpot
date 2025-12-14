'use client';

import { useTransition } from 'react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { logout } from '@/lib/actions/auth';
import { useCartStore } from '@/hooks/use-cart';

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const { clearCart } = useCartStore();

  const handleLogout = () => {
    startTransition(async () => {
      clearCart();
      await logout();
    });
  };

  return (
    <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
      <LogOut className="mr-2 h-4 w-4" />
      <span>{isPending ? 'Logging out...' : 'Log out'}</span>
    </DropdownMenuItem>
  );
}
