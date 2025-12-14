'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SearchControlsProps = {
  categories: string[];
  initialQuery: string;
  initialCategory: string;
  initialSort: string;
};

export default function SearchControls({
  categories,
  initialQuery,
  initialCategory,
  initialSort,
}: SearchControlsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category && category !== 'all') {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    if (sort && sort !== 'default') {
      params.set('sort', sort);
    } else {
      params.delete('sort');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for sweets..."
          className="w-full pl-10"
          defaultValue={initialQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <Select
          defaultValue={initialCategory}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue={initialSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="lth">Price: Low to High</SelectItem>
            <SelectItem value="htl">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
