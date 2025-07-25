"use client"
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClientDialog from "./components/ClientDialog";
import { columns } from "./config/columns";
import { ClientTable } from "./components/ClientTable";
import { PrintButtons } from "./components/print";
import type { Client } from "./config/columns";
import { useEffect } from "react";

type Ville = {
    id: number;
    nameVille: string;
};

type Commercial = {
    id: number;
    commercial_code: string;
    commercial_fullName: string;
};

export default function AppTable({
    villes,
    commerciaux = []
}: {
    villes: Ville[];
    commerciaux?: Commercial[];
}) {
    const { props: { clients } } = usePage();
    const clientsArray = clients as Client[];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                document.getElementById('add-client-button')?.click();
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
                        <CardTitle className="font-bold text-lg sm:text-xl md:text-2xl">Clients</CardTitle>
                        <p className="text-muted-foreground text-sm md:text-base">
                            {clientsArray.length} {clientsArray.length > 1 ? "Clients" : "Client"}
                        </p>
                    </div>
                    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
                        <PrintButtons clients={clientsArray} commerciaux={commerciaux} />
                        <ClientDialog villes={villes} commerciaux={commerciaux} />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-1 sm:p-2 md:p-4 w-full overflow-x-auto">
                <div className="min-w-[300px]">
                    <ClientTable data={clients as Client[]} columns={columns} commerciaux={commerciaux} villes={villes} />
                </div>
            </CardContent>
        </Card>
    );
}
