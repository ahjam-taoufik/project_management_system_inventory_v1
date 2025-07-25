"use client"
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransporteurDialog } from "./components/TransporteurDialog";
import { TransporteurTable } from "./components/TransporteurTable";
import type { Transporteur } from "@/types";
import { useEffect, useState } from "react";

export default function AppTable() {
    const { props: { transporteurs } } = usePage();
    const transporteursArray = transporteurs as Transporteur[];
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                setIsCreateDialogOpen(true);
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
                        <CardTitle className="font-bold text-lg sm:text-xl md:text-2xl">Transporteurs</CardTitle>
                        <p className="text-muted-foreground text-sm md:text-base">
                            {transporteursArray.length} {transporteursArray.length > 1 ? "Transporteurs" : "Transporteur"}
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <Button
                            onClick={() => setIsCreateDialogOpen(true)}
                            className="w-full md:w-auto"
                        >
                            Ajouter un transporteur
                        </Button>
                        <TransporteurDialog
                            open={isCreateDialogOpen}
                            onOpenChange={setIsCreateDialogOpen}
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-1 sm:p-2 md:p-4 w-full overflow-x-auto">
                <div className="min-w-[300px]">
                    <TransporteurTable data={transporteursArray} />
                </div>
            </CardContent>
        </Card>
    );
}
