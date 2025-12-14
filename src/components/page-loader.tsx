'use client';

import { usePageLoader } from '@/hooks/use-page-loader';
import { Loader } from './loader';

export function PageLoader() {
  const { isLoading } = usePageLoader();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <Loader />
    </div>
  );
}
