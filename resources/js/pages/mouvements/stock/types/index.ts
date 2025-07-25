// Types partagés pour le module de gestion des stocks

export type Stock = {
  id: number;
  product: {
    id: number;
    product_libelle: string;
    product_Ref?: string;
    prix_achat_colis?: string | number;
    prix_vente_colis?: string | number;
    brand_id?: number;
    brand?: { brand_name: string };
  };
  quantite_totale_entree: number | null;
  quantite_totale_sortie: number | null;
  stock_minimum: number | null;
  stock_maximum: number | null;
  valeur_stock: string | null;
  derniere_entree: string | null;
  derniere_sortie: string | null;
  created_at: string;
  updated_at: string;
};

export type PaginationType = {
  pageIndex: number;
  pageSize: number;
};

export type StockFilters = {
  page?: number;
  perPage?: number;
  search?: string;
  brand_ids?: number[];
  sort?: string;
  direction?: string;
  stock_value_filter?: string;
};

export type ProductForBrand = {
  brand_id: number;
  brand: { brand_name: string };
};

// Constantes pour la pagination
export const PAGE_SIZE_ALL = 999999;
