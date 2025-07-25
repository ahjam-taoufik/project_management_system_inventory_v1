"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Stock } from "../types";
import { formatPrix, formatNombre, calculerMontant } from "../utils/formatting";

export const columns: ColumnDef<Stock>[] = [
  {
    id: "product.product_libelle",
    header: "Produit",
    accessorFn: row => row.product?.product_libelle ?? "",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">{row.original.product?.product_libelle ?? ""}</span>
        {row.original.product?.product_Ref && (
          <span className="text-xs text-muted-foreground">Ref: {row.original.product.product_Ref}</span>
        )}
      </div>
    ),
  },
  // {
  //   accessorKey: "quantite_totale_entree",
  //   header: "Entrées",
  //   cell: ({ row }) => <span>{row.original.quantite_totale_entree ?? 0}</span>,
  // },
  // {
  //   accessorKey: "quantite_totale_sortie",
  //   header: "Sorties",
  //   cell: ({ row }) => <span>{row.original.quantite_totale_sortie ?? 0}</span>,
  // },
  {
    accessorKey: "stock_disponible",
    header: "Stock disponible",
    enableSorting: true,
    cell: ({ row }) => {
      const valeur = row.original.stock_disponible;
      if (valeur === null || valeur === undefined || valeur === "") return "-";
      const num = typeof valeur === "string" ? parseFloat(valeur) : valeur;
      if (isNaN(num)) return "-";
      const formatted = formatNombre(num);

      if (num < 0) {
        return <Badge variant="destructive">{formatted}</Badge>;
      }
      if (num === 0) {
        return <Badge className="bg-yellow-400 text-black hover:bg-yellow-500">{formatted}</Badge>;
      }
      if (num > 0) {
        return <Badge className="bg-green-500 text-white hover:bg-green-600">{formatted}</Badge>;
      }
      return <span>{formatted}</span>;
    },
  },
  {
    id: "prix_achat_colis",
    header: "Prix achat colis",
    accessorFn: row => row.product?.prix_achat_colis ?? 0,
    enableSorting: true,
    cell: ({ row }) => (
      <span>{formatPrix(row.original.product?.prix_achat_colis)} DH</span>
    ),
  },
  {
    id: "prix_vente_colis",
    header: "Prix vente colis",
    accessorFn: row => row.product?.prix_vente_colis ?? 0,
    enableSorting: true,
    cell: ({ row }) => (
      <span>{formatPrix(row.original.product?.prix_vente_colis)} DH</span>
    ),
  },
  // {
  //   accessorKey: "stock_minimum",
  //   header: "Stock min.",
  //   cell: ({ row }) => <span>{row.original.stock_minimum ?? 0}</span>,
  // },
  // {
  //   accessorKey: "stock_maximum",
  //   header: "Stock max.",
  //   cell: ({ row }) => <span>{row.original.stock_maximum ?? 0}</span>,
  // },
  // {
  //   accessorKey: "derniere_entree",
  //   header: "Dernière entrée",
  //   cell: ({ row }) => row.original.derniere_entree ? (
  //     <span>{new Date(row.original.derniere_entree).toLocaleDateString('fr-FR')}</span>
  //   ) : <span className="text-muted-foreground">-</span>,
  // },
  // {
  //   accessorKey: "derniere_sortie",
  //   header: "Dernière sortie",
  //   cell: ({ row }) => row.original.derniere_sortie ? (
  //     <span>{new Date(row.original.derniere_sortie).toLocaleDateString('fr-FR')}</span>
  //   ) : <span className="text-muted-foreground">-</span>,
  // },
  // {
  //   accessorKey: "created_at",
  //   header: "Créé le",
  //   cell: ({ row }) => (
  //     <span className="text-sm text-muted-foreground">
  //       {row.original.created_at ? new Date(row.original.created_at).toLocaleDateString('fr-FR') : "-"}
  //     </span>
  //   ),
  // },
  // Déplacer Montant achat et Montant vente à la fin
  {
    id: "montant_achat",
    header: "Montant achat",
    enableSorting: false,
    cell: ({ row }) => {
      const total = calculerMontant(row.original.stock_disponible, row.original.product?.prix_achat_colis);
      return <span>{formatPrix(total)} DH</span>;
    },
  },
  {
    id: "montant_vente",
    header: "Montant vente",
    enableSorting: false,
    cell: ({ row }) => {
      const total = calculerMontant(row.original.stock_disponible, row.original.product?.prix_vente_colis);
      return <span>{formatPrix(total)} DH</span>;
    },
  },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => <StockDropDown row={row} />,
//   },
];
