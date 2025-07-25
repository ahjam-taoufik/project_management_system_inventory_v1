"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Dispatch, SetStateAction } from "react";
import { PaginationType } from "./ClientTable";

export default function PaginationSelection({
  pagination,
  setPagination,
}: {
  pagination: PaginationType;
  setPagination: Dispatch<SetStateAction<PaginationType>>;
}) {
  const handleValueChange = (value: string) => {
    const numValue = Number(value);

    setPagination((prev) => ({
      ...prev,
      pageSize: numValue === -1 ? 999999 : numValue,
    }));
  };

  const getDisplayValue = () => {
    if (pagination.pageSize === 999999) {
      return "All";
    }
    return pagination.pageSize.toString();
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-gray-500 text-sm hidden sm:block">Lignes par page</div>
      <Select
        value={pagination.pageSize === 999999 ? "-1" : pagination.pageSize.toString()}
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
          <SelectItem value="-1">All</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
