"use client";

import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from 'react-hot-toast';
import { usePermissions } from '@/hooks/use-permissions';
import type { Brand } from '@/types';

export default function CategoryDialog() {
  const [open, setOpen] = useState(false);
  const { can } = usePermissions();
  const { props: { brands } } = usePage();
  const brandsArray = brands as Brand[];

  const { data, setData, post, errors, reset, processing } = useForm({
    category_name: "",
    brand_id: "",
  });

  if (!can('categories.create')) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('categories.store'), {
      onSuccess: () => {
        toast.success('Catégorie créée avec succès !');
        reset();
        setOpen(false);
      },
      onError: () => {
        toast.error('Erreur lors de la création de la catégorie !');
      },
      preserveScroll: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <Button id="add-category-button" className="h-10 w-full sm:w-auto">
          Ajouter une Catégorie
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[800px] max-h-[95vh] overflow-y-auto p-4 sm:p-6 sm:max-w-[800px] md:p-7 md:px-8 poppins" onInteractOutside={e => e.preventDefault()}>
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl md:text-[22px] text-center sm:text-left">
            Ajouter une Catégorie
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-center sm:text-left">
            Remplissez le formulaire pour ajouter une nouvelle catégorie
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <Label htmlFor="category_name">Nom de la Catégorie</Label>
              <Input
                id="category_name"
                type="text"
                placeholder="Entrez le nom de la catégorie (min. 3 caractères)"
                className="h-10 sm:h-11"
                value={data.category_name}
                onChange={e => setData('category_name', e.target.value)}
              />
              {errors.category_name && (
                <p className="text-xs text-red-500">{errors.category_name}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="brand_id">Marque</Label>
              <Select value={data.brand_id} onValueChange={(value) => setData('brand_id', value)}>
                <SelectTrigger className="h-10 sm:h-11">
                  <SelectValue placeholder="Sélectionnez une marque" />
                </SelectTrigger>
                <SelectContent>
                  {brandsArray.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.brand_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.brand_id && (
                <p className="text-xs text-red-500">{errors.brand_id}</p>
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
  );
}
