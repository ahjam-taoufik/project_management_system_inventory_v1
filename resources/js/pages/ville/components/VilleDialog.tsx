"use client";

import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from 'react-hot-toast';
import { usePermissions } from '@/hooks/use-permissions';

export default function ProductDialog() {
  const [open, setOpen] = useState(false);
  const { can } = usePermissions();
  const { data, setData, post, errors, reset, processing } = useForm({
    nameVille: "",
  });

  // Ne pas afficher le bouton si l'utilisateur n'a pas la permission
  if (!can('villes.create')) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('villes.store'), {
      onSuccess: () => {
        toast.success('Successfully created!');
        reset();
        setOpen(false);
      },
      onError: () =>{
         console.log(errors);
        toast.error('Failed to create!');
      },
      preserveScroll: true,
    });
  };

  return (
    <>

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* <Button className="h-10 w-full sm:w-auto">Ajouter une Ville</Button> */}
         <Button id="add-ville-button" className="h-10 w-full sm:w-auto">
        Ajouter une Ville
    </Button>
      </DialogTrigger>
      <DialogContent
        className="w-[95vw] max-w-[800px] max-h-[95vh] overflow-y-auto p-4 sm:p-6 sm:max-w-[800px] md:p-7 md:px-8 poppins"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl md:text-[22px] text-center sm:text-left">
            Ajouter une Ville
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-center sm:text-left">
            Remplissez le formulaire pour ajouter une nouvelle ville
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <Label htmlFor="nameVille">Nom de la Ville</Label>
              <Input
                id="nameVille"
                name="nameVille"
                type="text"
                placeholder="Entrez le nom de la ville (min. 3 caractères)"
                className="h-10 sm:h-11"
                value={data.nameVille}
                onChange={(e) => setData('nameVille', e.target.value)}
              />
              {errors.nameVille && (
                <p className="text-xs text-red-500">{errors.nameVille}</p>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 md:pt-9">
            <Button
              type="button"
              variant="secondary"
              className="h-11 px-6 sm:px-8 md:px-11 w-full sm:w-auto"
              disabled={processing}
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Annuler
            </Button>

            <Button
              type="submit"
              className="h-11 px-6 sm:px-8 md:px-11 w-full sm:w-auto flex items-center justify-center gap-2"
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Enregistrement en cours...</span>
                </>
              ) : (
                "Ajouter"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
