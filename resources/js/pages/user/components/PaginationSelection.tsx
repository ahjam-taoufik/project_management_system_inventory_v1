"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { PaginationType } from "./UserTable";
import { Dispatch, SetStateAction } from "react";

interface PaginationSelectionProps {
  pagination: PaginationType;
  setPagination: Dispatch<SetStateAction<PaginationType>>;
}

export default function PaginationSelection({
  pagination,
  setPagination,
}: PaginationSelectionProps) {
  const pageSizeOptions = [5, 8, 10, 20, 30, 40, 50];

  return (
    <div className="flex items-center space-x-2">
      <p className="text-sm font-medium">Lignes par page</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-8 w-[70px] lg:w-[100px] justify-between"
          >
            {pagination.pageSize}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {pageSizeOptions.map((size) => (
            <DropdownMenuItem
              key={size}
              onClick={() =>
                setPagination((prev) => ({ ...prev, pageSize: size, pageIndex: 0 }))
              }
            >
              {size}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
