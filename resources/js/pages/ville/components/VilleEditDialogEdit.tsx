"use client"
import React from "react";
import { Product } from "@/pages/ville/config/columns";
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

interface ProductDialogEditProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export default function ProductDialogEdit({
  isOpen,
  onOpenChange,
  product
}: ProductDialogEditProps) {
  const { put, data, setData, processing, reset, errors } = useForm({
    nameVille: product.nameVille || "",
  });

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();

    put(route('villes.update', { ville: product.id }), {
      onSuccess: () => {
        toast.success('Ville modifiée avec succès');
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

  // Réinitialiser les données quand le dialog s'ouvre
  React.useEffect(() => {
    if (isOpen) {
      setData({
        nameVille: product.nameVille || "",
      });
    }
  }, [isOpen, product.nameVille, setData]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier la ville</DialogTitle>
          <DialogDescription>
            Modifiez le nom de la ville ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nameVille" className="text-right">
                Nom  ville
              </Label>
              <Input
                id="nameVille"
                value={data.nameVille}
                onChange={(e) => setData('nameVille', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
               {errors.nameVille && (
                <p className="text-xs text-red-500">{errors.nameVille}</p>
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
