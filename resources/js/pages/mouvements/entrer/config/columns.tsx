"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import EntrerDropDown from "../components/EntrerDropDown";
import { Entrer } from "../types";

export const columns: ColumnDef<Entrer>[] = [
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
    accessorKey: "date_charge",
    header: "Date de charge",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date_charge"));
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{date.toLocaleDateString('fr-FR')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "date_decharge",
    header: "Date de décharge",
    cell: ({ row }) => {
      const date = row.getValue("date_decharge");
      if (!date) {
        return (
          <div className="flex flex-col">
            <Badge variant="secondary">Non définie</Badge>
          </div>
        );
      }
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{new Date(date).toLocaleDateString('fr-FR')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "transporteur.vehicule_matricule",
    header: "Transporteur",
    cell: ({ row }) => {
      const transporteur = row.original.transporteur;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{transporteur.vehicule_matricule}</span>
          <span className="text-xs text-muted-foreground">{transporteur.conducteur_name}</span>
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
      return <EntrerDropDown row={row} />;
    },
  },
];
