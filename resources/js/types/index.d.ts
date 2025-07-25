import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

// *******start script taoufik
export interface MainNavItem {
    title: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    subItems?: SubItems[];
}
export interface SubItems {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}
// *******end script taoufik



export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    roles?: string[];
    permissions?: Permission[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface PageProps<T extends Record<string, unknown> = Record<string, unknown>> extends T {
  auth: {
    user: User;
  };
  errors: Record<string, string>;
}

export interface Client {
  id: number;
  code: string;
  fullName: string;
  idVille: number;
  idSecteur: number;
  created_at: string;
  updated_at: string;
  ville: {
    id: number;
    nameVille: string;
  };
  secteur: {
    id: number;
    nameSecteur: string;
  };
}

export interface Brand {
  id: number;
  brand_name: string;
  created_at: string;
  updated_at: string;
  categories?: Category[];
  products?: Product[];
}

export interface Category {
  id: number;
  category_name: string;
  brand_id: number;
  created_at: string;
  updated_at: string;
  brand?: Brand;
  products?: Product[];
}

export interface Product {
  id: number;
  product_Ref: string;
  product_libelle: string;
  prix_achat_colis: number;
  prix_achat_unite: number;
  prix_vente_colis: number;
  prix_vente_unite: number;
  brand_id: number;
  category_id: number;
  product_Poids: number;
  nombre_unite_par_colis: number;
  product_isActive: boolean;
  observation?: string | null;
  created_at: string;
  updated_at: string;
  brand?: Brand;
  category?: Category;
}

export interface Livreur {
  id: number;
  nom: string;
  telephone: string;
  created_at: string;
  updated_at: string;
}

export interface Transporteur {
  id: number;
  conducteur_name: string;
  vehicule_matricule: string;
  conducteur_cin: string;
  conducteur_telephone: string;
  vehicule_type: string;
  created_at: string;
  updated_at: string;
}
