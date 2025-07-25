"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import UserDropDown from "@/pages/user/components/UserDropDown";
import { ArrowUpDown } from "lucide-react";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { User, Role } from "@/types";

type SortableHeaderProps = {
  column: Column<User, unknown>;
  label: string;
};

const SortableHeader: React.FC<SortableHeaderProps> = ({ column, label }) => {
  const isSorted = column.getIsSorted();
  const SortingIcon =
    isSorted === "asc"
      ? IoMdArrowUp
      : isSorted === "desc"
      ? IoMdArrowDown
      : ArrowUpDown;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="" asChild>
          <Button variant="ghost" aria-label={`Sort by ${label}`} >
             {label}
             <SortingIcon className=" h-4 w-4" />
          </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" side="bottom">
        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <IoMdArrowUp className="mr-2 h-4 w-4" />
          Asc
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <IoMdArrowDown className="mr-2 h-4 w-4" />
          Desc
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const createColumns = (roles: Role[]): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} label="Nom" />,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableHeader column={column} label="Email" />,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("email")}</div>
    },
  },
  {
    accessorFn: (row) => row.roles?.length || 0,
    id: "roles",
    header: ({ column }) => <SortableHeader column={column} label="Rôles" />,
    cell: ({ row }) => {
      const userRoles = row.original.roles;
      return (
        <div className="text-left">
          {userRoles && userRoles.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {userRoles.map((role, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {role.name}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">Aucun rôle</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (<div className="text-center"> <SortableHeader column={column} label="Créé le" /></div>),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      const formatted = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })

      return <div className="text-center">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <UserDropDown row={row} roles={roles} />;
    },
  },
];

// Exporter la fonction et les types
export { type User, type Role };
