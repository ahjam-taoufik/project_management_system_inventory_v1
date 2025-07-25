"use client";
import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Entrer } from "@/pages/mouvements/entrer/config/columns";

import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useForm, router, usePage } from "@inertiajs/react";
import toast from "react-hot-toast";
import EntrerEditDialog from "@/pages/mouvements/entrer/components/EntrerEditDialog";
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

export default function EntrerDropDown({ row }: { row: Row<Entrer> }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { delete: destroy } = useForm();
  const { can } = usePermissions();
  const { props: { products, transporteurs } } = usePage();

  function handleEdit() {
    setIsDropdownOpen(false);
    setTimeout(() => {
      setIsEditDialogOpen(true);
    }, 100);
  }

  async function handleDelete() {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce BL et toutes ses entrées ?')) {
      destroy(route('entrers.destroy', { entrer: row.original.id }), {
        onSuccess: () => {
          toast.success('BL supprimé avec succès');
        },
        onError: () => {
          toast.error('Erreur lors de la suppression du BL');
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



    if (item.label === "Edit") {
      handleEdit();
    }
  }

  const menuItems: MenuItem[] = [
    // ...(can('entrers.edit') ? [{ icon: <FaRegEdit />, label: "Edit", className: "" }] : []),
    // ...((can('entrers.edit') && can('entrers.delete')) ? [{ separator: true } as const] : []),
    ...(can('entrers.delete') ? [{ icon: <MdOutlineDelete className="text-lg" />, label: "Delete", className: "text-red-600" }] : [])
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

      <EntrerEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        entrer={row.original}
        products={products}
        transporteurs={transporteurs}
      />
    </div>
  );
}
