"use client";
import { usePage } from "@inertiajs/react";
import { columns } from "./config/columns";
import { StockTable } from "./components/StockTable";
import { PrintButtons } from "./components/print";
import { useEffect, useMemo } from "react";
import { Stock, ProductForBrand } from "./types";

export default function AppTable() {
    const { props } = usePage<{
        stocks: {
            data: Stock[];
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
            from: number;
            to: number;
            // autres champs de pagination si besoin
        };
        products: ProductForBrand[];
        total_montant_achat?: number;
        total_montant_vente?: number;
        total_diff?: number;
    }>();

    // Gestion compatible tableau ou objet paginé
    const stocksArray = Array.isArray(props.stocks)
      ? props.stocks
      : props.stocks?.data ?? [];

    const stocksCount = Array.isArray(props.stocks)
      ? props.stocks.length
      : props.stocks?.total ?? 0;

    // Récupérer les totaux depuis les props
    const totalMontantAchat = props.total_montant_achat ?? 0;
    const totalMontantVente = props.total_montant_vente ?? 0;
    const totalDiff = props.total_diff ?? 0;

    // Générer la liste des marques à partir des produits
    const brands = useMemo(() => {
        const products = props.products || [];
        const brandMap = new Map<number, string>();
        products.forEach((p) => {
            if (p.brand_id && p.brand && p.brand.brand_name) {
                brandMap.set(p.brand_id, p.brand.brand_name);
            }
        });
        return Array.from(brandMap, ([id, brand_name]) => ({ id, brand_name }));
    }, [props.products]);

    useEffect(() => {
        // Raccourci clavier Alt+A pour ajouter un stock
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                document.getElementById('add-stock-button')?.click();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className="mt-0 w-full max-w-full overflow-x-auto">
            <div className="flex items-center justify-between gap-2 px-1 py-0.5">
                <div>
                    <span className="font-bold text-2xl">Stocks</span>
                    <span className="text-muted-foreground text-xl ml-2">
                        {stocksCount} {stocksCount > 1 ? "Produits" : "Produit"}
                    </span>
                </div>
                <PrintButtons 
                    stocks={stocksArray} 
                    brands={brands} 
                    totalMontantAchat={totalMontantAchat}
                    totalMontantVente={totalMontantVente}
                    totalDiff={totalDiff}
                />
            </div>
            <div className="min-w-[300px]">
                <StockTable data={stocksArray} columns={columns} />
            </div>
        </div>
    );
}
