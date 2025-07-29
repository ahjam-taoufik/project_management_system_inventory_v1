'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import SortieDialog from './components/SortieDialog';
import { SortieTable } from './components/SortieTable';
import { columns } from './config/columns';
import { Client, Commercial, Product, Sortie } from './types';

export default function AppTable() {
    const {
        props: { sorties, products, commerciaux, clients, livreurs },
    } = usePage();
    const sortiesArray = sorties as Sortie[];
    const productsArray = products as Product[];
    const commerciauxArray = commerciaux as Commercial[];
    const clientsArray = clients as Client[];
    const livreursArray = (livreurs as Array<{id: number; nom: string; telephone?: string}>) || [];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                document.getElementById('add-sortie-button')?.click();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <Card className="poppins mt-6 flex w-full max-w-full flex-col overflow-x-auto border-none shadow-none md:mt-12">
            <CardHeader className="flex justify-between p-2 md:p-4">
                <div className="flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <CardTitle className="text-lg font-bold sm:text-xl md:text-2xl">Sorties</CardTitle>
                        <p className="text-sm text-muted-foreground md:text-base">
                            {sortiesArray.length} {sortiesArray.length > 1 ? 'Sorties' : 'Sortie'}
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <SortieDialog products={productsArray} commerciaux={commerciauxArray} clients={clientsArray} livreurs={livreursArray} />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="w-full overflow-x-auto p-1 sm:p-2 md:p-4">
                <div className="min-w-[300px]">
                    <SortieTable data={sortiesArray} columns={columns} />
                </div>
            </CardContent>
        </Card>
    );
}
