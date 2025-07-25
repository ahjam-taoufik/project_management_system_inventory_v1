# Module Creation Patterns - Quick Reference

## Overview
This document provides quick reference patterns for creating new CRUD modules in the application. These patterns ensure consistency, speed up development, and maintain code quality.

## Quick Start Checklist

### Backend Setup (Laravel)
- [ ] Create Model with relationships
- [ ] Create Migration with proper constraints
- [ ] Create Controller with CRUD methods
- [ ] Create FormRequest for validation
- [ ] Create Policy for authorization
- [ ] Add routes to web.php
- [ ] Create Seeder (if needed)
- [ ] Add permissions to PermissionSeeder

### Frontend Setup (React/TypeScript)
- [ ] Create index.tsx (main page)
- [ ] Create AppTable.tsx (table wrapper)
- [ ] Create components/[Entity]Dialog.tsx (create modal)
- [ ] Create components/[Entity]EditDialog.tsx (edit modal)
- [ ] Create components/[Entity]DropDown.tsx (row actions)
- [ ] Create components/[Entity]Table.tsx (data table)
- [ ] Create components/PaginationSelection.tsx (if not exists)
- [ ] Create config/columns.tsx (column definitions)

## Pattern Templates

### 1. Index Page Template
```tsx
"use client";
import AppTable from '@/pages/[entity]/AppTable';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage [Entity]',
        href: '/[entities]',
    },
];

export default function Index() {
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {
        setIsLoad(true);
    }, []);

    if (!isLoad) return null;

    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={true}
                gutter={8}
                toastOptions={{
                    className: '',
                    duration: 4000,
                    removeDelay: 1000,
                    style: {
                        border: '1px solid #713200',
                        padding: '16px',
                        color: '#713200',
                    },
                }}
            />
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="[Entity]" />
                <div className="poppins p-5 border w-full min-h-screen">
                    <Card className='flex flex-col shadow-none p-5'>
                        <AppTable />
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
```

### 2. AppTable Template
```tsx
"use client";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import [Entity]Dialog from "./components/[Entity]Dialog";
import { columns } from "./config/columns";
import { [Entity]Table } from "./components/[Entity]Table";
import type { [Entity] } from "./config/columns";
import { useEffect } from "react";

export default function AppTable() {
    const { props: { [entities] } } = usePage();
    const [entities]Array = [entities] as [Entity][];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                document.getElementById('add-[entity]-button')?.click();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <Card className="mt-6 md:mt-12 flex flex-col shadow-none poppins border-none w-full max-w-full overflow-x-auto">
            <CardHeader className="flex justify-between p-2 md:p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
                    <div>
                        <CardTitle className="font-bold text-lg sm:text-xl md:text-2xl">[Entity]</CardTitle>
                        <p className="text-muted-foreground text-sm md:text-base">
                            {[entities]Array.length} {[entities]Array.length > 1 ? "[Entities]" : "[Entity]"}
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <[Entity]Dialog />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-1 sm:p-2 md:p-4 w-full overflow-x-auto">
                <div className="min-w-[300px]">
                    <[Entity]Table data={[entities] as [Entity][]} columns={columns} />
                </div>
            </CardContent>
        </Card>
    );
}
```

### 3. Dialog Template (Create)
```tsx
"use client";
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from 'react-hot-toast';
import { usePermissions } from '@/hooks/use-permissions';

export default function [Entity]Dialog() {
  const [open, setOpen] = useState(false);
  const { can } = usePermissions();

  const { data, setData, post, errors, reset, processing } = useForm({
    // Add your form fields here
    name: "",
    // other fields...
  });

  if (!can('[entities].create')) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('[entities].store'), {
      onSuccess: () => {
        toast.success('[Entity] créé avec succès!');
        reset();
        setOpen(false);
      },
      onError: () => {
        toast.error('Échec de la création du [entity]!');
      },
      preserveScroll: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button id="add-[entity]-button" className="h-10 w-full sm:w-auto">
          Ajouter un [Entity]
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-[95vw] max-w-[800px] max-h-[95vh] overflow-y-auto p-4 sm:p-6 sm:max-w-[800px] md:p-7 md:px-8 poppins"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl md:text-[22px] text-center sm:text-left">
            Ajouter un [Entity]
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-center sm:text-left">
            Remplissez le formulaire pour ajouter un nouveau [entity]
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              type="text"
              placeholder="Entrez le nom"
              className="h-10 sm:h-11"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              required
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>
          
          {/* Add more form fields as needed */}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="w-full sm:w-auto"
            >
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### 4. DropDown Template
```tsx
"use client";
import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { [Entity] } from "@/pages/[entity]/config/columns";

import { FaRegEdit } from "react-icons/fa";
import { MdContentCopy, MdOutlineDelete } from "react-icons/md";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useForm, router } from "@inertiajs/react";
import toast from "react-hot-toast";
import [Entity]EditDialog from "@/pages/[entity]/components/[Entity]EditDialog";
import { usePermissions } from '@/hooks/use-permissions';

