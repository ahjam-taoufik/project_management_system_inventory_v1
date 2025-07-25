"use client";

import * as React from "react";
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

    function handleCheckboxChange(brandId: number) {
        setSelectedBrands((prev) => {
            const updatedBrands = prev.includes(brandId)
                ? prev.filter((id) => id !== brandId)
                : [...prev, brandId];

            return updatedBrands;
        });
    }

    function clearFilters() {
        setSelectedBrands([]);
    }

    return (
        <div className="flex items-center space-x-4 poppins">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="secondary" className="h-10">
                        <HiOutlineTag />
                        Marque
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
                                        onSelect={() => {
                                            handleCheckboxChange(brand.id);
                                        }}
                                    >
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={selectedBrands.includes(brand.id)}
                                                onCheckedChange={() => {
                                                    handleCheckboxChange(brand.id);
                                                }}
                                                className="size-4 rounded-[4px] mr-2"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-700">
                                                {brand.brand_name}
                                            </span>
                                        </div>
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
                                Clear Filters
                            </Button>
                        </div>
                                        </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
