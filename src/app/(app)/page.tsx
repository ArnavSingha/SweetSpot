import SweetCard from '@/components/sweet-card';
import { getAllSweets, getSweetCategories } from '@/lib/data';
import type { Sweet } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Suspense } from 'react';

function SweetsGrid({ sweets }: { sweets: Sweet[] }) {
  if (sweets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
        <h3 className="text-xl font-bold tracking-tight text-muted-foreground">
          No sweets found
        </h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sweets.map((sweet) => (
        <SweetCard key={sweet.id} sweet={sweet} />
      ))}
    </div>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = (searchParams?.query as string) || '';
  const category = (searchParams?.category as string) || 'all';

  const sweets = await getAllSweets({ query, category });
  const categories = await getSweetCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Welcome to SweetSpot
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Discover a world of delightful treats.
        </p>
      </header>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for sweets..."
            className="w-full pl-10"
            defaultValue={query}
            name="query"
            form="search-form"
          />
        </div>
        <Select defaultValue={category} name="category" form="search-form">
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
        <form id="search-form" className="hidden">
           <button type="submit">Submit</button>
        </form>
      </div>
      <Suspense fallback={<p>Loading sweets...</p>}>
        <SweetsGrid sweets={sweets} />
      </Suspense>
    </div>
  );
}

// This forces the page to be dynamic, re-evaluating searchParams on each request.
export const dynamic = 'force-dynamic';
