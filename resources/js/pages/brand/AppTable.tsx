"use client";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BrandDialog from "./components/BrandDialog";
import { columns } from "./config/columns";
import { BrandTable } from "./components/BrandTable";
import type { Brand } from "./config/columns";
import { useEffect } from "react";

export default function AppTable() {
    const { props: { brands } } = usePage();
    const brandsArray = brands as Brand[];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                document.getElementById('add-brand-button')?.click();
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
                        <CardTitle className="font-bold text-lg sm:text-xl md:text-2xl">Marques</CardTitle>
                        <p className="text-muted-foreground text-sm md:text-base">
                            {brandsArray.length} {brandsArray.length > 1 ? "Marques" : "Marque"}
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <BrandDialog />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-1 sm:p-2 md:p-4 w-full overflow-x-auto">
                <div className="min-w-[300px]">
                    <BrandTable data={brands as Brand[]} columns={columns} />
                </div>
            </CardContent>
        </Card>
    );
}
