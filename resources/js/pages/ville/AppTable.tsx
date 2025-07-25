"use client"
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductDialog from "./components/VilleDialog";
import { columns } from "./config/columns";
import { ProductTable } from "./components/ProductTable";
import type { Product } from "./config/columns";
import { useEffect } from "react";

export default function AppTable() {
    const { props: { villes } } = usePage();
    const villesArray = villes as Product[];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                document.getElementById('add-ville-button')?.click();
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
                        <CardTitle className="font-bold text-lg sm:text-xl md:text-2xl">Villes</CardTitle>
                        <p className="text-muted-foreground text-sm md:text-base">
                            {villesArray.length} {villesArray.length > 1 ? "Villes" : "Ville"}
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <ProductDialog />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-1 sm:p-2 md:p-4 w-full overflow-x-auto">
                <div className="min-w-[300px]">
                    <ProductTable data={villes as Product[]} columns={columns} />
                </div>
            </CardContent>
        </Card>
    );
}
