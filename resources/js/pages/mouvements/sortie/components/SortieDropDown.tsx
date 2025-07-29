"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye, FileText } from "lucide-react";
import { Sortie } from "../types";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { useState } from "react";
import SortieEditDialog from "./SortieEditDialog";

interface SortieDropDownProps {
  row: Row<Sortie>;
}

export default function SortieDropDown({ row }: SortieDropDownProps) {
  const sortie = row.original;
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette sortie ?")) {
      router.delete(route('sorties.destroy', sortie.id), {
        onSuccess: () => {
          toast.success("Sortie supprimée avec succès");
        },
        onError: () => {
          toast.error("Erreur lors de la suppression");
        },
      });
    }
  };

  const handleView = () => {
    router.get(route('sorties.show', sortie.id));
  };

  const handlePrint = () => {
    // Logique pour imprimer le bon de livraison
    window.print();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Ouvrir le menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleView}>
            <Eye className="mr-2 h-4 w-4" />
            Voir les détails
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrint}>
            <FileText className="mr-2 h-4 w-4" />
            Imprimer BL
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showEditDialog && (
        <SortieEditDialog
          sortie={sortie}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}
    </>
  );
}