"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import ProductDropDown from "@/pages/product/components/ProductDropDown";
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
import type { Product } from "@/types";

type SortableHeaderProps = {
  column: Column<Product, unknown>;
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

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "product_Ref",
    header: ({ column }) => (
      <SortableHeader column={column} label="Référence" />
    ),
    cell: ({ row }) => {
      const ref: string = row.getValue("product_Ref");
      return <div className="font-mono font-medium">{ref}</div>;
    },
  },
  {
    accessorKey: "product_libelle",
    header: ({ column }) => (
      <SortableHeader column={column} label="Libellé" />
    ),
    cell: ({ row }) => {
      const libelle: string = row.getValue("product_libelle");
      return <div className="font-medium">{libelle}</div>;
    },
  },
  {
    accessorKey: "prix_achat_colis",
    header: ({ column }) => (
      <SortableHeader column={column} label="Prix Achat Colis" />
    ),
    cell: ({ row }) => {
      const prix = row.getValue("prix_achat_colis");
      const prixValue = typeof prix === 'number' ? prix : parseFloat(prix as string) || 0;
      return (
        <div className="font-medium">
          {new Intl.NumberFormat("fr-FR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(prixValue)} Dhs
        </div>
      );
    },
  },
  {
    accessorKey: "prix_vente_colis",
    header: ({ column }) => (
      <SortableHeader column={column} label="Prix Vente Colis" />
    ),
    cell: ({ row }) => {
      const prix = row.getValue("prix_vente_colis");
      const prixValue = typeof prix === 'number' ? prix : parseFloat(prix as string) || 0;
      return (
        <div className="font-medium">
          {new Intl.NumberFormat("fr-FR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(prixValue)} Dhs
        </div>
      );
    },
  },
  {
    accessorKey: "product_isActive",
    header: ({ column }) => (
      <SortableHeader column={column} label="Statut" />
    ),
    cell: ({ row }) => {
      const isActive: boolean = row.getValue("product_isActive");
      return (
        <Badge
          variant={isActive ? "secondary" : "destructive"}
          className={isActive ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" : ""}
        >
          {isActive ? "Actif" : "Inactif"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;
      return <ProductDropDown product={product} />;
    },
  },
];
