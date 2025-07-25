"use client";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EntrerDialog from "./components/EntrerDialog";
import { columns } from "./config/columns";
import { EntrerTable } from "./components/EntrerTable";
import { Entrer, Product, Transporteur } from "./types";
import { useEffect } from "react";

export default function AppTable() {
    const { props: { entrers, products, transporteurs } } = usePage();
    const entrersArray = entrers as Entrer[];
    const productsArray = products as Product[];
    const transporteursArray = transporteurs as Transporteur[];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                document.getElementById('add-entrer-button')?.click();
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
                        <CardTitle className="font-bold text-lg sm:text-xl md:text-2xl">Entrées</CardTitle>
                        <p className="text-muted-foreground text-sm md:text-base">
                            {entrersArray.length} {entrersArray.length > 1 ? "Entrées" : "Entrée"}
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <EntrerDialog products={productsArray} transporteurs={transporteursArray} />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-1 sm:p-2 md:p-4 w-full overflow-x-auto">
                <div className="min-w-[300px]">
                    <EntrerTable data={entrersArray} columns={columns} />
                </div>
            </CardContent>
        </Card>
    );
}
