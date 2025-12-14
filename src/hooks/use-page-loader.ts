'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function usePageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // This effect runs whenever the URL changes.
    // If the loader is active, this means navigation has completed,
    // so we turn the loader off.
    if (isLoading) {
      setIsLoading(false);
    }
    // We only want this to run when the path or params change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    

    document.addEventListener('click', handleAnchorClick);


    // This is a failsafe. If the loader is stuck for any reason,
    // this will turn it off when the user navigates back/forward.
    const handlePopState = () => {
      setIsLoading(false);
    };
    window.addEventListener('popstate', handlePopState);


    return () => {
        document.removeEventListener('click', handleAnchorClick);
        window.removeEventListener('popstate', handlePopState);
    };
  }, [isLoading]); // Re-run if isLoading changes to detach/re-attach listeners if needed

  return { isLoading };
}
