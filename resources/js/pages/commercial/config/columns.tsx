"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import CommercialDropDown from "@/pages/commercial/components/CommercialDropDown";
import { ArrowUpDown } from "lucide-react";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type Commercial = {
  id: string;
  commercial_code: string;
  commercial_fullName: string;
  commercial_telephone: string;
  created_at: Date;
};

type SortableHeaderProps = {
  column: Column<Commercial, unknown>;
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

export const columns: ColumnDef<Commercial>[] = [
  {
    accessorKey: "commercial_code",
    header: ({ column }) => <SortableHeader column={column} label="Code Commercial" />,
    cell: ({ row }) => {
      return <div className="text-left font-medium">{row.getValue("commercial_code")}</div>
    },
  },
  {
    accessorKey: "commercial_fullName",
    header: ({ column }) => <SortableHeader column={column} label="Nom Complet" />,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("commercial_fullName")}</div>
    },
  },
  {
    accessorKey: "commercial_telephone",
    header: ({ column }) => <SortableHeader column={column} label="Téléphone" />,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("commercial_telephone")}</div>
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (<div className="text-center"> <SortableHeader column={column} label="Created At" /></div>),
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
      return <CommercialDropDown row={row} />;
    },
  },
];
