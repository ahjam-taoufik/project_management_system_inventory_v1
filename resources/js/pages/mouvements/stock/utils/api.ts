/**
 * Fonctions utilitaires pour les appels API
 */

import { router } from "@inertiajs/react";

/**
 * Récupérer les données de stock avec filtres
 * Cette fonction s'assure de rafraîchir tous les totaux
 */
export function fetchStockData(filters: Record<string, unknown>) {
  console.log("Filtrage avec:", filters);

  const formData = new FormData();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  return router.visit(route("stocks.index"), {
    data: formData,
    preserveState: true,
    only: ['stocks', 'total_montant_achat', 'total_montant_vente', 'total_diff', 'filters'],
    replace: true,
    onBefore: () => {
      console.log("Début du chargement");
      // Vous pouvez ajouter un état de chargement ici
    },
    onSuccess: (page) => {
      console.log("Données mises à jour avec succès:", page.props);
      // Vous pouvez mettre à jour l'UI ici
    },
    onError: (errors) => {
      console.error("Erreur lors de la mise à jour des données:", errors);
    },
    onFinish: () => {
      console.log("Chargement terminé");
    }
  });
}

/**
 * Fonction pour récupérer les données paginées de stock avec filtres
 */
export function fetchPaginatedStockData(filters: Record<string, unknown>) {
  console.log("Pagination avec filtres:", filters);

  const formData = new FormData();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  return router.visit(route("stocks.index"), {
    data: formData,
    preserveState: true,
    only: ['stocks', 'total_montant_achat', 'total_montant_vente', 'total_diff', 'filters'],
    replace: true,
    onSuccess: (page) => {
      console.log("Mise à jour réussie avec nouveaux totaux:", page);
    },
    onError: (errors) => {
      console.error("Erreur lors de la mise à jour des données:", errors);
    }
  });
}
