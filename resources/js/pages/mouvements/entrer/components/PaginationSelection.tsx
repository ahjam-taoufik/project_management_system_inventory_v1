"use client";
import { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type PaginationType = {
  pageIndex: number;
  pageSize: number;
};

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
      <div className="text-gray-500 text-sm hidden sm:block">Rows per page</div>
      <Select
        value={pagination.pageSize === 999999 ? "-1" : pagination.pageSize.toString()}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="border rounded-md px-2 w-14">
          <SelectValue placeholder={getDisplayValue()} />
        </SelectTrigger>
        <SelectContent>
          {[4, 6, 8, 10, 15, 20, 30, -1].map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size === -1 ? "All" : `${size}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
