"use client";

import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Client } from "@/pages/client/config/columns";

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
import ClientEditDialog from "@/pages/client/components/ClientEditDialog";
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

export default function ClientDropDown({ row }: { row: Row<Client> }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { delete: destroy } = useForm();
  const { can } = usePermissions();

  function handleEdit() {
    setIsDropdownOpen(false);
    setTimeout(() => {
      setIsEditDialogOpen(true);
    }, 100);
  }

  async function handleDelete() {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      destroy(route('clients.destroy', { client: row.original.id }), {
        onSuccess: () => {
          toast.success('Client supprimé avec succès');
        },
        onError: () => {
          toast.error('Erreur lors de la suppression du client');
        },
        preserveScroll: true,
      });
    }
  }

  async function handleCopy() {
    if (confirm('Êtes-vous sûr de vouloir faire une copie de ce client ?')) {
      const originalCode = row.original.code;
      const originalFullName = row.original.fullName;
      const copiedCode = `${originalCode}-Copy`;
      const copiedFullName = `${originalFullName} - Copie`;

      router.post(route('clients.store'), {
        code: copiedCode,
        fullName: copiedFullName,
        idVille: row.original.idVille,
        idSecteur: row.original.idSecteur,
        idCommercial: row.original.idCommercial,
        remise_special: row.original.remise_special,
        pourcentage: row.original.pourcentage,
        telephone: row.original.telephone,
      }, {
        onSuccess: () => {
          toast.success('Client copié avec succès');
        },
        onError: (errors) => {
          console.error('Erreurs lors de la copie:', errors);
          toast.error('Erreur lors de la copie du client');
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

  const menuItems: MenuItem[] = [
    ...(can('clients.create') ? [{ icon: <MdContentCopy />, label: "Copy", className: "" }] : []),
    ...(can('clients.edit') ? [{ icon: <FaRegEdit />, label: "Edit", className: "" }] : []),
    ...(((can('clients.create') || can('clients.edit')) && can('clients.delete')) ? [{ separator: true } as const] : []),
    ...(can('clients.delete') ? [{ icon: <MdOutlineDelete className="text-lg" />, label: "Delete", className: "text-red-600" }] : [])
  ];

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
                  if (item.label === "Edit") {
                    e.preventDefault();
                  }
                }}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ClientEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        client={row.original}
      />
    </div>
  );
}