type MenuItem =
  | {
      icon: React.ReactElement;
      label: string;
      className: string;
      separator?: false | undefined;
      id?: string | undefined;
    }
  | {
      separator: true;
      icon?: undefined;
      label?: undefined;
      className?: undefined;
    };

export default function [Entity]DropDown({ row }: { row: Row<[Entity]> }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { delete: destroy } = useForm();
  const { can } = usePermissions();

  function handleEdit() {
    setIsDropdownOpen(false);
    setTimeout(() => {
      setIsEditDialogOpen(true);
    }, 100);
  }

  async function handleDelete() {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce [entity] ?')) {
      destroy(route('[entities].destroy', { [entity]: row.original.id }), {
        onSuccess: () => {
          toast.success('[Entity] supprimé avec succès');
        },
        onError: () => {
          toast.error('Erreur lors de la suppression du [entity]');
        },
        preserveScroll: true,
      });
    }
  }

  async function handleCopy() {
    if (confirm('Êtes-vous sûr de vouloir faire une copie de ce [entity] ?')) {
      router.post(route('[entities].store'), {
        name: `${row.original.name} - Copie`,
        // Copy other fields as needed
      }, {
        onSuccess: () => {
          toast.success('[Entity] copié avec succès');
        },
        onError: (errors) => {
          console.error('Erreurs lors de la copie:', errors);
          toast.error('Erreur lors de la copie du [entity]');
        },
        preserveScroll: true,
      });
    }
  }

  function handleClickedItem(item: MenuItem) {
    if (item.label === "Delete") {
      setIsDropdownOpen(false);
      setTimeout(() => {
        handleDelete();
      }, 100);
    }

    if (item.label === "Copy") {
      setIsDropdownOpen(false);
      setTimeout(() => {
        handleCopy();
      }, 100);
    }

    if (item.label === "Edit") {
      handleEdit();
    }
  }

  const menuItems: MenuItem[] = [
    ...(can('[entities].create') ? [{ icon: <MdContentCopy />, label: "Copy", className: "" }] : []),
    ...(can('[entities].edit') ? [{ icon: <FaRegEdit />, label: "Edit", className: "" }] : []),
    ...(((can('[entities].create') || can('[entities].edit')) && can('[entities].delete')) ? [{ separator: true } as const] : []),
    ...(can('[entities].delete') ? [{ icon: <MdOutlineDelete className="text-lg" />, label: "Delete", className: "text-red-600" }] : [])
  ];

  if (menuItems.length === 0) {
    return null;
  }

  return (
    <div>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="poppins">
          {menuItems.map((item, index) =>
            item.separator ? (
              <DropdownMenuSeparator key={index} />
            ) : (
              <DropdownMenuItem
                key={index}
                className={`flex items-center gap-1 p-[10px] ${item.className}`}
                onClick={() => handleClickedItem(item)}
                onSelect={(e) => {
                  if (item.label === "Edit") {
                    e.preventDefault();
                  }
                }}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <[Entity]EditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        [entity]={row.original}
      />
    </div>
  );
}
```

### 5. Table Template
```tsx
"use client";
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
import PaginationSelection from "@/pages/[entity]/components/PaginationSelection";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export type PaginationType = {
  pageIndex: number;
  pageSize: number;
};

export function [Entity]Table<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationType>({
    pageIndex: 0,
    pageSize: 8,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    setSorting([
      {
        id: "created_at",
        desc: true,
      },
    ]);
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      columnFilters,
      sorting,
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
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              table.getColumn("name")?.setFilterValue(event.target.value);
            }}
            placeholder="Rechercher..."
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

      <div className="flex items-center justify-between space-x-2 py-4">
        <PaginationSelection
          pagination={pagination}
          setPagination={setPagination}
        />
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} sur{" "}
            {table.getPageCount()}
          </div>
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
```

### 6. Columns Template
```tsx
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { [Entity]DropDown } from "../components/[Entity]DropDown";

export type [Entity] = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<[Entity]>[] = [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.getValue("name")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Créé le",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">
            {new Date(row.getValue("created_at")).toLocaleDateString('fr-FR')}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <[Entity]DropDown row={row} />;
    },
  },
];
```

## Backend Patterns

### Model Template
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class [Entity] extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        // Add other fillable fields
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Add relationships if needed
    // public function relatedModels(): HasMany
    // {
    //     return $this->hasMany(RelatedModel::class);
    // }
}
```

### Migration Template
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('[entities]', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            // Add other columns
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('[entities]');
    }
};
```

### Controller Template
```php
<?php

namespace App\Http\Controllers;

use App\Models\[Entity];
use App\Http\Requests\[Entity]Request;
use Illuminate\Http\Request;
use Inertia\Inertia;

class [Entity]Controller extends Controller
{
    public function index()
    {
        $[entities] = [Entity]::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('[Entity]/Index', [
            '[entities]' => $[entities],
        ]);
    }

