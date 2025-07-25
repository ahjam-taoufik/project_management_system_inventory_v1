"use client";

import { useState, useEffect } from 'react';
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
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import toast from 'react-hot-toast';
import { usePermissions } from '@/hooks/use-permissions';
import type { Brand, Category, Product } from '@/types';

interface ProductDialogProps {
  duplicateData?: Product | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ProductDialog({ duplicateData, isOpen, onOpenChange }: ProductDialogProps = {}) {
  const [open, setOpen] = useState(false);

  // Use external state if provided, otherwise use internal state
  const dialogOpen = isOpen !== undefined ? isOpen : open;
  const setDialogOpen = onOpenChange || setOpen;
  const { can } = usePermissions();
  const { props: { brands, categories } } = usePage();
  const brandsArray = brands as Brand[];
  const categoriesArray = categories as Category[];

  interface ProductFormData {
    product_Ref: string;
    product_libelle: string;
    prix_achat_colis: string;
    prix_achat_unite: string;
    prix_vente_colis: string;
    prix_vente_unite: string;
    brand_id: string;
    category_id: string;
    product_Poids: string;
    nombre_unite_par_colis: string;
    product_isActive: boolean;
    observation: string;
    [key: string]: string | boolean;
  }

  const { data, setData, post, errors, reset, processing } = useForm<ProductFormData>({
    product_Ref: "",
    product_libelle: "",
    prix_achat_colis: "",
    prix_achat_unite: "",
    prix_vente_colis: "",
    prix_vente_unite: "",
    brand_id: "",
    category_id: "",
    product_Poids: "",
    nombre_unite_par_colis: "",
    product_isActive: true,
    observation: "",
  });

  // Pre-fill form data when duplicating
  useEffect(() => {
    if (duplicateData && dialogOpen) {
      setData({
        product_Ref: `${duplicateData.product_Ref}-COPY`,
        product_libelle: `${duplicateData.product_libelle} (Copie)`,
        prix_achat_colis: duplicateData.prix_achat_colis.toString(),
        prix_achat_unite: duplicateData.prix_achat_unite.toString(),
        prix_vente_colis: duplicateData.prix_vente_colis.toString(),
        prix_vente_unite: duplicateData.prix_vente_unite.toString(),
        brand_id: duplicateData.brand_id.toString(),
        category_id: duplicateData.category_id.toString(),
        product_Poids: duplicateData.product_Poids.toString(),
        nombre_unite_par_colis: duplicateData.nombre_unite_par_colis?.toString() || "1",
        product_isActive: duplicateData.product_isActive,
        observation: duplicateData.observation || "",
      });
    }
  }, [duplicateData, dialogOpen]);

  if (!can('products.create')) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('products.store'), {
      onSuccess: () => {
        toast.success('Produit créé avec succès !');
        reset();
        setDialogOpen(false);
      },
      onError: () => {
        toast.error('Erreur lors de la création du produit !');
      },
      preserveScroll: true,
    });
  };

  // Filtrer les catégories par marque sélectionnée
  const filteredCategories = data.brand_id
    ? categoriesArray.filter(cat => cat.brand_id.toString() === data.brand_id)
    : categoriesArray;

  return (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal={false}>
      {/* Only show trigger button when not in duplicate mode */}
      {!duplicateData && isOpen === undefined && (
        <DialogTrigger asChild>
          <Button id="add-product-button" className="h-10 w-full sm:w-auto">
            Ajouter un Produit
          </Button>
        </DialogTrigger>
      )}
      <DialogContent
        className="w-[95vw] max-w-[900px] max-h-[95vh] overflow-y-auto p-4 sm:p-6 sm:max-w-[900px] md:p-7 md:px-8 poppins"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl md:text-[22px] text-center sm:text-left">
            Ajouter un Produit
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-center sm:text-left">
            Remplissez le formulaire pour ajouter un nouveau produit
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Référence */}
            <div className="space-y-1">
              <Label htmlFor="product_Ref">Référence</Label>
              <Input
                id="product_Ref"
                name="product_Ref"
                type="text"
                placeholder="PR-1234-ABC"
                className="h-10 sm:h-11"
                value={data.product_Ref}
                onChange={e => setData('product_Ref', e.target.value)}
              />
              {errors.product_Ref && (
                <p className="text-xs text-red-500">{errors.product_Ref}</p>
              )}
            </div>

            {/* Libellé */}
            <div className="space-y-1">
              <Label htmlFor="product_libelle">Libellé</Label>
              <Input
                id="product_libelle"
                name="product_libelle"
                type="text"
                placeholder="Nom du produit"
                className="h-10 sm:h-11"
                value={data.product_libelle}
                onChange={e => setData('product_libelle', e.target.value)}
              />
              {errors.product_libelle && (
                <p className="text-xs text-red-500">{errors.product_libelle}</p>
              )}
            </div>

            {/* Marque */}
            <div className="space-y-1">
              <Label htmlFor="brand_id">Marque</Label>
              <select
                id="brand_id"
                name="brand_id"
                value={data.brand_id}
                onChange={(e) => {
                  setData('brand_id', e.target.value);
                  setData('category_id', ''); // Reset category when brand changes
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Sélectionner une marque</option>
                {brandsArray.map((brand) => (
                  <option key={brand.id} value={brand.id.toString()}>
                    {brand.brand_name}
                  </option>
                ))}
              </select>
              {errors.brand_id && (
                <p className="text-xs text-red-500">{errors.brand_id}</p>
              )}
            </div>

            {/* Catégorie */}
            <div className="space-y-1">
              <Label htmlFor="category_id">Catégorie</Label>
              <select
                id="category_id"
                name="category_id"
                value={data.category_id}
                onChange={(e) => setData('category_id', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!data.brand_id}
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {filteredCategories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.category_name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-xs text-red-500">{errors.category_id}</p>
              )}
            </div>

            {/* Prix d'achat colis */}
            <div className="space-y-1">
              <Label htmlFor="prix_achat_colis">Prix d'achat colis (Dhs)</Label>
              <Input
                id="prix_achat_colis"
                name="prix_achat_colis"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="h-10 sm:h-11"
                value={data.prix_achat_colis}
                onChange={e => setData('prix_achat_colis', e.target.value)}
              />
              {errors.prix_achat_colis && (
                <p className="text-xs text-red-500">{errors.prix_achat_colis}</p>
              )}
            </div>

            {/* Prix d'achat unité */}
            <div className="space-y-1">
              <Label htmlFor="prix_achat_unite">Prix d'achat unité (Dhs)</Label>
              <Input
                id="prix_achat_unite"
                name="prix_achat_unite"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="h-10 sm:h-11"
                value={data.prix_achat_unite}
                onChange={e => setData('prix_achat_unite', e.target.value)}
              />
              {errors.prix_achat_unite && (
                <p className="text-xs text-red-500">{errors.prix_achat_unite}</p>
              )}
            </div>

            {/* Prix de vente colis */}
            <div className="space-y-1">
              <Label htmlFor="prix_vente_colis">Prix de vente colis (Dhs)</Label>
              <Input
                id="prix_vente_colis"
                name="prix_vente_colis"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="h-10 sm:h-11"
                value={data.prix_vente_colis}
                onChange={e => setData('prix_vente_colis', e.target.value)}
              />
              {errors.prix_vente_colis && (
                <p className="text-xs text-red-500">{errors.prix_vente_colis}</p>
              )}
            </div>

            {/* Prix de vente unité */}
            <div className="space-y-1">
              <Label htmlFor="prix_vente_unite">Prix de vente unité (Dhs)</Label>
              <Input
                id="prix_vente_unite"
                name="prix_vente_unite"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="h-10 sm:h-11"
                value={data.prix_vente_unite}
                onChange={e => setData('prix_vente_unite', e.target.value)}
              />
              {errors.prix_vente_unite && (
                <p className="text-xs text-red-500">{errors.prix_vente_unite}</p>
              )}
            </div>

            {/* Poids */}
            <div className="space-y-1">
              <Label htmlFor="product_Poids">Poids (kg)</Label>
              <Input
                id="product_Poids"
                name="product_Poids"
                type="number"
                step="0.001"
                min="0"
                placeholder="0.000"
                className="h-10 sm:h-11"
                value={data.product_Poids}
                onChange={e => setData('product_Poids', e.target.value)}
              />
              {errors.product_Poids && (
                <p className="text-xs text-red-500">{errors.product_Poids}</p>
              )}
            </div>

            {/* Nombre d'unités par colis */}
            <div className="space-y-1">
              <Label htmlFor="nombre_unite_par_colis">Nombre d'unités par colis *</Label>
              <Input
                id="nombre_unite_par_colis"
                name="nombre_unite_par_colis"
                type="number"
                min="1"
                max="9999"
                placeholder="Ex: 12"
                className="h-10 sm:h-11"
                value={data.nombre_unite_par_colis}
                onChange={e => setData('nombre_unite_par_colis', e.target.value)}
                required
              />
              {errors.nombre_unite_par_colis && (
                <p className="text-xs text-red-500">{errors.nombre_unite_par_colis}</p>
              )}
            </div>

            {/* Statut actif */}
            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="product_isActive"
                name="product_isActive"
                checked={data.product_isActive}
                onCheckedChange={(checked) => setData('product_isActive', checked as boolean)}
              />
              <Label htmlFor="product_isActive">Produit actif</Label>
            </div>
          </div>

          {/* Observation */}
          <div className="space-y-1">
            <Label htmlFor="observation">Observation (optionnel)</Label>
            <Textarea
              id="observation"
              name="observation"
              placeholder="Notes ou observations sur le produit..."
              className="resize-none"
              rows={3}
              value={data.observation}
              onChange={e => setData('observation', e.target.value)}
            />
            {errors.observation && (
              <p className="text-xs text-red-500">{errors.observation}</p>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={processing}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="w-full sm:w-auto"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer le produit'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
