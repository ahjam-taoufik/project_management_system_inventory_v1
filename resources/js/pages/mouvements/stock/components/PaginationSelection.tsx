"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Dispatch, SetStateAction } from "react";
import { PaginationType, PAGE_SIZE_ALL } from "../types";

export default function PaginationSelection({
  pagination,
  setPagination,
  onPageSizeChange
}: {
  pagination: PaginationType;
  setPagination: Dispatch<SetStateAction<PaginationType>>;
  onPageSizeChange?: (newSize: number) => void;
}) {
  const handleValueChange = (value: string) => {
    const numValue = Number(value);
    const newSize = numValue === -1 ? PAGE_SIZE_ALL : numValue;

    // Si une fonction de callback est fournie, l'utiliser
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    } else {
      // Sinon, utiliser le comportement par défaut
      setPagination((prev) => ({
        ...prev,
        pageSize: newSize,
      }));
    }
  };

  const getDisplayValue = () => {
    if (pagination.pageSize === PAGE_SIZE_ALL) {
      return "All";
    }
    return pagination.pageSize.toString();
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-gray-500 text-sm hidden sm:block">Lignes par page</div>
      <Select
        value={pagination.pageSize === PAGE_SIZE_ALL ? "-1" : pagination.pageSize.toString()}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="border rounded-md px-2 w-14">
          <SelectValue placeholder={getDisplayValue()} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="8">8</SelectItem>
          <SelectItem value="16">16</SelectItem>
          <SelectItem value="32">32</SelectItem>
          <SelectItem value="64">64</SelectItem>
          <SelectItem value="-1">Tous</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
