"use client";
import React, { useState } from "react";
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
import CategoryEditDialog from "./CategoryEditDialog";
import { usePermissions } from '@/hooks/use-permissions';
import type { Category } from '@/types';

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

export default function CategoryDropDown({ category }: { category: Category }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { delete: destroy } = useForm();
  const { can } = usePermissions();

  function handleEdit() {
    // Ouvrir le dialog immédiatement sans délai
    setIsEditDialogOpen(true);
    setIsDropdownOpen(false);
  }

  async function handleDelete() {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      destroy(route('categories.destroy', { category: category.id }), {
        onSuccess: () => {
          toast.success('Catégorie supprimée avec succès');
        },
        onError: () => {
          toast.error('Erreur lors de la suppression de la catégorie');
        },
        preserveScroll: true,
      });
    }
  }

  async function handleCopy() {
    if (confirm('Êtes-vous sûr de vouloir faire une copie de cette catégorie ?')) {
      const originalName = category.category_name;
      const copiedName = `${originalName} - Copy`;
      router.post(route('categories.store'), {
        category_name: copiedName,
        brand_id: category.brand_id
      }, {
        onSuccess: () => {
          toast.success('Catégorie copiée avec succès');
        },
        onError: () => {
          toast.error('Erreur lors de la copie de la catégorie');
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
    ...(can('categories.create') ? [{ icon: <MdContentCopy />, label: "Copy", className: "" }] : []),
    ...(can('categories.edit') ? [{ icon: <FaRegEdit />, label: "Edit", className: "" }] : []),
    ...(((can('categories.create') || can('categories.edit')) && can('categories.delete')) ? [{ separator: true } as const] : []),
    ...(can('categories.delete') ? [{ icon: <MdOutlineDelete className="text-lg" />, label: "Delete", className: "text-red-600" }] : [])
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickedItem(item);
                }}
                onSelect={(e) => {
                  if (item.label === "Edit") {
                    e.preventDefault();
                    e.stopPropagation();
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
      <CategoryEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        category={category}
      />
    </div>
  );
}
