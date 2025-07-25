import { usePage } from "@inertiajs/react";
import { StockFilters } from "../types";

// Interface pour typer les props de la page
interface StockPageProps {
  filters: StockFilters;
  // Autres props peuvent être ajoutées si nécessaire
}

export function DebugFilters() {
  // Utiliser une méthode plus sûre avec une vérification de type partielle
  const pageProps = usePage().props;
  const props: StockPageProps = {
    filters: pageProps.filters || {} as StockFilters
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "10px",
      right: "10px",
      background: "rgba(0,0,0,0.7)",
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      fontSize: "12px",
      maxWidth: "400px",
      zIndex: 9999,
      maxHeight: "200px",
      overflow: "auto"
    }}>
      <h3>Debug Filtres:</h3>
      <pre>{JSON.stringify(props.filters, null, 2)}</pre>
    </div>
  );
}
