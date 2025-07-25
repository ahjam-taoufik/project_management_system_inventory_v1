"use client"
import React from "react";
import { Commercial } from "@/pages/commercial/config/columns";
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

interface CommercialDialogEditProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  commercial: Commercial;
}

export default function CommercialDialogEdit({
  isOpen,
  onOpenChange,
  commercial
}: CommercialDialogEditProps) {
  const { put, data, setData, processing, reset, errors } = useForm({
    commercial_code: commercial.commercial_code || "",
    commercial_fullName: commercial.commercial_fullName || "",
    commercial_telephone: commercial.commercial_telephone || "",
  });

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();

    put(route('commerciaux.update', { commercial: commercial.id }), {
      onSuccess: () => {
        toast.success('Commercial modifié avec succès');
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
        commercial_code: commercial.commercial_code || "",
        commercial_fullName: commercial.commercial_fullName || "",
        commercial_telephone: commercial.commercial_telephone || "",
      });
    }
  }, [isOpen, commercial.commercial_code, commercial.commercial_fullName, commercial.commercial_telephone, setData]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier Commercial</DialogTitle>
          <DialogDescription>
            Modifiez les informations du commercial ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="commercial_code" className="text-right">
                Code Commercial
              </Label>
              <Input
                id="commercial_code"
                value={data.commercial_code}
                onChange={(e) => setData('commercial_code', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            {errors.commercial_code && (
              <p className="text-xs text-red-500">{errors.commercial_code}</p>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="commercial_fullName" className="text-right">
                Nom Complet
              </Label>
              <Input
                id="commercial_fullName"
                value={data.commercial_fullName}
                onChange={(e) => setData('commercial_fullName', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            {errors.commercial_fullName && (
              <p className="text-xs text-red-500">{errors.commercial_fullName}</p>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="commercial_telephone" className="text-right">
                Téléphone
              </Label>
              <Input
                id="commercial_telephone"
                value={data.commercial_telephone}
                onChange={(e) => setData('commercial_telephone', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            {errors.commercial_telephone && (
              <p className="text-xs text-red-500">{errors.commercial_telephone}</p>
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