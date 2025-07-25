"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { IoClose } from "react-icons/io5";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiFirstPage, BiLastPage } from "react-icons/bi";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import PaginationSelection from "@/pages/client/components/PaginationSelection";
import { Badge } from "@/components/ui/badge";
import { CommercialDropDown } from "./CommercialDropDown";
import { VilleDropDown } from "./VilleDropDown";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  commerciaux?: Commercial[];
  villes?: Ville[];
}

type Commercial = {
  id: number;
  commercial_code: string;
  commercial_fullName: string;
};

type Ville = {
  id: number;
  nameVille: string;
};

export type PaginationType = {
  pageIndex: number;
  pageSize: number;
};

declare module "@tanstack/table-core" {
  interface FilterFns {
    multiSelect: FilterFn<unknown>;
    idMultiSelect: FilterFn<unknown>;
    globalSearch: FilterFn<unknown>;
  }
}

const multiSelectFilter: FilterFn<unknown> = (
  row,
  columnId,
  filterValue: string[]
) => {
  const rowValue = (row.getValue(columnId) as string).toLowerCase();
  const lowercaseFilterValues = filterValue.map((val) => val.toLowerCase());
  return filterValue.length === 0 || lowercaseFilterValues.includes(rowValue);
};

const idMultiSelectFilter: FilterFn<unknown> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (filterValue.length === 0) return true;

  const rowValue = row.getValue(columnId);
  // Convertir en string pour une comparaison cohérente
  const rowValueStr = String(rowValue);
  const filterValueStr = filterValue.map(val => String(val));

  return filterValueStr.includes(rowValueStr);
};

