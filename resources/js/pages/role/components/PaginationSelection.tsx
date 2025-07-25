"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";

interface PaginationSelectionProps<TData> {
  table: Table<TData>;
}

export default function PaginationSelection<TData>({ table }: PaginationSelectionProps<TData>) {
  return (
    <Select
      value={`${table.getState().pagination.pageSize}`}
      onValueChange={(value) => {
        table.setPageSize(Number(value));
      }}
    >
      <SelectTrigger className="h-8 w-[70px]">
        <SelectValue placeholder={table.getState().pagination.pageSize} />
      </SelectTrigger>
      <SelectContent side="top">
        {[8, 10, 20, 30, 40, 50].map((pageSize) => (
          <SelectItem key={pageSize} value={`${pageSize}`}>
            {pageSize}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
