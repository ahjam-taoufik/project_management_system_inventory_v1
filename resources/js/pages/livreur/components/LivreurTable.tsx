import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Livreur } from '@/types';
import LivreurDropDown from './LivreurDropDown';

interface LivreurTableProps {
  data: Livreur[];
  columns: Array<{ id: keyof Livreur; header: string; cell?: (livreur: Livreur) => React.ReactNode }>;
  meta: any;
  links: any;
}

function LivreurTable({ data, columns, meta, links }: LivreurTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.id}>{col.header}</TableHead>
          ))}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length ? data.map((livreur) => (
          <TableRow key={livreur.id}>
            {columns.map((col) => (
              <TableCell key={col.id}>{col.cell ? col.cell(livreur) : livreur[col.id]}</TableCell>
            ))}
            <TableCell><LivreurDropDown livreur={livreur} /></TableCell>
          </TableRow>
        )) : (
          <TableRow>
            <TableCell colSpan={columns.length + 1} className="text-center">Aucun livreur trouvé.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default LivreurTable;
