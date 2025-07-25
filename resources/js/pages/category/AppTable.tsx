"use client";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryDialog from "./components/CategoryDialog";
import { columns } from "./config/columns";
import { CategoryTable } from "./components/CategoryTable";
import type { Category } from "@/types";
import { useEffect } from "react";

export default function AppTable() {
    const { props: { categories } } = usePage();
    const categoriesArray = categories as Category[];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'c') {
                e.preventDefault();
                document.getElementById('add-category-button')?.click();
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
                        <CardTitle className="font-bold text-lg sm:text-xl md:text-2xl">Catégories</CardTitle>
                        <p className="text-muted-foreground text-sm md:text-base">
                            {categoriesArray.length} {categoriesArray.length > 1 ? "Catégories" : "Catégorie"}
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <CategoryDialog />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-1 sm:p-2 md:p-4 w-full overflow-x-auto">
                <div className="min-w-[300px]">
                    <CategoryTable data={categories as Category[]} columns={columns} />
                </div>
            </CardContent>
        </Card>
    );
}
