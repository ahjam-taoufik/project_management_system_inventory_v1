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
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import ProductEditDialog from "./ProductEditDialog";
import ProductDialog from "./ProductDialog";
import { usePermissions } from '@/hooks/use-permissions';
import type { Product } from '@/types';

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

export default function ProductDropDown({ product }: { product: Product }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { delete: destroy } = useForm();
  const { can } = usePermissions();

  function handleEdit() {
    setIsEditDialogOpen(true);
    setIsDropdownOpen(false);
  }

  async function handleDelete() {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      destroy(route('products.destroy', { product: product.id }), {
        onSuccess: () => {
          toast.success('Produit supprimé avec succès');
        },
        onError: () => {
          toast.error('Erreur lors de la suppression du produit');
        },
        preserveScroll: true,
      });
    }
  }

  function handleDuplicate() {
    setIsDuplicateDialogOpen(true);
    setIsDropdownOpen(false);
  }

  const menuItems: MenuItem[] = [
    ...(can('products.edit') ? [{
      icon: <FaRegEdit className="w-4 h-4" />,
      label: "Edit",
      className: "cursor-pointer",
    }] : []),
    ...(can('products.create') ? [{
      icon: <MdContentCopy className="w-4 h-4" />,
      label: "Duplicate",
      className: "cursor-pointer",
    }] : []),
    ...(can('products.edit') && can('products.delete') ? [{ separator: true }] : []),
    ...(can('products.delete') ? [{
      icon: <MdOutlineDelete className="w-4 h-4" />,
      label: "Delete",
      className: "cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600",
    }] : []),
  ];

  if (menuItems.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-end">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {menuItems.map((item, index) =>
            item.separator ? (
              <DropdownMenuSeparator key={index} />
            ) : (
              <DropdownMenuItem
                key={index}
                className={item.className}
                onClick={(e) => {
                  if (item.label === "Edit") {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEdit();
                  } else if (item.label === "Delete") {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete();
                  } else if (item.label === "Duplicate") {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDuplicate();
                  }
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
      <ProductEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        product={product}
      />
      <ProductDialog
        duplicateData={product}
        isOpen={isDuplicateDialogOpen}
        onOpenChange={setIsDuplicateDialogOpen}
      />
    </div>
  );
}
