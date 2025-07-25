"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import BrandDropDown from "@/pages/brand/components/BrandDropDown";
import { ArrowUpDown } from "lucide-react";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type Brand = {
  id: number;
  brand_name: string;
  created_at?: Date;
};

type SortableHeaderProps = {
  column: Column<Brand, unknown>;
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
      <DropdownMenuTrigger asChild>
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

export const columns: ColumnDef<Brand>[] = [
  {
    accessorKey: "brand_name",
    header: ({ column }) => <SortableHeader column={column} label="Nom de la marque" />,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("brand_name")}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <div className="text-center">
        <SortableHeader column={column} label="Créé le" />
      </div>
    ),
    cell: ({ row }) => {
      const date = row.getValue("created_at");
      if (!date) return null;
      const formatted = new Date(date as string).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return <div className="text-center">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <BrandDropDown row={row} />;
    },
  },
];
