"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

import {
    Command,
    CommandGroup,
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

import { HiOutlineUser } from "react-icons/hi";

type Commercial = {
    id: string;
    commercial_code: string;
    commercial_fullName: string;
};

type CommercialDropDownProps = {
    selectedCommerciaux: string[];
    setSelectedCommerciaux: React.Dispatch<React.SetStateAction<string[]>>;
    commerciaux: Commercial[];
};

export function CommercialDropDown({
    selectedCommerciaux,
    setSelectedCommerciaux,
    commerciaux,
}: CommercialDropDownProps) {
    const [open, setOpen] = React.useState(false);

    function handleCheckboxChange(commercialId: string) {
        setSelectedCommerciaux((prev) => {
            const updatedCommerciaux = prev.includes(commercialId)
                ? prev.filter((id) => id !== commercialId)
                : [...prev, commercialId];

            return updatedCommerciaux;
        });
    }

    function clearFilters() {
        setSelectedCommerciaux([]);
    }

    return (
        <div className="flex items-center space-x-4 poppins">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="secondary" className="h-10">
                        <HiOutlineUser />
                        Commercial
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="p-0 w-64 poppins"
                    side="bottom"
                    align="center"
                >
                    <Command className="p-1">
                        <CommandList>
                            <CommandGroup>
                                {commerciaux.map((commercial) => (
                                    <CommandItem
                                        className="h-10 mb-2 flex items-center"
                                        key={commercial.id}
                                        value={commercial.id}
                                        onSelect={() => handleCheckboxChange(commercial.id)}
                                    >
                                        <Checkbox
                                            checked={selectedCommerciaux.includes(commercial.id)}
                                            onCheckedChange={() => handleCheckboxChange(commercial.id)}
                                            className="size-4 rounded-[4px] mr-2"
                                        />
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="font-medium text-blue-600">
                                                {commercial.commercial_code}
                                            </span>
                                            <span className="text-gray-700">
                                                {commercial.commercial_fullName}
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
