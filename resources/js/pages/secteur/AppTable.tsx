"use client"
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SecteurDialog from "./components/SecteurDialog";
import { columns } from "./config/columns";
import { SecteurTable } from "./components/SecteurTable";
import type { Secteur } from "./config/columns";
import { useEffect } from "react";


type Ville = {
    // Define the properties of Ville as needed, for example:
    id: number;
    nameVille: string;
    // Add other properties here
};
export default function AppTable({ villes }: { villes: Ville[] }) {

    const { props: { secteurs } } = usePage();
    const secteursArray = secteurs as Secteur[];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                document.getElementById('add-secteur-button')?.click();
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
                        <CardTitle className="font-bold text-lg sm:text-xl md:text-2xl">Secteurs</CardTitle>
                        <p className="text-muted-foreground text-sm md:text-base">
                            {secteursArray.length} {secteursArray.length > 1 ? "Secteurs" : "Secteur"}
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <SecteurDialog villes={villes} />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-1 sm:p-2 md:p-4 w-full overflow-x-auto">
                <div className="min-w-[300px]">
                    <SecteurTable data={secteurs as Secteur[]} columns={columns} villes={villes} />
                </div>
            </CardContent>
        </Card>
    );
}
