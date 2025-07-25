"use client";

import {  Column, ColumnDef } from "@tanstack/react-table";
import SecteurDropDown from "@/pages/secteur/components/SecteurDropDown";
import { ArrowUpDown } from "lucide-react";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type Secteur = {
  id: string;
  nameSecteur: string;
  idVille: string;
  created_at: Date;
   ville: {
    id: string;
    nameVille: string;
  };
};

type SortableHeaderProps = {
  column: Column<Secteur, unknown>; // Specify the type of data
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

export const columns: ColumnDef<Secteur>[] = [
  {
    accessorKey: "nameSecteur",
    header: ({ column }) => <SortableHeader column={column} label="Name Secteur" />,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("nameSecteur")}</div>
    },
    enableColumnFilter: true,
    filterFn: "includesString",
},
  {
    accessorFn: (row) => row.ville?.nameVille || 'Inconnue',
    id: "ville",
    header: ({ column }) => <SortableHeader column={column} label="Ville" />,
    cell: ({ row }) => {
      return <div className="text-left">{row.original.ville?.nameVille || 'Inconnue'}</div>
    },
    enableColumnFilter: true,
    filterFn: "includesString",
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
      return <SecteurDropDown row={row} />;
    },
  },
];
