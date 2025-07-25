"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProtectedComboboxProps {
  items: Array<{
    id: string | number;
    label: string;
    subLabel?: string;
    isActive?: boolean;
  }>;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
}

export default function ProtectedCombobox({
  items,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Sélectionnez...",
  searchPlaceholder = "Rechercher...",
  className
}: ProtectedComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedItem = items.find(item => item.id.toString() === value);

  // Filtrer les éléments basé sur la recherche
  const filteredItems = items.filter(item => {
    if (!searchValue) return true;
    const searchLower = searchValue.toLowerCase();
    return (
      item.label.toLowerCase().includes(searchLower) ||
      (item.subLabel && item.subLabel.toLowerCase().includes(searchLower))
    );
  });

  const handleItemSelect = (itemId: string) => {
    const item = items.find(i => i.id.toString() === itemId);
    if (item && (item.isActive !== false)) {
      onValueChange(itemId);
      setOpen(false);
      setSearchValue("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div
      className={cn("relative", className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between h-10 sm:h-11"
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        {selectedItem ? (
          <span className={cn(
            "truncate",
            selectedItem.isActive === false && "text-gray-400"
          )}>
            {selectedItem.label}
            {selectedItem.isActive === false && " (inactif)"}
          </span>
        ) : (
          placeholder
        )}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div
          className="absolute bottom-full left-0 right-0 z-50 mb-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-[300px] overflow-hidden"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="p-2 border-b bg-gray-50">
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleInputChange}
              className="mb-2"
              autoFocus
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
            />
          </div>
          <div className="max-h-[250px] overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                Chargement...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                Aucun élément trouvé.
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center gap-2 p-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100",
                    item.isActive === false && "opacity-50 cursor-not-allowed",
                    value === item.id.toString() && "bg-blue-100"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleItemSelect(item.id.toString());
                  }}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      value === item.id.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className={cn(
                      "truncate font-medium",
                      item.isActive === false && "text-gray-400"
                    )}>
                      {item.label}
                    </span>
                    {item.subLabel && (
                      <span className="text-xs text-gray-500 truncate">
                        {item.subLabel}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
