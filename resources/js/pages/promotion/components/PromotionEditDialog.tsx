"use client";
import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from 'react-hot-toast';
import { usePermissions } from '@/hooks/use-permissions';
import { Promotion } from "@/pages/promotion/config/columns";

interface Product {
  id: number;
  product_libelle: string;
  product_Ref: string;
  product_isActive: boolean;
}

interface PromotionEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  promotion: Promotion;
}

export default function PromotionEditDialog({
  isOpen,
  onOpenChange,
  promotion
}: PromotionEditDialogProps) {
  const { can } = usePermissions();
  const [products, setProducts] = useState<Product[]>([]);

  const { data, setData, put, errors, processing } = useForm({
    produit_promotionnel_id: promotion.produit_promotionnel_id.toString(),
    quantite_produit_promotionnel: promotion.quantite_produit_promotionnel.toString(),
    produit_offert_id: promotion.produit_offert_id.toString(),
    quantite_produit_offert: promotion.quantite_produit_offert.toString(),
    is_active: promotion.is_active ?? true,
  });

  // Charger les produits depuis l'API
  useEffect(() => {
    if (isOpen) {
      fetch('/api/products')
        .then(response => response.json())
        .then(data => {
          setProducts(data.products || []);
        })
        .catch(error => {
          console.error('Error loading products:', error);
          setProducts([]);
        });
    }
  }, [isOpen]);

  // Mettre à jour les données quand la promotion change
  useEffect(() => {
    if (promotion) {
      setData({
        produit_promotionnel_id: promotion.produit_promotionnel_id.toString(),
        quantite_produit_promotionnel: promotion.quantite_produit_promotionnel.toString(),
        produit_offert_id: promotion.produit_offert_id.toString(),
        quantite_produit_offert: promotion.quantite_produit_offert.toString(),
        is_active: promotion.is_active ?? true,
      });
    }
  }, [promotion]);

  if (!can('promotions.edit')) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('promotions.update', { promotion: promotion.id }), {
      onSuccess: () => {
        toast.success('Promotion mise à jour avec succès!');
        onOpenChange(false);
      },
      onError: () => {
        toast.error('Échec de la mise à jour de la promotion!');
      },
      preserveScroll: true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[95vw] max-w-[800px] max-h-[95vh] overflow-y-auto p-4 sm:p-6 sm:max-w-[800px] md:p-7 md:px-8 poppins"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl md:text-[22px] text-center sm:text-left">
            Modifier la Promotion
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-center sm:text-left">
            Modifiez les informations de la promotion
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="edit-produit-promotionnel-select">Produit Promotionnel</Label>
              <select
                id="edit-produit-promotionnel-select"
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
              <Label htmlFor="edit-quantite-promotionnelle">Quantité Produit Promotionnel</Label>
              <Input
                id="edit-quantite-promotionnelle"
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
              <Label htmlFor="edit-produit-offert-select">Produit Offert</Label>
              <select
                id="edit-produit-offert-select"
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
              <Label htmlFor="edit-quantite-offerte">Quantité Produit Offert</Label>
              <Input
                id="edit-quantite-offerte"
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
              <Label htmlFor="edit-is-active-switch">Promotion active</Label>
              <input
                id="edit-is-active-switch"
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
              onClick={() => onOpenChange(false)}
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
              Mettre à jour
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
