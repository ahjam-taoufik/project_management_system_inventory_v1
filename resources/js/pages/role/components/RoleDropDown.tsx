"use client";

import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Role } from "@/pages/role/config/columns";
import { usePage } from "@inertiajs/react";
import type { Permission } from "@/types";

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
import RoleEditDialog from "@/pages/role/components/RoleEditDialog";

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

export default function RoleDropDown({ row }: { row: Row<Role> }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { delete: destroy, post } = useForm();
  const { props: { permissions } } = usePage();
  const permissionsArray = permissions as Permission[];

  function handleEdit() {
    setIsDropdownOpen(false);
    setTimeout(() => {
      setIsEditDialogOpen(true);
    }, 100);
  }

  async function handleDelete() {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) {
      destroy(route('roles.destroy', { role: row.original.id }), {
        onSuccess: () => {
          toast.success('Rôle supprimé avec succès');
        },
        onError: () => {
          toast.error('Erreur lors de la suppression du rôle');
        },
        preserveScroll: true,
      });
    }
  }

  async function handleCopy() {
    if (confirm('Êtes-vous sûr de vouloir faire une copie de ce rôle ?')) {
      const originalName = row.original.name;
      const copiedName = `${originalName} - Copy`;

      post(route('roles.store', { name: copiedName, guard_name: row.original.guard_name }), {
        onSuccess: () => {
          toast.success('Rôle copié avec succès');
        },
        onError: () => {
          toast.error('Erreur lors de la copie du rôle');
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
    { icon: <MdContentCopy />, label: "Copy", className: "" },
    { icon: <FaRegEdit />, label: "Edit", className: "" },
    { separator: true } as const,
    { icon: <MdOutlineDelete className="text-lg" />, label: "Delete", className: "text-red-600" }
  ];

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
                <span>{item.label}</span>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <RoleEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        role={row.original}
        permissions={permissionsArray}
      />
    </div>
  );
}
