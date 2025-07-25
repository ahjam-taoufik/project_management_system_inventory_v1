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

interface Product {
  id: number;
  product_libelle: string;
  product_Ref: string;
  product_isActive: boolean;
}

export default function PromotionDialog({
  products = []
}: {
  products?: Product[];
}) {
  const [open, setOpen] = useState(false);
  const { can } = usePermissions();

  const { data, setData, post, errors, reset, processing } = useForm({
    produit_promotionnel_id: "",
    quantite_produit_promotionnel: "",
    produit_offert_id: "",
    quantite_produit_offert: "",
    is_active: true,
  });

  if (!can('promotions.create')) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('promotions.store'), {
      onSuccess: () => {
        toast.success('Promotion créée avec succès!');
        reset();
        setOpen(false);
      },
      onError: () => {
        toast.error('Échec de la création de la promotion!');
      },
      preserveScroll: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button id="add-promotion-button" className="h-10 w-full sm:w-auto">
          Ajouter une Promotion
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-[95vw] max-w-[800px] max-h-[95vh] overflow-y-auto p-4 sm:p-6 sm:max-w-[800px] md:p-7 md:px-8 poppins"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl md:text-[22px] text-center sm:text-left">
            Ajouter une Promotion
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-center sm:text-left">
            Remplissez le formulaire pour ajouter une nouvelle promotion
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="produit-promotionnel-select">Produit Promotionnel</Label>
              <select
                id="produit-promotionnel-select"
                value={data.produit_promotionnel_id}
                onChange={(e) => setData('produit_promotionnel_id', e.target.value)}
                className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Sélectionnez un produit promotionnel...</option>
                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id.toString()}
                    disabled={!product.product_isActive}
                    className={!product.product_isActive ? 'text-gray-400' : ''}
                  >
                    {product.product_Ref} - {product.product_libelle} {!product.product_isActive && '(inactif)'}
                  </option>
                ))}
              </select>
              {errors.produit_promotionnel_id && (
                <p className="text-xs text-red-500">{errors.produit_promotionnel_id}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="quantite-promotionnelle">Quantité Produit Promotionnel</Label>
              <Input
                id="quantite-promotionnelle"
                type="number"
                min="1"
                placeholder="Entrez la quantité"
                className="h-10 sm:h-11"
                value={data.quantite_produit_promotionnel}
                onChange={(e) => setData('quantite_produit_promotionnel', e.target.value)}
                required
              />
              {errors.quantite_produit_promotionnel && (
                <p className="text-xs text-red-500">{errors.quantite_produit_promotionnel}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="produit-offert-select">Produit Offert</Label>
              <select
                id="produit-offert-select"
                value={data.produit_offert_id}
                onChange={(e) => setData('produit_offert_id', e.target.value)}
                className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Sélectionnez un produit offert...</option>
                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id.toString()}
                    disabled={!product.product_isActive}
                    className={!product.product_isActive ? 'text-gray-400' : ''}
                  >
                    {product.product_Ref} - {product.product_libelle} {!product.product_isActive && '(inactif)'}
                  </option>
                ))}
              </select>
              {errors.produit_offert_id && (
                <p className="text-xs text-red-500">{errors.produit_offert_id}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="quantite-offerte">Quantité Produit Offert</Label>
              <Input
                id="quantite-offerte"
                type="number"
                min="1"
                placeholder="Entrez la quantité"
                className="h-10 sm:h-11"
                value={data.quantite_produit_offert}
                onChange={(e) => setData('quantite_produit_offert', e.target.value)}
                required
              />
              {errors.quantite_produit_offert && (
                <p className="text-xs text-red-500">{errors.quantite_produit_offert}</p>
              )}
            </div>

            <div className="space-y-1 flex items-center gap-2 mt-2">
              <Label htmlFor="is-active-switch">Promotion active</Label>
              <input
                id="is-active-switch"
                type="checkbox"
                checked={!!data.is_active}
                onChange={e => setData('is_active', e.target.checked)}
                className="ml-2 accent-blue-600 w-5 h-5"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="w-full sm:w-auto"
            >
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