    public function store([Entity]Request $request)
    {
        [Entity]::create($request->validated());
        
        return redirect()->back();
    }

    public function update([Entity]Request $request, [Entity] $[entity])
    {
        $[entity]->update($request->validated());
        
        return redirect()->back();
    }

    public function destroy([Entity] $[entity])
    {
        $[entity]->delete();
        
        return redirect()->back();
    }
}
```

### Request Template
```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class [Entity]Request extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Or add specific authorization logic
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:[entities],name' . ($this->[entity] ? ',' . $this->[entity]->id : ''),
            // Add other validation rules
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est requis.',
            'name.unique' => 'Ce nom existe déjà.',
            // Add other custom messages
        ];
    }
}
```

### Policy Template
```php
<?php

namespace App\Policies;

use App\Models\User;
use App\Models\[Entity];

class [Entity]Policy
{
    public function viewAny(User $user): bool
    {
        return $user->can('[entities].view');
    }

    public function view(User $user, [Entity] $[entity]): bool
    {
        return $user->can('[entities].view');
    }

    public function create(User $user): bool
    {
        return $user->can('[entities].create');
    }

    public function update(User $user, [Entity] $[entity]): bool
    {
        return $user->can('[entities].edit');
    }

    public function delete(User $user, [Entity] $[entity]): bool
    {
        return $user->can('[entities].delete');
    }
}
```

## Routes Template
```php
// Add to routes/web.php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('[entities]', [Entity]Controller::class);
});
```

## Permissions Template
```php
// Add to database/seeders/PermissionSeeder.php
Permission::create(['name' => '[entities].view']);
Permission::create(['name' => '[entities].create']);
Permission::create(['name' => '[entities].edit']);
Permission::create(['name' => '[entities].delete']);
```

## Usage Instructions

1. **Copy templates**: Copy the relevant templates for your new module
2. **Replace placeholders**: Replace `[Entity]`, `[entity]`, `[entities]` with your actual entity names
3. **Customize fields**: Add your specific form fields and validation rules
4. **Add relationships**: Include any necessary model relationships
5. **Test thoroughly**: Ensure all CRUD operations work correctly
6. **Add permissions**: Assign appropriate permissions to roles

## Common Customizations

### Adding Select Fields
```tsx
// In Dialog component
<div className="space-y-1">
  <Label htmlFor="category-select">Catégorie</Label>
  <select
    id="category-select"
    value={data.categoryId}
    onChange={(e) => setData('categoryId', e.target.value)}
    className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    required
  >
    <option value="">Sélectionnez une catégorie...</option>
    {categories.map((category) => (
      <option key={category.id} value={category.id.toString()}>
        {category.name}
      </option>
    ))}
  </select>
  {errors.categoryId && (
    <p className="text-xs text-red-500">{errors.categoryId}</p>
  )}
</div>
```

### Adding Filters
```tsx
// In Table component
const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

// Add filter logic
useEffect(() => {
  setColumnFilters((prev) => {
    const baseFilters = prev.filter(
      (filter) => filter.id !== "categoryId"
    );

    const newFilters = [...baseFilters];

    if (selectedCategories.length > 0) {
      newFilters.push({
        id: "categoryId",
        value: selectedCategories,
      });
    }

    return newFilters;
  });
}, [selectedCategories]);
```

This pattern system ensures consistent, maintainable, and secure module development across the application.

## ⚠️ CRITICAL: Event Propagation Protection

### Combobox Protection Pattern
When creating combobox components, always use the protected pattern to prevent accidental form submissions:

```tsx
// ✅ CORRECT - Protected Combobox Pattern
function ProductCombobox({ onValueChange, ...props }) {
  const [open, setOpen] = useState(false);

  return (
    <div 
      className="relative"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Button
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        {/* Button content */}
      </Button>

      {open && (
        <div 
          className="absolute z-50"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Input
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
          />
          {/* Dropdown items with existing stopPropagation */}
        </div>
      )}
    </div>
  );
}
```

### Alternative: Use ProtectedCombobox Component
For new modules, use the reusable `ProtectedCombobox` component:

```tsx
import ProtectedCombobox from '@/components/patterns/ProtectedCombobox';

// In your dialog/form
<ProtectedCombobox
  items={products.map(p => ({
    id: p.id,
    label: p.product_libelle,
    subLabel: `Ref: ${p.product_Ref}`,
    isActive: p.product_isActive
  }))}
  value={selectedProductId}
  onValueChange={setSelectedProductId}
  placeholder="Sélectionnez un produit..."
/>
```

### Why This Is Critical
- **Prevents form submission conflicts**: Combobox clicks won't trigger form submissions
- **Maintains UX consistency**: Users can interact with comboboxes without side effects
- **Avoids debugging nightmares**: Eliminates hard-to-track event propagation issues
- **Required for all interactive components**: Apply this pattern to all dropdown/combobox components 
