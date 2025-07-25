import { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { TransporteurDropDown } from './TransporteurDropDown';
import { TransporteurEditDialog } from './TransporteurEditDialog';
import type { Transporteur } from '@/types';

interface TransporteurTableRowProps {
  transporteur: Transporteur;
}

export function TransporteurTableRow({ transporteur }: TransporteurTableRowProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <TableRow>
      <TableCell>{transporteur.conducteur_name}</TableCell>
      <TableCell>{transporteur.vehicule_matricule}</TableCell>
      <TableCell>{transporteur.conducteur_cin}</TableCell>
      <TableCell>{transporteur.conducteur_telephone}</TableCell>
      <TableCell>{transporteur.vehicule_type}</TableCell>
      <TableCell>
        <TransporteurDropDown
          transporteur={transporteur}
          onEdit={() => setIsEditDialogOpen(true)}
        />
        <TransporteurEditDialog
          transporteur={transporteur}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      </TableCell>
    </TableRow>
  );
}
