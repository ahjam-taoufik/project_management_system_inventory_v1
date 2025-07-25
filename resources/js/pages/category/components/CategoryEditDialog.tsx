"use client";
import { useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Category, Brand } from '@/types';

interface CategoryEditDialogProps {
    category: Category | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CategoryEditDialog({
    category,
    isOpen,
    onOpenChange,
}: CategoryEditDialogProps) {
    const { props } = usePage();
    const brands = props.brands as Brand[];

    const { data, setData, put, processing, errors, reset } = useForm({
        category_name: '',
        brand_id: '',
    });

    useEffect(() => {
        if (category && isOpen) {
            setData({
                category_name: category.category_name,
                brand_id: category.brand_id.toString(),
            });
        }
    }, [category, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!category) return;

        put(route('categories.update', category.id), {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Modifier la catégorie</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations de la catégorie ici. Cliquez sur sauvegarder quand vous avez terminé.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="category_name">Nom de la catégorie</Label>
                        <Input
                            id="category_name"
                            value={data.category_name}
                            onChange={(e) => setData('category_name', e.target.value)}
                            placeholder="Nom de la catégorie"
                        />
                        {errors.category_name && (
                            <p className="text-sm text-red-500">{errors.category_name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="brand_id">Marque</Label>
                        <select
                            id="brand_id"
                            value={data.brand_id}
                            onChange={(e) => setData('brand_id', e.target.value)}
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        >
                            <option value="">Sélectionner une marque</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id.toString()}>
                                    {brand.brand_name}
                                </option>
                            ))}
                        </select>
                        {errors.brand_id && (
                            <p className="text-sm text-red-500">{errors.brand_id}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Sauvegarde...' : 'Sauvegarder'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
