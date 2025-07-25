"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import RoleDropDown from "@/pages/role/components/RoleDropDown";
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

export type Role = {
  id: string;
  name: string;
  guard_name: string;
  permissions: Array<{
    id: number;
    name: string;
    guard_name: string;
  }>;
  created_at: Date;
};

type SortableHeaderProps = {
  column: Column<Role, unknown>;
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
        <Button variant="ghost" aria-label={`Sort by ${label}`}>
          {label}
          <SortingIcon className="h-4 w-4" />
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

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} label="Name" />,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "guard_name",
    header: ({ column }) => <SortableHeader column={column} label="Guard Name" />,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("guard_name")}</div>
    },
  },
  {
    accessorFn: (row) => row.permissions ?? [],
    id: "permissions",
    header: ({ column }) => (<div className="text-center"><SortableHeader column={column} label="Permissions" /></div>),
    cell: ({ row }) => {
      const permissions = row.getValue("permissions") as Array<{
        id: number;
        name: string;
        guard_name: string;
      }>;

      if (!permissions || permissions.length === 0) {
        return <div className="text-center text-muted-foreground">Aucune permission</div>;
      }

      return (
        <div className="flex flex-wrap gap-1 justify-center max-w-[200px]">
          {permissions.slice(0, 3).map((permission) => (
            <Badge
              key={permission.id}
              variant="secondary"
            //   ici j'ai personnalisé la couleur
              className="text-xs px-2 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
            >
              {permission.name}
            </Badge>
          ))}
          {permissions.length > 3 && (
            <Badge
              variant="outline"
              className="text-xs px-2 py-1"
            >
              +{permissions.length - 3}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (<div className="text-center"><SortableHeader column={column} label="Created At" /></div>),
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
      return <RoleDropDown row={row} />;
    },
  },
];
