import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export function Pagination({ links }: PaginationProps) {
  const { first, last, prev, next } = links;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          asChild
          disabled={!prev}
        >
          <Link href={prev || '#'}>
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
          disabled={!next}
        >
          <Link href={next || '#'}>
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
