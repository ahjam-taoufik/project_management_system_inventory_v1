"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import PaginationSelection from "@/pages/product/components/PaginationSelection";
import { BrandFilter } from "./BrandFilter";
import { StatusFilter } from "./StatusFilter";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IoClose } from "react-icons/io5";
import type { Product, Brand } from "@/types";
import { motion, AnimatePresence } from 'framer-motion';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  brands?: Brand[];
  openProductId?: number | null;
  setOpenProductId?: (id: number | null) => void;
}

export interface PaginationType {
  pageIndex: number;
  pageSize: number;
}

export function ProductTable<TData extends Product, TValue>({
  columns,
  data,
  brands = [],
  openProductId,
  setOpenProductId
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationType>({
    pageIndex: 0,
    pageSize: 8,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  // État local pour l'accordéon si les props ne sont pas fournies
  const [localOpenProductId, setLocalOpenProductId] = useState<number | null>(null);

  // Utiliser les props ou l'état local
  const currentOpenProductId = openProductId !== undefined ? openProductId : localOpenProductId;
  const setCurrentOpenProductId = setOpenProductId || setLocalOpenProductId;

  useEffect(() => {
    setSorting([
      {
        id: "product_libelle",
        desc: true,
      },
    ]);
  }, []);

  // Filter data based on selected brands and status
  const filteredData = React.useMemo(() => {
    let result = data;
    if (selectedBrands.length > 0) {
      result = result.filter((product) => selectedBrands.includes(product.brand_id));
    }
    if (selectedStatus.length > 0) {
      result = result.filter((product) => {
        // Utiliser le champ product_isActive du type Product
        if (selectedStatus.includes("active") && product.product_isActive === true) return true;
        if (selectedStatus.includes("inactive") && product.product_isActive === false) return true;
        return false;
      });
    }
    return result;
  }, [data, selectedBrands, selectedStatus]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      pagination,
      columnFilters,
      sorting,
    },
    filterFns: {
      multiSelect: () => true,
      idMultiSelect: () => true,
      globalSearch: () => true,
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
      <div className="flex flex-col gap-3 mb-8 mt-6 ">
        <FilterArea
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          brands={brands}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        {/* Affichage du nombre de produits filtrés */}
        <div className="mb-2 text-sm text-gray-700 font-medium">
          {(
            selectedBrands.length > 0 ||
            selectedStatus.length > 0 ||
            (table.getColumn("product_Ref")?.getFilterValue() && (table.getColumn("product_Ref")?.getFilterValue() as string).trim() !== "") ||
            (table.getColumn("product_libelle")?.getFilterValue() && (table.getColumn("product_libelle")?.getFilterValue() as string).trim() !== "")
          ) ? (
            `${filteredData.length} produits filtrés`
          ) : (
            "Aucun filtre actif"
          )}
        </div>

        <div className="flex items-center justify-between ">
          <div className="flex gap-2 max-w-lg">
            <Input
              value={(table.getColumn("product_Ref")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("product_Ref")?.setFilterValue(event.target.value)
              }
              placeholder="Rechercher par référence..."
              className="max-w-sm h-10"
            />
            <Input
              value={(table.getColumn("product_libelle")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("product_libelle")?.setFilterValue(event.target.value)
              }
              placeholder="Rechercher par libellé..."
              className="max-w-sm h-10"
            />
          </div>
          <div className="flex gap-2">
            <BrandFilter
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              brands={brands}
            />
            <StatusFilter
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => {
                const product = row.original as Product;
                const isEven = index % 2 === 0;
                return (
                  <React.Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className={`${isEven ? "bg-white" : "bg-gray-50 hover:bg-gray-100"} cursor-pointer`}
                                            onClick={(e) => {
                        // Empêcher la propagation des événements de clic
                        e.stopPropagation();

                        if (setCurrentOpenProductId) {
                          setCurrentOpenProductId(currentOpenProductId === product.id ? null : product.id);
                        }
                      }}
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
                    <AnimatePresence initial={false}>
                      {currentOpenProductId === product.id && (
                        <TableRow key={`details-${product.id}`}>
                          <TableCell colSpan={columns.length + 1} className="bg-gray-50 p-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div className="p-4 text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div><span className="font-semibold">Référence :</span> {product.product_Ref}</div>
                                <div><span className="font-semibold">Libellé :</span> {product.product_libelle}</div>
                                <div><span className="font-semibold">Prix achat colis :</span> {product.prix_achat_colis} </div>
                                <div><span className="font-semibold">Prix achat unité :</span> {product.prix_achat_unite} </div>
                                <div><span className="font-semibold">Prix vente colis :</span> {product.prix_vente_colis} </div>
                                <div><span className="font-semibold">Prix vente unité :</span> {product.prix_vente_unite} </div>
                                <div><span className="font-semibold">Poids :</span> {product.product_Poids} </div>
                                <div><span className="font-semibold">Unités/colis :</span> {product.nombre_unite_par_colis} </div>
                                <div><span className="font-semibold">Observation :</span> {product.observation || "-"} </div>
                                <div><span className="font-semibold">Marque :</span> {product.brand?.brand_name || product.brand_id} </div>
                                <div><span className="font-semibold">Catégorie :</span> {product.category?.category_name || product.category_id} </div>
                              </div>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  Aucun produit trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <PaginationSelection
          pagination={pagination}
          setPagination={setPagination}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <BiFirstPage />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <GrFormPrevious />
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <GrFormNext />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <BiLastPage />
          </Button>
        </div>
      </div>
    </div>
  );
}

function FilterArea({
  selectedBrands,
  setSelectedBrands,
  brands,
  selectedStatus,
  setSelectedStatus,
}: {
  selectedBrands: number[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<number[]>>;
  brands: Brand[];
  selectedStatus: string[];
  setSelectedStatus: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <div className="flex gap-3 poppins">
      {selectedBrands.length > 0 && (
        <div className="border-dashed border rounded-sm p-1 flex gap-2 items-center px-2 text-sm">
          <span className="text-gray-600">Marque</span>
          <Separator orientation="vertical" />
          <div className="flex gap-2 items-center">
            {selectedBrands.length < 3 ? (
              <>
                {selectedBrands.map((brandId, index) => {
                  const brand = brands.find(b => b.id === brandId);
                  return (
                    <Badge key={index} variant={"secondary"}>
                      {brand?.brand_name || brandId}
                    </Badge>
                  );
                })}
              </>
            ) : (
              <>
                <Badge variant={"secondary"}>{selectedBrands.length} Selected</Badge>
              </>
            )}
          </div>
        </div>
      )}
      {selectedStatus.length > 0 && (
        <div className="border-dashed border rounded-sm p-1 flex gap-2 items-center px-2 text-sm">
          <span className="text-gray-600">Status</span>
          <Separator orientation="vertical" />
          <div className="flex gap-2 items-center">
            {selectedStatus.length < 3 ? (
              <>
                {selectedStatus.map((status, index) => (
                  <Badge key={index} variant={"secondary"}>
                    {status === "active" ? "Actif" : "Inactif"}
                  </Badge>
                ))}
              </>
            ) : (
              <>
                <Badge variant={"secondary"}>{selectedStatus.length} Selected</Badge>
              </>
            )}
          </div>
        </div>
      )}
      {(selectedBrands.length > 0 || selectedStatus.length > 0) && (
        <Button
          onClick={() => {
            setSelectedBrands([]);
            setSelectedStatus([]);
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
