"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import CategoryDropDown from "@/pages/category/components/CategoryDropDown";
import { ArrowUpDown } from "lucide-react";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types";

type SortableHeaderProps = {
  column: Column<Category, unknown>;
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
        <Button variant="ghost" className="h-8 p-0 hover:bg-muted">
          <span className="font-medium">{label}</span>
          <SortingIcon className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <IoMdArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <IoMdArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Desc
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "category_name",
    header: ({ column }) => (
      <SortableHeader column={column} label="Nom Catégorie" />
    ),
    cell: ({ row }) => {
      const categoryName: string = row.getValue("category_name");
      return <div className="font-medium">{categoryName}</div>;
    },
  },
  {
    accessorKey: "brand",
    header: ({ column }) => (
      <SortableHeader column={column} label="Marque" />
    ),
    cell: ({ row }) => {
      const brand = row.getValue("brand") as { brand_name: string } | undefined;
      return (
        <div className="text-muted-foreground">
          {brand?.brand_name || "Aucune marque"}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <SortableHeader column={column} label="Date de création" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return (
        <div className="text-muted-foreground">
          {date.toLocaleDateString("fr-FR")}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original;
      return <CategoryDropDown category={category} />;
    },
  },
];
