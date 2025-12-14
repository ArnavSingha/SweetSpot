import { Logo } from './icons';
import { cn } from '@/lib/utils';

export function Loader({ className }: { className?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Logo
        className={cn(
          'h-16 w-16 animate-pulse fill-primary',
          className
        )}
      />
      <p className="font-headline text-lg font-semibold text-primary">
        Loading sweets...
      </p>
    </div>
  );
}
