"use client";

import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Product } from "@/pages/ville/config/columns";

import { FaRegEdit } from "react-icons/fa";
import { MdContentCopy, MdOutlineDelete } from "react-icons/md";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useForm, router } from "@inertiajs/react";
import toast from "react-hot-toast";
import ProductDialogEdit from "@/pages/ville/components/VilleEditDialogEdit";
import { usePermissions } from '@/hooks/use-permissions';

type MenuItem =
  | {
      icon: React.ReactElement;
      label: string;
      className: string;
      separator?: false | undefined;
      id?: string | undefined;
    }
  | {
      separator: true;
      icon?: undefined;
      label?: undefined;
      className?: undefined;
    };

export default function ProductDropDown({ row }: { row: Row<Product> }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { delete: destroy , post} = useForm();
  const { can } = usePermissions();

  function handleEdit() {
    // Fermer le dropdown avant d'ouvrir le dialog
    setIsDropdownOpen(false);

    // Petit délai pour permettre au dropdown de se fermer complètement
    setTimeout(() => {
      setIsEditDialogOpen(true);
    }, 100);
  }

  async function handleDelete() {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette ville ?')) {
      destroy(route('villes.destroy', { ville: row.original.id }), {
        onSuccess: () => {
          toast.success('Ville supprimée avec succès');
        },
        onError: () => {
          toast.error('Erreur lors de la suppression de la ville');
        },
        preserveScroll: true,
      });
    }
  }
   async function handleCopy() {
     if (confirm('Êtes-vous sûr de vouloir faire une copie de cette ville ?')) {
      const originalName = row.original.nameVille;
      const copiedName = `${originalName} - Copy`;

    router.post(route('villes.store'), {
      nameVille: copiedName
    }, {
      onSuccess: () => {
        toast.success('Ville copiée avec succès');
      },
      onError: () => {
        toast.error('Erreur lors de la copie de la ville');
      },
      preserveScroll: true,
    });
  }
}


  function handleClickedItem(item: MenuItem) {
    if (item.label === "Delete") {
      setIsDropdownOpen(false);
      setTimeout(() => {
        handleDelete();
      }, 100);
    }

     if (item.label === "Copy") {
      setIsDropdownOpen(false);
      setTimeout(() => {
        handleCopy();
      }, 100);
    }


    if (item.label === "Edit") {
      handleEdit();
    }
  }

  // Construire le menu en fonction des permissions
  const menuItems: MenuItem[] = [
    // Copy - nécessite villes.create pour créer une copie
    ...(can('villes.create') ? [{ icon: <MdContentCopy />, label: "Copy", className: "" }] : []),
    // Edit - nécessite villes.edit
    ...(can('villes.edit') ? [{ icon: <FaRegEdit />, label: "Edit", className: "" }] : []),
    // Séparateur seulement si on a des actions ET une action de suppression
    ...(((can('villes.create') || can('villes.edit')) && can('villes.delete')) ? [{ separator: true } as const] : []),
    // Delete - nécessite villes.delete
    ...(can('villes.delete') ? [{ icon: <MdOutlineDelete className="text-lg" />, label: "Delete", className: "text-red-600" }] : [])
  ];

  // Si aucune action n'est disponible, ne pas afficher le dropdown
  if (menuItems.length === 0) {
    return null;
  }

  return (
    <div>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="poppins">
          {menuItems.map((item, index) =>
            item.separator ? (
              <DropdownMenuSeparator key={index} />
            ) : (
              <DropdownMenuItem
                key={index}
                className={`flex items-center gap-1 p-[10px] ${item.className}`}
                onClick={() => handleClickedItem(item)}
                onSelect={(e) => {
                  // Empêcher la fermeture automatique pour Edit
                  if (item.label === "Edit") {
                    e.preventDefault();
                  }
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog d'édition séparé */}
      <ProductDialogEdit
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        product={row.original}
      />
    </div>
  );
}

