export function ClientTable<TData, TValue>({
  columns,
  data,
  commerciaux = [],
  villes = [],
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationType>({
    pageIndex: 0,
    pageSize: 8,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCommerciaux, setSelectedCommerciaux] = useState<string[]>([]);
  const [selectedVilles, setSelectedVilles] = useState<string[]>([]);

  useEffect(() => {
    setColumnFilters((prev) => {
      const baseFilters = prev.filter(
        (filter) => filter.id !== "status" && filter.id !== "category" && filter.id !== "idCommercial" && filter.id !== "idVille"
      );

      const newFilters = [...baseFilters];

      if (selectedStatuses.length > 0) {
        newFilters.push({
          id: "status",
          value: selectedStatuses,
        });
      }

      if (selectedCategories.length > 0) {
        newFilters.push({
          id: "category",
          value: selectedCategories,
        });
      }

      if (selectedCommerciaux.length > 0) {
        newFilters.push({
          id: "idCommercial",
          value: selectedCommerciaux,
        });
      }

      if (selectedVilles.length > 0) {
        newFilters.push({
          id: "idVille",
          value: selectedVilles,
        });
      }

      return newFilters;
    });

    setSorting([
      {
        id: "created_at",
        desc: true,
      },
    ]);
  }, [selectedStatuses, selectedCategories, selectedCommerciaux, selectedVilles]);

      // Fonction de filtrage personnalisée pour rechercher dans le nom et le code
  const globalFilterFn: FilterFn<unknown> = (row, columnId, filterValue: string) => {
    if (!filterValue) return true;

    const searchValue = filterValue.toLowerCase();
    const fullName = String(row.getValue("fullName") || "").toLowerCase();
    const code = String(row.getValue("code") || "").toLowerCase();

    return fullName.includes(searchValue) || code.includes(searchValue);
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      columnFilters,
      sorting,
    },
    filterFns: {
      multiSelect: multiSelectFilter,
      idMultiSelect: idMultiSelectFilter,
      globalSearch: globalFilterFn,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="poppins">
      <div className="flex flex-col gap-3 mb-8 mt-6">
        <div className="flex items-center justify-between">
          <Input
            value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              // Appliquer le filtre sur la colonne fullName qui utilise globalSearch
              table.getColumn("fullName")?.setFilterValue(value);
            }}
            placeholder="Rechercher par nom ou code..."
            className="max-w-sm h-10"
          />
          <div className="flex items-center gap-4">
            <CommercialDropDown
              selectedCommerciaux={selectedCommerciaux}
              setSelectedCommerciaux={setSelectedCommerciaux}
              commerciaux={commerciaux.map(c => ({ ...c, id: c.id.toString() }))}
            />
            <VilleDropDown
              selectedVilles={selectedVilles}
              setSelectedVilles={setSelectedVilles}
              villes={villes.map(v => ({ ...v, id: v.id.toString() }))}
            />
          </div>
        </div>

        <FilterArea
          selectedStatuses={selectedStatuses}
          setSelectedStatuses={setSelectedStatuses}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedCommerciaux={selectedCommerciaux}
          setSelectedCommerciaux={setSelectedCommerciaux}
          selectedVilles={selectedVilles}
          setSelectedVilles={setSelectedVilles}
          commerciaux={commerciaux}
          villes={villes}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} sur{" "}
          {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <PaginationSelection
            pagination={pagination}
            setPagination={setPagination}
          />
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Aller à la première page</span>
              <BiFirstPage className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Aller à la page précédente</span>
              <GrFormPrevious className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Aller à la page suivante</span>
              <GrFormNext className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Aller à la dernière page</span>
              <BiLastPage className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterArea({
  selectedStatuses,
  setSelectedStatuses,
  selectedCategories,
  setSelectedCategories,
  selectedCommerciaux,
  setSelectedCommerciaux,
  selectedVilles,
  setSelectedVilles,
  commerciaux,
  villes,
}: {
  selectedStatuses: string[];
  setSelectedStatuses: Dispatch<SetStateAction<string[]>>;
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  selectedCommerciaux: string[];
  setSelectedCommerciaux: Dispatch<SetStateAction<string[]>>;
  selectedVilles: string[];
  setSelectedVilles: Dispatch<SetStateAction<string[]>>;
  commerciaux: Commercial[];
  villes: Ville[];
}) {
  return (
    <div className="flex gap-3 poppins">
      {selectedStatuses.length > 0 && (
        <div className="border-dashed border rounded-sm p-1 flex gap-2 items-center px-2 text-sm">
          <span className="text-gray-600">Status</span>
          <Separator orientation="vertical" />
          <div className="flex gap-2 items-center">
            {selectedStatuses.length < 3 ? (
              <>
                {selectedStatuses.map((status, index) => (
                  <Badge key={index} variant={"secondary"}>
                    {status}
                  </Badge>
                ))}
              </>
            ) : (
              <>
                <Badge variant={"secondary"}>3 Selected</Badge>
              </>
            )}
          </div>
        </div>
      )}

      {selectedCategories.length > 0 && (
        <div className="border-dashed border rounded-sm p-1 flex gap-2 items-center px-2 text-sm">
          <span className="text-gray-600">category</span>
          <Separator orientation="vertical" />
          <div className="flex gap-2 items-center">
            {selectedCategories.length < 3 ? (
              <>
                {selectedCategories.map((category, index) => (
                  <Badge key={index} variant={"secondary"}>
                    {category}
                  </Badge>
                ))}
              </>
            ) : (
              <>
                <Badge variant={"secondary"}>3 Selected</Badge>
              </>
            )}
          </div>
        </div>
      )}

      {selectedCommerciaux.length > 0 && (
        <div className="border-dashed border rounded-sm p-1 flex gap-2 items-center px-2 text-sm">
          <span className="text-gray-600">Commercial</span>
          <Separator orientation="vertical" />
          <div className="flex gap-2 items-center">
            {selectedCommerciaux.length < 3 ? (
              <>
                {selectedCommerciaux.map((commercialId, index) => {
                  const commercial = commerciaux.find(c => c.id.toString() === commercialId);
                  return (
                    <Badge key={index} variant={"secondary"}>
                      {commercial?.commercial_code || commercialId}
                    </Badge>
                  );
                })}
              </>
            ) : (
              <>
                <Badge variant={"secondary"}>{selectedCommerciaux.length} Selected</Badge>
              </>
            )}
          </div>
        </div>
      )}

      {selectedVilles.length > 0 && (
        <div className="border-dashed border rounded-sm p-1 flex gap-2 items-center px-2 text-sm">
          <span className="text-gray-600">Ville</span>
          <Separator orientation="vertical" />
          <div className="flex gap-2 items-center">
            {selectedVilles.length < 3 ? (
              <>
                {selectedVilles.map((villeId, index) => {
                  const ville = villes.find(v => v.id.toString() === villeId);
                  return (
                    <Badge key={index} variant={"secondary"}>
                      {ville?.nameVille || villeId}
                    </Badge>
                  );
                })}
              </>
            ) : (
              <>
                <Badge variant={"secondary"}>{selectedVilles.length} Selected</Badge>
              </>
            )}
          </div>
        </div>
      )}

      {(selectedCategories.length > 0 || selectedStatuses.length > 0 || selectedCommerciaux.length > 0 || selectedVilles.length > 0) && (
        <Button
          onClick={() => {
            setSelectedCategories([]);
            setSelectedStatuses([]);
            setSelectedCommerciaux([]);
            setSelectedVilles([]);
          }}
          variant={"ghost"}
          className="p-1 px-2"
        >
          <span>Reset</span>
          <IoClose />
        </Button>
      )}
    </div>
  );
}
