import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LivreurDialog from './LivreurDialog';
import { createColumns } from '../config/columns';
import LivreurTable from './LivreurTable';
import type { Livreur } from '@/types';
import PaginationSelection, { PaginationType } from './PaginationSelection';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import { BiFirstPage, BiLastPage } from 'react-icons/bi';

interface AppTableProps {
  livreurs: Livreur[];
  meta: any;
  links: any;
}

function AppTable({ livreurs, meta, links }: AppTableProps) {
  const columns = createColumns();

  const [pagination, setPagination] = useState<PaginationType>({
    pageIndex: 0,
    pageSize: 8,
  });

  useEffect(() => {
    // Raccourci clavier pour ajouter un livreur
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        document.getElementById('add-livreur-button')?.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!meta || !links) {
    return <div className="p-4 text-center text-muted-foreground">Chargement...</div>;
  }

  // Pagination locale sur les données reçues
  const start = pagination.pageIndex * pagination.pageSize;
  const end = start + pagination.pageSize;
  const paginatedLivreurs = livreurs.slice(start, pagination.pageSize === 999999 ? livreurs.length : end);
  const pageCount = Math.ceil(livreurs.length / (pagination.pageSize === 999999 ? livreurs.length : pagination.pageSize));

  return (
    <Card className="mt-6 md:mt-12 flex flex-col shadow-none poppins border-none w-full max-w-full overflow-x-auto">
      <CardHeader className="flex justify-between p-2 md:p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
          <div>
            <CardTitle className="font-bold text-lg sm:text-xl md:text-2xl">Livreurs</CardTitle>
            <p className="text-muted-foreground text-sm md:text-base">
              {meta?.total ?? 0} {meta?.total > 1 ? 'Livreurs' : 'Livreur'}
            </p>
          </div>
          <div className="w-full md:w-auto">
            <LivreurDialog triggerId="add-livreur-button" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-1 sm:p-2 md:p-4 w-full overflow-x-auto">
        <div className="min-w-[300px]">
          <LivreurTable data={paginatedLivreurs} columns={columns} meta={meta} links={links} />
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <PaginationSelection
            pagination={pagination}
            setPagination={setPagination}
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPagination((prev) => ({ ...prev, pageIndex: 0 }))}
              disabled={pagination.pageIndex === 0}
            >
              <BiFirstPage />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPagination((prev) => ({ ...prev, pageIndex: Math.max(0, prev.pageIndex - 1) }))}
              disabled={pagination.pageIndex === 0}
            >
              <GrFormPrevious />
            </Button>
            <span>
              Page {pagination.pageIndex + 1} sur {pageCount}
            </span>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPagination((prev) => ({ ...prev, pageIndex: Math.min(pageCount - 1, prev.pageIndex + 1) }))}
              disabled={pagination.pageIndex >= pageCount - 1}
            >
              <GrFormNext />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPagination((prev) => ({ ...prev, pageIndex: pageCount - 1 }))}
              disabled={pagination.pageIndex >= pageCount - 1}
            >
              <BiLastPage />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AppTable;
