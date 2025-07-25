"use client";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PromotionDialog from "./components/PromotionDialog";
import { columns } from "./config/columns";
import { PromotionTable } from "./components/PromotionTable";
import type { Promotion } from "./config/columns";
import { useEffect } from "react";

type Product = {
    id: number;
    product_libelle: string;
    product_Ref: string;
};

export default function AppTable({
    products = []
}: {
    products?: Product[];
}) {
        const { props: { promotions } } = usePage();
    const promotionsArray = promotions as Promotion[];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                document.getElementById('add-promotion-button')?.click();
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
                        <CardTitle className="font-bold text-lg sm:text-xl md:text-2xl">Promotions</CardTitle>
                        <p className="text-muted-foreground text-sm md:text-base">
                            {promotionsArray.length} {promotionsArray.length > 1 ? "Promotions" : "Promotion"}
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <PromotionDialog products={products} />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-1 sm:p-2 md:p-4 w-full overflow-x-auto">
                <div className="min-w-[300px]">
                    <PromotionTable data={promotions as Promotion[]} columns={columns} products={products} />
                </div>
            </CardContent>
        </Card>
    );
}
