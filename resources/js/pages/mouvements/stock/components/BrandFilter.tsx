"use client";

import * as React from "react";
import { StockFilters } from "../types";

// Interface pour typer les props de la page

import { Button } from "@/components/ui/button";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

import { HiOutlineTag } from "react-icons/hi";
import { applyBrandFilters } from "../utils/inertia-api";
import { usePage } from "@inertiajs/react";

type Brand = {
    id: number;
    brand_name: string;
};

type BrandFilterProps = {
    selectedBrands: number[];
    setSelectedBrands: React.Dispatch<React.SetStateAction<number[]>>;
    brands: Brand[];
};

export function BrandFilter({
    selectedBrands,
    setSelectedBrands,
    brands,
}: BrandFilterProps) {
    const [open, setOpen] = React.useState(false);

    // Récupérer les filtres actuels
    const filters = (usePage().props as { filters?: StockFilters }).filters;

    function handleCheckboxChange(brandId: number) {
        console.log("Avant changement - selectedBrands:", selectedBrands);

        const updatedBrands = selectedBrands.includes(brandId)
            ? selectedBrands.filter((id) => id !== brandId)
            : [...selectedBrands, brandId];

        console.log("Après changement - updatedBrands:", updatedBrands);

        // Mettre à jour l'état local immédiatement pour une UI réactive
        setSelectedBrands(updatedBrands);

        // Appliquer les filtres sans rechargement complet grâce à Inertia
        applyBrandFilters(updatedBrands, filters ?? {});
    }

    function clearFilters() {
        // Mettre à jour l'état local immédiatement
        setSelectedBrands([]);

        // Appliquer un filtre vide sans rechargement complet
        applyBrandFilters([], filters ?? {});
    }

    return (
        <div className="flex items-center space-x-4 poppins">
            <Popover 
                open={open} 
                onOpenChange={(isOpen) => {
                    // Ajouter une gestion plus propre du focus
                    setOpen(isOpen);
                }}
            >
                <PopoverTrigger asChild>
                    <Button variant="secondary" className="h-10 flex items-center gap-2">
                        <HiOutlineTag />
                        <span>Marque</span>
                        {selectedBrands.length > 0 && (
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-medium">
                                {selectedBrands.length}
                            </span>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="p-0 w-64 poppins"
                    side="bottom"
                    align="center"
                >
                    <Command className="p-1">
                        <CommandInput placeholder="Rechercher une marque..." />
                        <CommandList>
                            <CommandEmpty className="text-slate-500 text-sm text-center p-5">
                                Aucune marque trouvée.
                            </CommandEmpty>
                            <CommandGroup>
                                {brands.map((brand) => (
                                    <CommandItem
                                        className="h-10 mb-2 flex items-center cursor-pointer"
                                        key={brand.id}
                                        value={brand.brand_name}
                                        onSelect={() => {}} // Désactiver la sélection automatique
                                    >
                                        <label 
                                            className="flex items-center gap-2 w-full cursor-pointer"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Checkbox
                                                checked={selectedBrands.includes(brand.id)}
                                                onCheckedChange={() => {
                                                    handleCheckboxChange(brand.id);
                                                }}
                                                className="size-4 rounded-[4px] mr-2"
                                                id={`brand-checkbox-${brand.id}`}
                                            />
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-700">
                                                {brand.brand_name}
                                            </span>
                                        </div>
                                        </label>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        <div className="flex flex-col gap-2 text-[23px]">
                            <Separator />
                            <Button
                                variant="ghost"
                                className="text-[12px] mb-1"
                                onClick={clearFilters}
                            >
                                Effacer les filtres
                            </Button>
                        </div>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
