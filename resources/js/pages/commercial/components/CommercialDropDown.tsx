"use client";

import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Commercial } from "@/pages/commercial/config/columns";

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
import CommercialDialogEdit from "@/pages/commercial/components/CommercialEditDialog";
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

export default function CommercialDropDown({ row }: { row: Row<Commercial> }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { delete: destroy } = useForm();
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
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commercial ?')) {
      destroy(route('commerciaux.destroy', { commercial: row.original.id }), {
        onSuccess: () => {
          toast.success('Commercial supprimé avec succès');
        },
        onError: () => {
          toast.error('Erreur lors de la suppression du commercial');
        },
        preserveScroll: true,
      });
    }
  }

  async function handleCopy() {
    if (confirm('Êtes-vous sûr de vouloir faire une copie de ce commercial ?')) {
      const originalCode = row.original.commercial_code;
      const originalName = row.original.commercial_fullName;
      const originalPhone = row.original.commercial_telephone;

      const copiedCode = `${originalCode}-Copy`;
      const copiedName = `${originalName} - Copy`;

      // Générer un numéro de téléphone unique en modifiant le dernier chiffre
      const generateUniquePhone = (phone: string): string => {
        const lastDigit = parseInt(phone.slice(-1));
        const newLastDigit = lastDigit === 9 ? 0 : lastDigit + 1;
        return phone.slice(0, -1) + newLastDigit.toString();
      };

      const copiedPhone = generateUniquePhone(originalPhone);

      // Envoyer les données directement avec le router
      router.post(route('commerciaux.store'), {
        commercial_code: copiedCode,
        commercial_fullName: copiedName,
        commercial_telephone: copiedPhone
      }, {
        onSuccess: () => {
          toast.success('Commercial copié avec succès');
        },
        onError: () => {
          toast.error('Erreur lors de la copie du commercial');
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
    // Copy - nécessite commerciaux.create pour créer une copie
    ...(can('commerciaux.create') ? [{ icon: <MdContentCopy />, label: "Copy", className: "" }] : []),
    // Edit - nécessite commerciaux.edit
    ...(can('commerciaux.edit') ? [{ icon: <FaRegEdit />, label: "Edit", className: "" }] : []),
    // Séparateur seulement si on a des actions ET une action de suppression
    ...(((can('commerciaux.create') || can('commerciaux.edit')) && can('commerciaux.delete')) ? [{ separator: true } as const] : []),
    // Delete - nécessite commerciaux.delete
    ...(can('commerciaux.delete') ? [{ icon: <MdOutlineDelete className="text-lg" />, label: "Delete", className: "text-red-600" }] : [])
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
      <CommercialDialogEdit
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        commercial={row.original}
      />
    </div>
  );
}
