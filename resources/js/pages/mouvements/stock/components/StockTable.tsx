"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import {  changePage, applySearchFilter } from "../utils/inertia-api";
import { StockValueFilter } from "./StockValueFilter";
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
import { useEffect, useState, useMemo } from "react";
import PaginationSelection from "./PaginationSelection";
import { usePage } from "@inertiajs/react";
import { BrandFilter } from "./BrandFilter";
import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingIndicator } from "./LoadingIndicator";
import {
  Stock,
  ProductForBrand,
  StockFilters,
  PaginationType,
  PAGE_SIZE_ALL
} from "../types";

interface DataTableProps {
  columns?: ColumnDef<Stock>[];
  data?: Stock[];
}

export function StockTable({ columns = [], data = [] }: DataTableProps) {
  // Appeler usePage de façon inconditionnelle pour respecter les règles des hooks React
  const page = usePage();
  const props: Record<string, unknown> = page.props as Record<string, unknown>;

  // Récupérer les valeurs avec des valeurs par défaut
  const filters = (props.filters || {}) as StockFilters;
  const products = useMemo(() => (props.products || []) as ProductForBrand[], [props.products]);
  const totalMontantAchat = (props.total_montant_achat || 0) as number;
  const totalMontantVente = (props.total_montant_vente || 0) as number;
  const totalDiff = (props.total_diff || 0) as number;
  const [pagination, setPagination] = useState<PaginationType>({
    pageIndex: 0,
    pageSize: PAGE_SIZE_ALL, // "Tous" par défaut
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // Initialiser selectedBrands à partir de localStorage ou des filtres
  const [selectedBrands, setSelectedBrands] = useState<number[]>(() => {
    // Essayer d'abord de récupérer depuis localStorage
    const storedBrands = localStorage.getItem('selectedBrands');
    if (storedBrands) {
      try {
        const parsedBrands = JSON.parse(storedBrands);
        console.log("Marques récupérées depuis localStorage:", parsedBrands);
        return parsedBrands;
      } catch (e) {
        console.error("Erreur lors de la récupération des marques depuis localStorage:", e);
      }
    }

    // Sinon, essayer depuis les filtres
    if (filters && filters.brand_ids) {
      // Convertir en tableau si c'est une valeur unique
      const brandIds = Array.isArray(filters.brand_ids) ? filters.brand_ids : [filters.brand_ids];
      const numericBrands = brandIds.map(id => Number(id));
      console.log("Marques récupérées depuis les filtres:", numericBrands);
      return numericBrands;
    }

    return [];
  });
  const [search, setSearch] = useState(filters?.search ?? "");
  const [stockValueFilter, setStockValueFilter] = useState<string | undefined>(() => {
    // Initialiser depuis les filtres si disponible
    return filters?.stock_value_filter;
  });

  // Générer la liste des marques à partir des produits
  const brands = useMemo(() => {
    const brandMap = new Map<number, string>();
    products.forEach((p) => {
      if (p.brand_id && p.brand && p.brand.brand_name) {
        brandMap.set(p.brand_id, p.brand.brand_name);
      }
    });
    return Array.from(brandMap, ([id, brand_name]) => ({ id, brand_name }));
  }, [products]);

  // Fonction pour appliquer les filtres
  const applyFilters = () => {
    try {
      // Construire l'objet de filtres complet
      const updatedFilters = {
        ...filters,
        brand_ids: selectedBrands.length > 0 ? selectedBrands : undefined,
        stock_value_filter: stockValueFilter
      };

      // Appliquer la recherche et autres filtres via notre API optimisée pour React
      applySearchFilter(search, updatedFilters);
    } catch (error) {
      console.error("Erreur lors de l'application des filtres:", error);
    }
  };

  // Recherche avec touche Entrée
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  };

  useEffect(() => {
    setSorting([
      {
        id: "product.product_libelle",
        desc: false,
      },
    ]);
  }, []);

  // Fonction pour changer de page avec notre API optimisée
  const handlePageChange = (newPage: number, newPageSize: number) => {
    try {
      // Mettre à jour l'état local immédiatement pour une UI réactive
      setPagination(prev => ({
        ...prev,
        pageIndex: newPage,
        pageSize: newPageSize
      }));

      // Utiliser notre API optimisée pour changer de page sans rechargement complet
      changePage(newPage, newPageSize, {
        ...filters,
        brand_ids: selectedBrands.length > 0 ? selectedBrands : undefined,
        search: search || undefined,
        stock_value_filter: stockValueFilter
      });
    } catch (error) {
      console.error("Erreur lors du changement de page:", error);
    }
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
      {/* Indicateur de chargement */}
      <LoadingIndicator />
      {/* Totaux globaux en cards en haut du tableau */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 mt-2">
        <Card className="flex-1 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-blue-700">
              Total Montant achat
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-blue-700 text-right">
            {totalMontantAchat.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true })} DH
          </CardContent>
        </Card>
        <Card className="flex-1 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-green-700">
              Total Montant vente
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-green-700 text-right">
            {totalMontantVente.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true })} DH
          </CardContent>
        </Card>
        <Card className="flex-1 bg-gray-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">
              Différence
            </CardTitle>
          </CardHeader>
          <CardContent className={`text-2xl font-bold text-right ${totalDiff >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {totalDiff.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true })} DH
          </CardContent>
        </Card>
      </div>
      {/* Zone de recherche et filtre marque alignés */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            placeholder="Rechercher..."
            className="max-w-sm h-10"
          />
          <Button
            onClick={applyFilters}
            className="h-10"
            variant="default"
          >
            Filtrer
          </Button>
          <StockValueFilter
            value={stockValueFilter}
            onChange={setStockValueFilter}
          />
        </div>
        <BrandFilter
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          brands={brands}
        />
      </div>
      <div className="rounded-md border bg-white overflow-hidden">
        <div
          className="max-h-[60vh] overflow-y-auto bg-white"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#CBD5E0 #F7FAFC'
          }}
        >
          <Table>
            <TableHeader className="sticky top-0 bg-gradient-to-r from-slate-100 to-slate-200 z-30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b">
                  {headerGroup.headers.map((header) => {
                    const isSorted = header.column.getIsSorted();
                    return (
                      <TableHead
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={`${header.column.getCanSort() ? "cursor-pointer select-none hover:bg-slate-300/50" : ""} bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 font-semibold sticky top-0`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                          {header.column.getCanSort() && (
                            <span className="ml-1">
                              {isSorted === "asc" ? (
                                <ArrowUp size={14} />
                              ) : isSorted === "desc" ? (
                                <ArrowDown size={14} />
                              ) : (
                                <ChevronsUpDown size={14} className="opacity-40" />
                              )}
                            </span>
                          )}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={Array.isArray(columns) ? columns.length : 1} className="h-24 text-center">
                    Aucun résultat.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <PaginationSelection
          pagination={pagination}
          setPagination={setPagination}
          onPageSizeChange={(newSize) => {
            setPagination((prev) => ({ ...prev, pageSize: newSize, pageIndex: 0 }));
            handlePageChange(0, newSize);
          }}
        />
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                setPagination(prev => ({ ...prev, pageIndex: 0 }));
                handlePageChange(0, pagination.pageSize);
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Aller à la première page</span>
              <BiFirstPage className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                const newPage = pagination.pageIndex - 1;
                if (newPage >= 0) {
                  setPagination(prev => ({ ...prev, pageIndex: newPage }));
                  handlePageChange(newPage, pagination.pageSize);
                }
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Aller à la page précédente</span>
              <GrFormPrevious className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                const newPage = pagination.pageIndex + 1;
                setPagination(prev => ({ ...prev, pageIndex: newPage }));
                handlePageChange(newPage, pagination.pageSize);
              }}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Aller à la page suivante</span>
              <GrFormNext className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                const lastPage = table.getPageCount() - 1;
                setPagination(prev => ({ ...prev, pageIndex: lastPage }));
                handlePageChange(lastPage, pagination.pageSize);
              }}
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
