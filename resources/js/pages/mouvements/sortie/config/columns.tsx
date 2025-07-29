"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import SortieDropDown from "../components/SortieDropDown";
import { Sortie } from "../types";

export const columns: ColumnDef<Sortie>[] = [
  {
    id: "expand",
    header: "",
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => row.toggleExpanded()}
          className="h-8 w-8 p-0"
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "numero_bl",
    header: "Numéro BL",
    enableColumnFilter: true,
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.getValue("numero_bl")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "date_bl",
    header: "Date BL",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date_bl"));
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{date.toLocaleDateString('fr-FR')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "commercial.nom",
    header: "Commercial",
    cell: ({ row }) => {
      const commercial = row.original.commercial;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{commercial.nom}</span>
          <span className="text-xs text-muted-foreground">{commercial.code} - {commercial.telephone}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "client.nom",
    header: "Client",
    cell: ({ row }) => {
      const client = row.original.client;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{client.nom}</span>
          <span className="text-xs text-muted-foreground">{client.code} - {client.ville}</span>
          <Badge variant="outline" className="text-xs w-fit mt-1">
            {client.type_client}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "livreur",
    header: "Livreur",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.getValue("livreur")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "total_bl",
    header: "Total BL",
    cell: ({ row }) => {
      const total = row.getValue("total_bl") as number;
      const formatNumber = (value: number): string => {
        const num = parseFloat(value?.toString() || '0');
        if (isNaN(num)) return '0,00';

        // Convertir en chaîne avec 2 décimales
        const formatted = num.toFixed(2);

        // Ajouter les espaces pour les milliers
        const parts = formatted.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

        return parts.join(',');
      };

      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-green-600">
            {total ? `${formatNumber(total)} DH` : '0,00 DH'}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <SortieDropDown row={row} />;
    },
  },
];