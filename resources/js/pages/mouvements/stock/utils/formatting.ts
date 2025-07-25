// Utilitaires de formatage pour les stocks

/**
 * Formate un prix en format français avec deux décimales
 * @param value - Le prix à formater
 * @returns Prix formaté en chaîne de caractères
 */
export const formatPrix = (value: string | number | undefined | null): string => {
  if (value === null || value === undefined || value === "") return "0,00";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0,00";
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Formate un nombre en format français sans décimales
 * @param value - Le nombre à formater
 * @returns Nombre formaté en chaîne de caractères
 */
export const formatNombre = (value: string | number | undefined | null): string => {
  if (value === null || value === undefined || value === "") return "0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(num);
};

/**
 * Calcule le montant total (valeur * prix)
 * @param valeurStock - La valeur du stock
 * @param prix - Le prix unitaire
 * @returns Le montant total calculé
 */
export const calculerMontant = (valeurStock: string | number | null | undefined, prix: string | number | null | undefined): number => {
  const numValeur = valeurStock === null || valeurStock === undefined || valeurStock === "" 
    ? 0 
    : typeof valeurStock === "string" ? parseFloat(valeurStock) : valeurStock;

  const numPrix = prix === null || prix === undefined || prix === "" 
    ? 0 
    : typeof prix === "string" ? parseFloat(prix) : prix;

  return numValeur * numPrix;
};

/**
 * Formate une date en français
 * @param dateString - La date à formater (au format ISO)
 * @returns Date formatée en chaîne de caractères
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("fr-FR");
};
