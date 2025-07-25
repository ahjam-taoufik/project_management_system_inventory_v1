import { router } from '@inertiajs/react';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { Transporteur } from '@/types';

interface TransporteurDropDownProps {
  transporteur: Transporteur;
  onEdit: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TransporteurDropDown({ transporteur, onEdit, open, onOpenChange }: TransporteurDropDownProps) {
  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce transporteur ?')) {
      router.delete(route('transporteurs.destroy', transporteur.id));
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Ouvrir le menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
