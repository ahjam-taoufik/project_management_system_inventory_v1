"use client";
import React from "react";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Brand {
  id: number;
  brand_name: string;
}

interface BrandEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  brand: Brand;
}

export default function BrandEditDialog({
  isOpen,
  onOpenChange,
  brand
}: BrandEditDialogProps) {
  const { put, data, setData, processing, reset, errors } = useForm({
    brand_name: brand.brand_name || "",
  });

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    put(route('brands.update', { brand: brand.id }), {
      onSuccess: () => {
        toast.success('Marque modifiée avec succès');
        onOpenChange(false);
        reset();
      },
      onError: (errors) => {
        toast.error('Erreur lors de la modification');
        console.error(errors);
      },
      preserveScroll: true,
    });
  }

  React.useEffect(() => {
    if (isOpen) {
      setData({
        brand_name: brand.brand_name || "",
      });
    }
  }, [isOpen, brand.brand_name, setData]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier la marque</DialogTitle>
          <DialogDescription>
            Modifiez le nom de la marque ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand_name" className="text-right">
                Nom de la marque
              </Label>
              <Input
                id="brand_name"
                value={data.brand_name}
                onChange={(e) => setData('brand_name', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            {errors.brand_name && (
              <p className="text-xs text-red-500">{errors.brand_name}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={processing}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Modification...' : 'Modifier'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
