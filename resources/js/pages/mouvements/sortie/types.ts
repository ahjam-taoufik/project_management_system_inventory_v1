export interface Sortie {
    id: number;
    numero_bl: string;
    commercial: {
        id: number;
        code: string;
        nom: string;
        telephone: string;
    };
    client: {
        id: number;
        code: string;
        nom: string;
        telephone: string;
        ville: string;
        secteur: string;
        type_client: string;
    };
    date_bl: string;
    livreur: string;
    product_count: number;
    products: SortieProduct[];
    total_bl?: number;
    updated_at: string;
}

export interface SortieProduct {
    id: number;
    product: {
        id: number;
        product_libelle: string;
        product_Ref: string;
    };
    ref_produit: string;
    prix_vente_produit: number;
    quantite_produit: number;
    total_ligne: number;
}

export interface Commercial {
    id: number;
    code: string;
    nom: string;
    telephone: string;
    commercial_fullName?: string;
    commercial_telephone?: string;
}

export interface Client {
    id: number;
    code: string;
    nom: string;
    telephone: string;
    fullName?: string;
    ville: string | { id: number; nameVille: string; created_at: string; updated_at: string };
    secteur: string | { id: number; nameSecteur: string; created_at: string; updated_at: string };
    type_client: string;
    idCommercial?: number;
    remise_special?: number;
    pourcentage?: number;
}

export interface Product {
    id: number;
    product_libelle: string;
    product_Ref: string;
    product_isActive: boolean;
    prix_vente_colis: number;
    prix_achat_colis: number;
    product_Poids?: number; // Poids en kg par colis (correspond à la base de données)
}
