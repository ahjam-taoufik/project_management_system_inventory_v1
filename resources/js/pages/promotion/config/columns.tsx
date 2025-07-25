"use client";
import { ColumnDef } from "@tanstack/react-table";
import PromotionDropDown from "../components/PromotionDropDown";
import { Badge } from "@/components/ui/badge";

export type Promotion = {
  id: number;
  produit_promotionnel_id: number;
  quantite_produit_promotionnel: number;
  produit_offert_id: number;
  quantite_produit_offert: number;
  produit_promotionnel?: {
    id: number;
    product_libelle: string;
    product_Ref: string;
  };
  produit_offert?: {
    id: number;
    product_libelle: string;
    product_Ref: string;
  };
  is_active?: boolean;
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<Promotion>[] = [
  {
    accessorFn: (row) => row.produit_promotionnel?.product_libelle || '',
    id: "produit_promotionnel",
    header: "Produit Promotionnel",
    cell: ({ row }) => {
      const produit = row.original.produit_promotionnel;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{produit?.product_libelle || 'N/A'}</span>
          <span className="text-xs text-muted-foreground">{produit?.product_Ref || ''}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "quantite_produit_promotionnel",
    header: "Quantité Promotionnelle",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.getValue("quantite_produit_promotionnel")}</span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.produit_offert?.product_libelle || '',
    id: "produit_offert",
    header: "Produit Offert",
    cell: ({ row }) => {
      const produit = row.original.produit_offert;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{produit?.product_libelle || 'N/A'}</span>
          <span className="text-xs text-muted-foreground">{produit?.product_Ref || ''}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "quantite_produit_offert",
    header: "Quantité Offerte",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.getValue("quantite_produit_offert")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "Statut",
    cell: ({ row }) => {
      const isActive = row.original.is_active;
      return (
        <Badge variant={isActive ? "outline" : "destructive"} className={isActive ? "text-green-700 border-green-300 bg-green-50" : "text-red-700 border-red-300 bg-red-50"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <PromotionDropDown row={row} />;
    },
  },
];
