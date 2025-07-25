import { StockFilters } from "../types";

/**
 * Fonction simplifiée pour la navigation
 * Évite complètement Inertia.js pour contourner les problèmes de chargement infini
 */
export function navigateWithTotals(filters: StockFilters) {
  // Construction de l'URL avec les paramètres
  let url = route("stocks.index");

  // Ajouter les filtres comme paramètres d'URL
  if (filters && Object.keys(filters).length > 0) {
    // Transformer les tableaux en format spécial pour Laravel
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Pour les tableaux comme brand_ids
        value.forEach((item, index) => {
          queryParams.append(`${key}[${index}]`, String(item));
        });
      } else if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    // Ajouter les paramètres à l'URL
    const queryString = queryParams.toString();
    if (queryString) {
      url += "?" + queryString;
    }
  }

  // Redirection directe (méthode la plus simple et fiable)
  window.location.href = url;
}
