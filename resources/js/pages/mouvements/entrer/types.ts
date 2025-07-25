export interface Entrer {
    id: number;
    numero_bl: string;
    transporteur: {
        id: number;
        conducteur_name: string;
        vehicule_matricule: string;
    };
    date_charge: string;
    date_decharge: string | null;
    product_count: number;
    products: EntrerProduct[];
    // Propriétés pour compatibilité avec l'ancienne structure
    product?: {
        id: number;
        product_libelle: string;
        product_Ref: string;
    };
    ref_produit?: string;
    prix_achat_produit?: number;
    quantite_produit?: number;
    manque?: number | null;
    total_bl?: number;
    updated_at: string;
}

export interface EntrerProduct {
    id: number;
    product: {
        id: number;
        product_libelle: string;
        product_Ref: string;
    };
    ref_produit: string;
    prix_achat_produit: number;
    quantite_produit: number;
    manque: number | null;
    is_offered?: boolean; // Ajout pour l'affichage frontend
}

export interface Product {
    id: number;
    product_libelle: string;
    product_Ref: string;
    product_isActive: boolean;
    prix_achat_colis: number;
}

export interface Transporteur {
    id: number;
    conducteur_name: string;
    vehicule_matricule: string;
}
