import { useForm } from '@inertiajs/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import LivreurEditDialog from './LivreurEditDialog';
import type { Livreur } from '@/types';
import { useState } from 'react';

interface Props {
  livreur: Livreur;
}

function LivreurDropDown({ livreur }: Props) {
  const { delete: destroy, processing } = useForm();
  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  function handleDelete() {
    if (confirm('Supprimer ce livreur ?')) {
      destroy(`/livreurs/${livreur.id}`, {
        onSuccess: () => setOpen(false),
      });
    }
  }

  function handleEditClick() {
    setOpen(false);
    setEditDialogOpen(true);
  }

  function handleEditClose() {
    setEditDialogOpen(false);
  }

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon"><MoreVertical size={16} /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleEditClick}>
            Éditer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} disabled={processing} className="text-red-600">
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LivreurEditDialog
        livreur={livreur}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onClose={handleEditClose}
      />
    </>
  );
}

export default LivreurDropDown;
