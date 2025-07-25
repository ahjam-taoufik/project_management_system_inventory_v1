import React from "react";
import { usePage } from "@inertiajs/react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { applyStockValueFilter } from "../utils/inertia-api";
import { TbArrowBigUpLines, TbArrowBigDownLines, TbEqual } from "react-icons/tb";

type StockValueFilterProps = {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

export function StockValueFilter({ value, onChange }: StockValueFilterProps) {
  const filters = (usePage().props as { filters?: Record<string, string> }).filters ?? {};

  const handleValueChange = (newValue: string) => {
    // Si "all" est sélectionné, on considère qu'il n'y a pas de filtre
    const filterValue = newValue === "all" ? undefined : newValue;

    // Mettre à jour l'état local
    onChange(filterValue);

    // Appliquer le filtre
    applyStockValueFilter(filterValue, filters);
  };

  // Convertir undefined en "all" pour l'affichage
  const displayValue = value || "all";

  return (
    <div className="flex items-center space-x-2">
      <Select value={displayValue} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrer par valeur" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Valeur de stock</SelectLabel>
            <SelectItem value="all">Tous les produits</SelectItem>
            <SelectItem value="positive">
              <div className="flex items-center gap-2">
                <TbArrowBigUpLines className="text-green-600" />
                <span>Valeur positive</span>
              </div>
            </SelectItem>
            <SelectItem value="negative">
              <div className="flex items-center gap-2">
                <TbArrowBigDownLines className="text-red-600" />
                <span>Valeur négative</span>
              </div>
            </SelectItem>
            <SelectItem value="zero">
              <div className="flex items-center gap-2">
                <TbEqual className="text-gray-600" />
                <span>Valeur zéro</span>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
