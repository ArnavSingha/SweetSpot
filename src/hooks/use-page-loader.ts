'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function usePageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // We are listening for changes in the path or search params.
    // When a change is detected, we assume navigation has started.
    // In a real app, you might want more sophisticated logic,
    // perhaps using Suspense boundaries.
    // For now, we'll just set loading to false to "end" the loading state.
    // The "start" will be triggered by link clicks.
    setIsLoading(false);
  }, [pathname, searchParams]);


  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const anchor = target.closest('a');
        if (anchor) {
            const href = anchor.getAttribute('href');
            const currentPath = window.location.pathname + window.location.search;

            // Only show loader for internal navigation, not for external links or anchor links on the same page
            if (href && href.startsWith('/') && href !== currentPath) {
                setIsLoading(true);
            }
        }
    };
    
    // Listen for form submits as well
    const handleFormSubmit = (event: Event) => {
        const target = event.target as HTMLElement;
        // Don't show loader for forms inside a dialog
        if (target.closest('[role="dialog"]')) {
            return;
        }
        setIsLoading(true);
    }

    document.addEventListener('click', handleAnchorClick);
    document.addEventListener('submit', handleFormSubmit);

    return () => {
        document.removeEventListener('click', handleAnchorClick);
        document.removeEventListener('submit', handleFormSubmit);
    };
  }, []);

  return { isLoading };
}
