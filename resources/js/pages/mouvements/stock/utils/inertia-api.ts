import { router } from "@inertiajs/react";
import { StockFilters } from "../types";

/**
 * Récupère les données de stock avec pagination et filtres
 * sans recharger complètement la page (SPA-style)
 */
export function fetchStockData(filters: StockFilters) {
  const formData = new FormData();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  return router.visit(route("stocks.index"), {
    data: formData,
    preserveState: true,
    only: ["stocks", "total_montant_achat", "total_montant_vente", "total_diff", "filters"],
    replace: true,
    preserveScroll: true,
  });
}

/**
 * Réinitialise les filtres et rafraîchit les données
 */
export function clearFilters() {
  return router.visit(route("stocks.index"), {
    data: { page: 1 },
    preserveState: true,
    only: ["stocks", "total_montant_achat", "total_montant_vente", "total_diff", "filters"],
    replace: true,
    preserveScroll: true,
  });
}

/**
 * Change de page avec les filtres actuels
 */
export function changePage(page: number, perPage: number, currentFilters: StockFilters) {
  return router.visit(route("stocks.index"), {
    data: {
      ...currentFilters,
      page: page + 1, // +1 car l'API attend des pages commençant à 1
      perPage: perPage
    },
    preserveState: true,
    only: ["stocks", "total_montant_achat", "total_montant_vente", "total_diff", "filters"],
    replace: true,
    preserveScroll: true,
  });
}

/**
 * Applique des filtres de marque
 */
export function applyBrandFilters(brandIds: number[], currentFilters: StockFilters) {
  return router.visit(route("stocks.index"), {
    data: {
      ...currentFilters,
      brand_ids: brandIds.length > 0 ? brandIds : undefined,
      page: 1 // Retour à la première page
    },
    preserveState: true,
    only: ["stocks", "total_montant_achat", "total_montant_vente", "total_diff", "filters"],
    replace: true,
    preserveScroll: true,
  });
}

/**
 * Applique des filtres de recherche
 */
export function applySearchFilter(searchTerm: string, currentFilters: StockFilters) {
  return router.visit(route("stocks.index"), {
    data: {
      ...currentFilters,
      search: searchTerm,
      page: 1 // Retour à la première page
    },
    preserveState: true,
    only: ["stocks", "total_montant_achat", "total_montant_vente", "total_diff", "filters"],
    replace: true,
    preserveScroll: true,
  });
}

/**
 * Applique un filtre par valeur de stock (positif, négatif, zéro)
 */
export function applyStockValueFilter(stockValueFilter: string | undefined, currentFilters: StockFilters) {
  return router.visit(route("stocks.index"), {
    data: {
      ...currentFilters,
      stock_value_filter: stockValueFilter,
      page: 1 // Retour à la première page
    },
    preserveState: true,
    only: ["stocks", "total_montant_achat", "total_montant_vente", "total_diff", "filters"],
    replace: true,
    preserveScroll: true,
  });
}
