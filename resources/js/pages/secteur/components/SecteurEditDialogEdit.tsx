"use client"
import React from "react";
import { Secteur } from "@/pages/secteur/config/columns";
import { useForm, usePage } from "@inertiajs/react";
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


interface Ville {
  id: string;
  nameVille: string;
}

interface ProductDialogEditProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Secteur;
}

export default function ProductDialogEdit({
  isOpen,
  onOpenChange,
  product
}: ProductDialogEditProps) {
  const { props: { villes } } = usePage();
  const villesArray = villes as Ville[];
  
  const { put, data, setData, processing, reset, errors } = useForm({
    nameSecteur: product.nameSecteur || "",
    idVille: product.idVille || "",
  });

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();

    put(route('secteurs.update', { secteur: product.id }), {
      onSuccess: () => {
        toast.success('Secteur modifiée avec succès');
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
        nameSecteur: product.nameSecteur|| "",
        idVille: product.idVille || "",
      });
    }
  }, [isOpen, product.nameSecteur, product.idVille, setData]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier Secteur</DialogTitle>
          <DialogDescription>
            Modifiez le nom de secteur ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nameSecteur" className="text-right">
                Nom du Secteur
              </Label>
              <Input
                id="nameSecteur"
                value={data.nameSecteur}
                onChange={(e) => setData('nameSecteur', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
               {errors.nameSecteur && (
                <p className="text-xs text-red-500">{errors.nameSecteur}</p>
              )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="idVille" className="text-right">
                Ville
              </Label>
              <select
                id="idVille"
                value={data.idVille}
                onChange={(e) => setData('idVille', e.target.value)}
                className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Sélectionnez une ville</option>
                {villesArray.map((ville) => (
                  <option key={ville.id} value={ville.id}>
                    {ville.nameVille}
                  </option>
                ))}
              </select>
            </div>
            {errors.idVille && (
              <p className="text-xs text-red-500">{errors.idVille}</p>
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
