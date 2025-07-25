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
import { MdOutlineToggleOn } from "react-icons/md";

const STATUS_OPTIONS = [
    { id: "active", label: "Actif" },
    { id: "inactive", label: "Inactif" },
];

type StatusFilterProps = {
    selectedStatus: string[];
    setSelectedStatus: React.Dispatch<React.SetStateAction<string[]>>;
};

export function StatusFilter({
    selectedStatus,
    setSelectedStatus,
}: StatusFilterProps) {
    const [open, setOpen] = React.useState(false);

    function handleCheckboxChange(statusId: string) {
        setSelectedStatus((prev) => {
            const updated = prev.includes(statusId)
                ? prev.filter((id) => id !== statusId)
                : [...prev, statusId];
            return updated;
        });
    }

    function clearFilters() {
        setSelectedStatus([]);
    }

    return (
        <div className="flex items-center space-x-4 poppins">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="secondary" className="h-10">
                        <MdOutlineToggleOn />
                        Status
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-64 poppins" side="bottom" align="center">
                    <Command className="p-1">
                        <CommandInput placeholder="Rechercher un status..." />
                        <CommandList>
                            <CommandEmpty className="text-slate-500 text-sm text-center p-5">
                                Aucun status trouvé.
                            </CommandEmpty>
                            <CommandGroup>
                                {STATUS_OPTIONS.map((status) => (
                                    <CommandItem
                                        className="h-10 mb-2 flex items-center cursor-pointer"
                                        key={status.id}
                                        value={status.label}
                                        onSelect={() => handleCheckboxChange(status.id)}
                                    >
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={selectedStatus.includes(status.id)}
                                                onCheckedChange={() => handleCheckboxChange(status.id)}
                                                className="size-4 rounded-[4px] mr-2"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-700">{status.label}</span>
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
