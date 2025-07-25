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

import { HiOutlineLocationMarker } from "react-icons/hi";

type Ville = {
    id: string;
    nameVille: string;
};

type VilleDropDownProps = {
    selectedVilles: string[];
    setSelectedVilles: React.Dispatch<React.SetStateAction<string[]>>;
    villes: Ville[];
};

export function VilleDropDown({
    selectedVilles,
    setSelectedVilles,
    villes,
}: VilleDropDownProps) {
    const [open, setOpen] = React.useState(false);

    function handleCheckboxChange(villeId: string) {
        setSelectedVilles((prev) => {
            const updatedVilles = prev.includes(villeId)
                ? prev.filter((id) => id !== villeId)
                : [...prev, villeId];

            return updatedVilles;
        });
    }

    function clearFilters() {
        setSelectedVilles([]);
    }

    return (
        <div className="flex items-center space-x-4 poppins">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="secondary" className="h-10">
                        <HiOutlineLocationMarker />
                        Ville
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="p-0 w-64 poppins"
                    side="bottom"
                    align="center"
                >
                    <Command className="p-1">
                        <CommandInput placeholder="Rechercher une ville..." />
                        <CommandList>
                            <CommandEmpty className="text-slate-500 text-sm text-center p-5">
                                Aucune ville trouvée.
                            </CommandEmpty>
                            <CommandGroup>
                                {villes.map((ville) => (
                                    <CommandItem
                                        className="h-10 mb-2 flex items-center cursor-pointer"
                                        key={ville.id}
                                        value={ville.nameVille}
                                        onSelect={() => {
                                            handleCheckboxChange(ville.id);
                                        }}
                                    >
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={selectedVilles.includes(ville.id)}
                                                onCheckedChange={() => {
                                                    handleCheckboxChange(ville.id);
                                                }}
                                                className="size-4 rounded-[4px] mr-2"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-700">
                                                {ville.nameVille}
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
