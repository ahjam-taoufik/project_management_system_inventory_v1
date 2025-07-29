"use client";
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  dropdownDirection?: 'up' | 'down';
}

export default function ProtectedCombobox({
  items,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Sélectionnez...",
  searchPlaceholder = "Rechercher...",
  className,
  dropdownDirection = 'down'
}: ProtectedComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const comboboxRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedItem = items.find(item => {
    const itemIdStr = item.id.toString();
    const valueStr = value.toString();
    return itemIdStr === valueStr;
  });

  // Calculer la position du dropdown
  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 300; // hauteur max du dropdown
      
      let top = rect.bottom + window.scrollY + 4; // position par défaut (vers le bas)
      
      // Si dropdownDirection est 'up' ou si pas assez d'espace en bas
      if (dropdownDirection === 'up' || (window.innerHeight - rect.bottom < dropdownHeight && rect.top > dropdownHeight)) {
        top = rect.top + window.scrollY - dropdownHeight - 4;
      }
      
      setDropdownPosition({
        top,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  // Gérer le clic en dehors pour fermer la liste
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearchValue("");
      }
    }

    function handleScroll() {
      if (open) {
        updateDropdownPosition();
      }
    }

    function handleResize() {
      if (open) {
        updateDropdownPosition();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [open]);

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
    if (item) {
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
      ref={comboboxRef}
      className={cn("relative", className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Button
        ref={buttonRef}
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between h-10 sm:h-11"
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!open) {
            updateDropdownPosition();
          }
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
          className={cn(
            "absolute z-[9999] bg-white border border-gray-200 rounded-md shadow-lg max-h-[300px] overflow-hidden w-full",
            dropdownDirection === 'up' ? "bottom-full mb-1" : "top-full mt-1"
          )}
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
              filteredItems.map((item) => {
                const isInactive = item.isActive === false;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-2 p-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 transition-colors duration-150",
                      isInactive && "opacity-50 cursor-not-allowed",
                      value === item.id.toString() && "bg-blue-100"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleItemSelect(item.id.toString());
                    }}
                    onMouseDown={() => {
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
                        isInactive && "text-gray-400"
                      )}>
                        {item.label || `Item ${item.id}`}
                      </span>
                      {item.subLabel && (
                        <span className="text-xs text-gray-500 truncate">
                          {item.subLabel}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
