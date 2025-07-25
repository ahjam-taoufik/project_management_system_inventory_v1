"use client";
import { useEffect } from "react";
import { usePage } from "@inertiajs/react";

/**
 * Composant pour déboguer les valeurs des totaux
 * Ce composant n'affiche rien, mais permet de logger les valeurs des totaux
 */
export function TotalsDebug() {
  const props = usePage().props as Record<string, unknown>;
  const totalMontantAchat = props.total_montant_achat as number;
  const totalMontantVente = props.total_montant_vente as number;
  const totalDiff = props.total_diff as number;
  const filters = props.filters as Record<string, unknown>;

  useEffect(() => {
    console.log("=== DEBUG TOTAUX ===");
    console.log("Total montant achat:", totalMontantAchat);
    console.log("Total montant vente:", totalMontantVente);
    console.log("Total différence:", totalDiff);
    console.log("Filtres appliqués:", filters);
    console.log("Props complets:", props);
    console.log("===================");
  }, [props, totalMontantAchat, totalMontantVente, totalDiff, filters]);

  // Ce composant ne rend rien
  return null;
}
