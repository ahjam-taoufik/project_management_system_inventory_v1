"use client";
import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Promotion } from "@/pages/promotion/config/columns";

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
import PromotionEditDialog from "@/pages/promotion/components/PromotionEditDialog";
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

export default function PromotionDropDown({ row }: { row: Row<Promotion> }) {
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
    if (confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      destroy(route('promotions.destroy', { promotion: row.original.id }), {
        onSuccess: () => {
          toast.success('Promotion supprimée avec succès');
        },
        onError: () => {
          toast.error('Erreur lors de la suppression de la promotion');
        },
        preserveScroll: true,
      });
    }
  }

  async function handleCopy() {
    if (confirm('Êtes-vous sûr de vouloir faire une copie de cette promotion ?')) {
      router.post(route('promotions.store'), {
        produit_promotionnel_id: row.original.produit_promotionnel_id,
        quantite_produit_promotionnel: row.original.quantite_produit_promotionnel,
        produit_offert_id: row.original.produit_offert_id,
        quantite_produit_offert: row.original.quantite_produit_offert,
      }, {
        onSuccess: () => {
          toast.success('Promotion copiée avec succès');
        },
        onError: (errors) => {
          console.error('Erreurs lors de la copie:', errors);
          toast.error('Erreur lors de la copie de la promotion');
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
    ...(can('promotions.create') ? [{ icon: <MdContentCopy />, label: "Copy", className: "" }] : []),
    ...(can('promotions.edit') ? [{ icon: <FaRegEdit />, label: "Edit", className: "" }] : []),
    ...(((can('promotions.create') || can('promotions.edit')) && can('promotions.delete')) ? [{ separator: true } as const] : []),
    ...(can('promotions.delete') ? [{ icon: <MdOutlineDelete className="text-lg" />, label: "Delete", className: "text-red-600" }] : [])
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

      <PromotionEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        promotion={row.original}
      />
    </div>
  );
}
