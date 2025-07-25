"use client";

import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { User, Role } from "@/types";
import { usePermissions } from "@/hooks/use-permissions";

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
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import UserEditDialog from "@/pages/user/components/UserEditDialog";

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

interface UserDropDownProps {
  row: Row<User>;
  roles: Role[];
}

export default function UserDropDown({ row, roles }: UserDropDownProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { delete: destroy } = useForm();
  const { hasPermission } = usePermissions();

  function handleEdit() {
    // Fermer le dropdown avant d'ouvrir le dialog
    setIsDropdownOpen(false);

    // Petit délai pour permettre au dropdown de se fermer complètement
    setTimeout(() => {
      setIsEditDialogOpen(true);
    }, 100);
  }

  async function handleDelete() {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      destroy(route('users.destroy', { user: row.original.id }), {
        onSuccess: () => {
          toast.success('Utilisateur supprimé avec succès');
        },
        onError: () => {
          toast.error('Erreur lors de la suppression de l\'utilisateur');
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
    ...(hasPermission('users.edit') ? [{ icon: <FaRegEdit />, label: "Edit", className: "" }] : []),
    ...(hasPermission('users.edit') && hasPermission('users.delete') ? [{ separator: true } as const] : []),
    ...(hasPermission('users.delete') ? [{ icon: <MdOutlineDelete className="text-lg" />, label: "Delete", className: "text-red-600" }] : [])
  ];

  // Ne pas afficher le dropdown si l'utilisateur n'a aucune permission
  if (!hasPermission('users.edit') && !hasPermission('users.delete')) {
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
      <UserEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={row.original}
        roles={roles}
      />
    </div>
  );
}
