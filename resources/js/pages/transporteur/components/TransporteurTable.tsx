"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { IoClose } from "react-icons/io5";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiFirstPage, BiLastPage } from "react-icons/bi";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

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
import PaginationSelection from "./PaginationSelection";
import { Badge } from "@/components/ui/badge";
import { TransporteurDropDown } from "./TransporteurDropDown";
import { TransporteurEditDialog } from "./TransporteurEditDialog";

interface DataTableProps<TData, TValue> {
  data: TData[];
}

export interface PaginationType {
  pageIndex: number;
  pageSize: number;
}

// Fonction de filtre multi-sélection
const multiSelectFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const rowValue = (row.getValue(columnId) as string).toLowerCase();
  const lowercaseFilterValues = filterValue.map((val: string) => val.toLowerCase());
  return filterValue.length === 0 || lowercaseFilterValues.includes(rowValue);
};

// Composant pour les actions
function TransporteurActions({ transporteur }: { transporteur: any }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleEdit = () => {
    setIsEditDialogOpen(true);
    setIsDropdownOpen(false); // Fermer le dropdown quand on ouvre le dialogue
  };

  return (
    <div className="flex items-center gap-2">
      <TransporteurDropDown
        transporteur={transporteur}
        onEdit={handleEdit}
        open={isDropdownOpen}
        onOpenChange={setIsDropdownOpen}
      />
      <TransporteurEditDialog
        transporteur={transporteur}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
}

export function TransporteurTable<TData, TValue>({
  data,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationType>({
    pageIndex: 0,
    pageSize: 8,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    setColumnFilters((prev) => {
      const baseFilters = prev.filter(
        (filter) => filter.id !== "status" && filter.id !== "category"
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

      return newFilters;
    });

    setSorting([
      {
        id: "conducteur_name",
        desc: false,
      },
    ]);
  }, [selectedStatuses, selectedCategories]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "conducteur_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            Conducteur
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("conducteur_name")}</div>,
    },
    {
      accessorKey: "vehicule_matricule",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            Matricule
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("vehicule_matricule")}</div>,
    },
    {
      accessorKey: "conducteur_cin",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            CIN
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("conducteur_cin")}</div>,
    },
    {
      accessorKey: "conducteur_telephone",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            Téléphone
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("conducteur_telephone")}</div>,
    },
    {
      accessorKey: "vehicule_type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            Type de véhicule
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("vehicule_type")}</Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const transporteur = row.original;
        return <TransporteurActions transporteur={transporteur} />;
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      columnFilters,
      sorting,
      globalFilter,
    },
    filterFns: {
      multiSelect: multiSelectFilter,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const conducteurName = row.getValue('conducteur_name') as string;
      const matricule = row.getValue('vehicule_matricule') as string;
      const searchValue = filterValue.toLowerCase();

      return conducteurName.toLowerCase().includes(searchValue) ||
             matricule.toLowerCase().includes(searchValue);
    },
  });

  return (
    <div className="poppins">
      <div className="flex flex-col gap-3 mb-8 mt-6">
        <div className="flex items-center justify-between">
          <Input
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder="Rechercher par nom ou matricule..."
            className="max-w-sm h-10"
          />
        </div>
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

      <div className="flex items-center justify-between mt-5">
        <PaginationSelection
          pagination={pagination}
          setPagination={setPagination}
        />

        <div className="flex gap-6 items-center">
          <span className="text-sm text-gray-500 hidden sm:block">
            {pagination.pageSize === 999999 ?
              `Affichage de tous les ${data.length} résultats` :
              `Page ${pagination.pageIndex + 1} sur ${table.getPageCount()}`
            }
          </span>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              className="size-9 w-12"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage() || pagination.pageSize === 999999}
            >
              <BiFirstPage />
            </Button>

            <Button
              variant="outline"
              className="size-9 w-12"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || pagination.pageSize === 999999}
            >
              <GrFormPrevious />
            </Button>

            <Button
              className="size-9 w-12"
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || pagination.pageSize === 999999}
            >
              <GrFormNext />
            </Button>

            <Button
              className="size-9 w-12"
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage() || pagination.pageSize === 999999}
            >
              <BiLastPage />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
