"use client";
import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Check, ChevronsUpDown, Truck, Package, AlertCircle, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import toast from 'react-hot-toast';
import { usePermissions } from '@/hooks/use-permissions';
import { cn } from "@/lib/utils";
import React from 'react';

interface Product {
  id: number;
  product_libelle: string;
  product_Ref: string;
  product_isActive: boolean;
  prix_achat_colis: number;
}

interface Transporteur {
  id: number;
  conducteur_name: string;
  vehicule_matricule: string;
}

interface ProductLine {
  id: string;
  product_id: string;
  ref_produit: string;
  prix_achat_produit: string;
  quantite_produit: string;
  total: string;
  manque: string;
  // Ajout pour gestion frontend des lignes offertes
  _isOffered?: boolean;
  _mainLineId?: string;
}

// Composant ProductCombobox pour la sélection avec recherche
function ProductCombobox({
  products,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Sélectionnez un produit..."
}: {
  products: Product[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const comboboxRef = React.useRef<HTMLDivElement>(null);

  const selectedProduct = products.find(product => product.id.toString() === value);

  // Filtrer les produits basé sur la recherche
  const filteredProducts = products.filter(product => {
    if (!searchValue) return true;
    const searchLower = searchValue.toLowerCase();
    return (
      product.product_libelle.toLowerCase().includes(searchLower) ||
      product.product_Ref.toLowerCase().includes(searchLower)
    );
  });

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id.toString() === productId);
    if (product && product.product_isActive) {
      onValueChange(productId);
      setOpen(false);
      setSearchValue("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // Ajout: fermeture du dropdown lors d'un clic extérieur
  React.useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={comboboxRef}
      className="relative"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between h-10 sm:h-11 transition-all duration-200 hover:shadow-sm"
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        {selectedProduct ? (
          <span className={cn(
            "truncate",
            !selectedProduct.product_isActive && "text-gray-400"
          )}>
            {selectedProduct.product_libelle}
            {!selectedProduct.product_isActive && " (inactif)"}
          </span>
        ) : (
          placeholder
        )}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div
          className="absolute bottom-full left-0 right-0 z-50 mb-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-[300px] overflow-hidden animate-in slide-in-from-top-2 duration-200"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="p-2 border-b bg-gray-50">
            <Input
              placeholder="Rechercher un produit..."
              value={searchValue}
              onChange={handleInputChange}
              className="mb-2"
              autoFocus
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
            />
          </div>
          <div className="max-h-[250px] overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                Aucun produit trouvé.
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={cn(
                    "flex items-center gap-2 p-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 transition-colors duration-150",
                    !product.product_isActive && "opacity-50 cursor-not-allowed",
                    value === product.id.toString() && "bg-blue-100"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleProductSelect(product.id.toString());
                  }}
                  onMouseDown={() => {
                  }}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      value === product.id.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className={cn(
                      "truncate font-medium",
                      !product.product_isActive && "text-gray-400"
                    )}>
                      {product.product_libelle}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      Ref: {product.product_Ref}
                    </span>
                  </div>
                  {!product.product_isActive && (
                    <Badge variant="secondary" className="text-xs">
                      Inactif
                    </Badge>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EntrerDialog({
  products = [],
  transporteurs = []
}: {
  products?: Product[];
  transporteurs?: Transporteur[];
}) {
  const [open, setOpen] = useState(false);
  const { can } = usePermissions();
  const [blExistsError, setBlExistsError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { data, setData, errors, reset, processing } = useForm({
    numero_bl: "",
    transporteur_id: "",
    date_charge: "",
    date_decharge: "",
  });

  // État pour gérer les lignes de produits
  const [productLines, setProductLines] = useState<ProductLine[]>(() => {
    const initialId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    return [{
      id: initialId,
      product_id: '',
      ref_produit: '',
      prix_achat_produit: '',
      quantite_produit: '',
      total: '',
      manque: '',
    }];
  });

  // Fonction pour récupérer les détails du produit sélectionné
  const handleProductChange = async (productId: string, lineId: string) => {
    if (!productId) {
      updateProductLine(lineId, {
        ref_produit: '',
        prix_achat_produit: '',
        total: '',
      });
      return;
    }

    try {
      const response = await fetch(`/api/product-details/${productId}`);
      if (response.ok) {
        const productDetails = await response.json();
        const prix = productDetails.prix_achat_colis ? productDetails.prix_achat_colis.toString() : '0';
        const currentLine = productLines.find(line => line.id === lineId);
        const total = calculateTotal(prix, currentLine?.quantite_produit || '');

        updateProductLine(lineId, {
          ref_produit: productDetails.ref_produit || '',
          prix_achat_produit: prix,
          total: total,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du produit:', error);
    }
  };

  // Fonction pour mettre à jour une ligne de produit
  const updateProductLine = (lineId: string, updates: Partial<ProductLine>) => {
    setProductLines(prev => prev.map(line =>
      line.id === lineId ? { ...line, ...updates } : line
    ));
  };

  // Fonction pour ajouter une nouvelle ligne
  const addProductLine = () => {
    const newId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newLine = {
      id: newId,
      product_id: '',
      ref_produit: '',
      prix_achat_produit: '',
      quantite_produit: '',
      total: '',
      manque: '',
    };
    setProductLines(prev => [newLine, ...prev]);
  };

  // Fonction pour supprimer une ligne
  const removeProductLine = (lineId: string) => {
    // Si c'est une ligne principale, supprimer aussi la ligne offerte associée
    const isMainLine = !lineId.startsWith('offert-');
    if (isMainLine) {
      setProductLines(prev => prev.filter(line => line.id !== lineId && line._mainLineId !== lineId));
    } else {
      // Ne pas permettre la suppression directe d'une ligne offerte
      return;
    }
  };

    // Fonction pour formater les nombres en format français (pour l'affichage uniquement)
  const formatNumber = (value: number | string): string => {
    const num = parseFloat(value?.toString() || '0');
    if (isNaN(num)) return '0,00';

    // Convertir en chaîne avec 2 décimales
    const formatted = num.toFixed(2);

    // Ajouter les espaces pour les milliers
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    return parts.join(',');
  };

  // Fonction pour calculer le total d'une ligne
  const calculateTotal = (prix: string, quantite: string): string => {
    const prixNum = parseFloat(prix) || 0;
    const quantiteNum = parseInt(quantite) || 0;
    return (prixNum * quantiteNum).toString();
  };

  // Fonction pour vérifier si un numéro BL existe déjà
  const checkBlExists = async (numeroBl: string) => {
    if (!numeroBl.trim()) {
      setBlExistsError('');
      return;
    }

    try {
      const response = await fetch(`/api/check-bl-exists/${numeroBl}`);
      if (response.ok) {
        const result = await response.json();
        if (result.exists) {
          setBlExistsError(`Le numéro BL "${numeroBl}" existe déjà dans la base de données.`);
        } else {
          setBlExistsError('');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du BL:', error);
    }
  };

  // Fonction pour réinitialiser complètement le formulaire
  const resetForm = () => {
    reset(); // Réinitialiser les erreurs d'Inertia
    setValidationErrors({});
    setBlExistsError('');
    const resetId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setProductLines([{
      id: resetId,
      product_id: '',
      ref_produit: '',
      prix_achat_produit: '',
      quantite_produit: '',
      total: '',
      manque: '',
    }]);
  };

  // Calculer le total général
  const totalGeneral = productLines.reduce((total, line) => {
    const lineTotal = parseFloat(line.total) || 0;
    return total + lineTotal;
  }, 0);

  // Vérifier si une ligne est valide
  const isLineValid = (line: ProductLine): boolean => {
    return !!(line.product_id && line.quantite_produit && parseInt(line.quantite_produit) > 0);
  };

  // Vérifier si un champ a une erreur
  const hasError = (field: string): boolean => {
    return !!(
      (errors as Record<string, string>)[field] ||
      (validationErrors as Record<string, string>)[field] ||
      (field === 'numero_bl' && blExistsError)
    );
  };

  // Vérifier si un champ est valide
  const isValid = (field: string): boolean => {
    return !hasError(field) && !!(data as Record<string, unknown>)[field];
  };

  // Effet pour supprimer automatiquement les erreurs de validation quand les champs deviennent valides
  useEffect(() => {
    try {
      // Supprimer l'erreur du numéro BL si le champ est maintenant valide
      if (data.numero_bl && data.numero_bl.trim() && !blExistsError) {
        if (validationErrors.numero_bl) {
          const newValidationErrors = { ...validationErrors };
          delete newValidationErrors.numero_bl;
          setValidationErrors(newValidationErrors);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'erreur numero_bl:', error);
    }
  }, [data.numero_bl, blExistsError]); // Retirer validationErrors des dépendances

  // Effet pour supprimer l'erreur du transporteur si le champ est maintenant valide
  useEffect(() => {
    try {
      if (data.transporteur_id) {
        if (validationErrors.transporteur_id) {
          const newValidationErrors = { ...validationErrors };
          delete newValidationErrors.transporteur_id;
          setValidationErrors(newValidationErrors);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'erreur transporteur_id:', error);
    }
  }, [data.transporteur_id]); // Retirer validationErrors des dépendances

  // Effet pour supprimer l'erreur de la date de charge si le champ est maintenant valide
  useEffect(() => {
    try {
      if (data.date_charge) {
        if (validationErrors.date_charge) {
          const newValidationErrors = { ...validationErrors };
          delete newValidationErrors.date_charge;
          setValidationErrors(newValidationErrors);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'erreur date_charge:', error);
    }
  }, [data.date_charge]); // Retirer validationErrors des dépendances

  // Effet pour supprimer les erreurs des lignes de produits quand elles deviennent valides
  useEffect(() => {
    try {
      if (productLines && productLines.length > 0) {
        let hasChanges = false;
        const newValidationErrors = { ...validationErrors };

        productLines.forEach((line, index) => {
          // Vérifier si la ligne est maintenant valide
          if (line.product_id && line.quantite_produit && parseInt(line.quantite_produit) > 0) {
            // Supprimer les erreurs de cette ligne seulement si elles existent
            if (newValidationErrors[`product_lines.${index}.product_id`]) {
              delete newValidationErrors[`product_lines.${index}.product_id`];
              hasChanges = true;
            }
            if (newValidationErrors[`product_lines.${index}.quantite_produit`]) {
              delete newValidationErrors[`product_lines.${index}.quantite_produit`];
              hasChanges = true;
            }
          }
        });

        // Mettre à jour seulement s'il y a des changements
        if (hasChanges) {
          setValidationErrors(newValidationErrors);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression des erreurs des lignes de produits:', error);
    }
  }, [productLines]); // Retirer validationErrors des dépendances pour éviter les boucles



  if (!can('entrers.create')) {
    return null;
  }

  const recalcPromotions = async () => {
    let newProductLines = [...productLines];
    for (const line of productLines) {
      if (!line._isOffered && line.product_id && line.quantite_produit && parseInt(line.quantite_produit) > 0) {
        const product = products.find(p => p.id.toString() === line.product_id);
        if (product) {
          const mainRef = product.product_Ref;
          try {
            const promoRes = await fetch(`/promotion-for-product/${mainRef}`);
            if (promoRes.ok) {
              const promoData = await promoRes.json();
              const x = promoData.quantite_produit_promotionnel;
              const y = promoData.offered_product?.quantite_offerte ?? 0;
              const q = parseInt(line.quantite_produit);
              let nb_offerts = 0;
              if (x > 0 && y > 0 && q >= x) {
                nb_offerts = Math.floor(q / x) * y;
              }
              const offeredId = `offert-${line.id}`;
              const offeredIndex = newProductLines.findIndex(l => l.id === offeredId);
              if (nb_offerts > 0 && promoData.exists && promoData.offered_product) {
                if (offeredIndex !== -1) {
                  newProductLines = newProductLines.map(l =>
                    l.id === offeredId
                      ? { ...l, quantite_produit: nb_offerts.toString() }
                      : l
                  );
                } else {
                  newProductLines = [
                    ...newProductLines,
                    {
                      id: offeredId,
                      product_id: promoData.offered_product.product_id?.toString() || '',
                      ref_produit: promoData.offered_product.ref_produit || '',
                      prix_achat_produit: '0',
                      quantite_produit: nb_offerts.toString(),
                      total: '0',
                      manque: '',
                      _isOffered: true,
                      _mainLineId: line.id,
                    }
                  ];
                }
              } else {
                if (offeredIndex !== -1) {
                  newProductLines = newProductLines.filter(l => l.id !== offeredId);
                }
              }
            }
          } catch (error) {
            console.error('Erreur lors de la récupération de la promotion (submit):', error);
          }
        }
      }
    }
    setProductLines(newProductLines);
    return newProductLines;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Recalcule toutes les lignes promotionnelles avant soumission
    const recalculatedLines = await recalcPromotions();

    // Validation côté client avant soumission
    const validationErrors: Record<string, string> = {};

    // Vérifier les champs obligatoires
    if (!data.numero_bl.trim()) {
      validationErrors.numero_bl = 'Le numéro BL est obligatoire';
    }
    if (!data.transporteur_id) {
      validationErrors.transporteur_id = 'Le transporteur est obligatoire';
    }
    if (!data.date_charge) {
      validationErrors.date_charge = 'La date de charge est obligatoire';
    }

    // Vérifier qu'il y a au moins un produit avec des données valides
    const validProductLines = recalculatedLines.filter(line =>
      line.product_id && line.quantite_produit && parseInt(line.quantite_produit) >= 1
    );

    if (validProductLines.length === 0) {
      validationErrors.product_lines = 'Veuillez ajouter au moins un produit avec une quantité valide';
    } else {
      // Vérifier chaque ligne de produit
      recalculatedLines.forEach((line, index) => {
        if (line.product_id && (!line.quantite_produit || parseInt(line.quantite_produit) < 1)) {
          validationErrors[`product_lines.${index}.quantite_produit`] = 'La quantité doit être supérieure à 0';
        }
      });
    }

    // Si il y a des erreurs de validation, les afficher et arrêter
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      toast.error('Veuillez corriger les erreurs avant de continuer');
      console.log('Validation errors:', validationErrors);
      return;
    }

    // Réinitialiser les erreurs de validation
    setValidationErrors({});

    // Préparer les données pour l'envoi (seulement les lignes valides)
    const submitData = {
      ...data,
      product_lines: validProductLines.map(line => ({
        product_id: line.product_id,
        ref_produit: line.ref_produit,
        prix_achat_produit: (line.prix_achat_produit === undefined || line.prix_achat_produit === null || line.prix_achat_produit === '')
          ? null
          : parseFloat(line.prix_achat_produit.toString().replace(/\s/g, '').replace(',', '.')),
        quantite_produit: line.quantite_produit,
        total: line.total,
        manque: line.manque,
      })),
    };

    console.log('Submit data:', submitData);

    // Utiliser router.post pour envoyer les données personnalisées
    router.post(route('entrers.store'), submitData, {
      onSuccess: () => {
        toast.success('Entrée(s) créée(s) avec succès!');
        reset();
        const resetId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        setProductLines([{
          id: resetId,
          product_id: '',
          ref_produit: '',
          prix_achat_produit: '',
          quantite_produit: '',
          total: '',
          manque: '',
        }]);
        setOpen(false);
        console.log('Création réussie');
      },
      onError: (errors) => {
        // Afficher les erreurs retournées par le backend
        console.log('Backend errors:', errors);
      },
      preserveScroll: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        // Réinitialiser complètement quand la modal se ferme
        resetForm();
      } else {
        // Réinitialiser les erreurs quand la modal s'ouvre
        setValidationErrors({});
        setBlExistsError('');
      }
    }}>
      <DialogTrigger asChild>
        <Button id="add-entrer-button" className="h-10 w-full sm:w-auto justify-start transition-all duration-200 hover:scale-105">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une Entrée
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-[95vw] max-w-[1200px] max-h-[95vh] overflow-y-auto p-4 sm:p-6 sm:max-w-[1200px] md:p-7 md:px-8 poppins mt-8"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-[22px] text-center sm:text-left flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            Ajouter une Entrée
          </DialogTitle>
          <DialogDescription className="sr-only">
            Formulaire pour ajouter une nouvelle entrée
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section des informations générales avec Card moderne */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Truck className="w-5 h-5" />
                Informations générales du BL
              </CardTitle>
              <CardDescription>
                Renseignez les détails principaux du bon de livraison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="numero-bl" className="text-sm font-medium flex items-center gap-1">
                    Numéro BL
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="numero-bl"
                      name="numero_bl"
                      type="text"
                      placeholder="BL-2024-001"
                      className="h-10 sm:h-11 transition-all duration-200"
                      value={data.numero_bl}
                      onChange={(e) => setData('numero_bl', e.target.value)}
                      onBlur={(e) => checkBlExists(e.target.value)}
                      aria-describedby={hasError('numero_bl') ? 'numero-bl-error' : undefined}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isValid('numero_bl') && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {hasError('numero_bl') && <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                  {errors.numero_bl && (
                    <p id="numero-bl-error" className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.numero_bl}
                    </p>
                  )}
                  {validationErrors.numero_bl && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {validationErrors.numero_bl}
                    </p>
                  )}
                  {blExistsError && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {blExistsError}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="transporteur-select" className="text-sm font-medium flex items-center gap-1">
                    Immatricule transporteur
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <select
                      id="transporteur-select"
                      name="transporteur_id"
                      value={data.transporteur_id}
                      onChange={(e) => setData('transporteur_id', e.target.value)}
                      className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                      aria-describedby={hasError('transporteur_id') ? 'transporteur-error' : undefined}
                    >
                      <option value="">Sélectionnez un transporteur...</option>
                      {transporteurs.map((transporteur) => (
                        <option
                          key={transporteur.id}
                          value={transporteur.id.toString()}
                        >
                          {transporteur.vehicule_matricule} - {transporteur.conducteur_name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isValid('transporteur_id') && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {hasError('transporteur_id') && <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                  {errors.transporteur_id && (
                    <p id="transporteur-error" className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.transporteur_id}
                    </p>
                  )}
                  {validationErrors.transporteur_id && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {validationErrors.transporteur_id}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="date-charge" className="text-sm font-medium flex items-center gap-1">
                    Date de charge
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date-charge"
                    name="date_charge"
                    type="date"
                    className="h-10 sm:h-11 transition-all duration-200"
                    value={data.date_charge}
                    onChange={(e) => setData('date_charge', e.target.value)}
                    aria-describedby={hasError('date_charge') ? 'date-charge-error' : undefined}
                  />
                  {errors.date_charge && (
                    <p id="date-charge-error" className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.date_charge}
                    </p>
                  )}
                  {validationErrors.date_charge && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {validationErrors.date_charge}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="date-decharge" className="text-sm font-medium flex items-center gap-2">
                    Date de décharge
                    <Badge variant="secondary" className="text-xs">Optionnel</Badge>
                  </Label>
                  <Input
                    id="date-decharge"
                    name="date_decharge"
                    type="date"
                    className="h-10 sm:h-11 transition-all duration-200"
                    value={data.date_decharge}
                    onChange={(e) => setData('date_decharge', e.target.value)}
                  />
                  {errors.date_decharge && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.date_decharge}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section des produits avec Card moderne */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Produits
                  </CardTitle>
                  <CardDescription>
                    Gestion des produits et calculs automatiques
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  {/* Indicateur de total avec badge */}
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total général</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-green-600">
                        {formatNumber(totalGeneral)} DH
                      </p>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Calculé
                      </Badge>
                    </div>
                  </div>
                  {/* Bouton d'ajout avec animation */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addProductLine}
                    className="flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter un produit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* En-têtes des colonnes avec style amélioré */}
                <div className="grid grid-cols-1 md:grid-cols-13 gap-4 px-4 py-3 bg-muted/50 rounded-lg border">
                  <div className="md:col-span-4">
                    <Label className="text-sm font-medium text-gray-700">Nom de produit</Label>
                  </div>
                  <div className="md:col-span-1">
                    <Label className="text-sm font-medium text-gray-700">Quantité</Label>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-700">Référence</Label>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-700">Prix d'achat de colis</Label>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-700">Total</Label>
                  </div>
                  <div className="md:col-span-1">
                    <Label className="text-sm font-medium text-gray-700">Action</Label>
                  </div>
                </div>

                {productLines.map((line, index) => (
                  <div
                    key={line.id}
                    className={cn(
                      "border rounded-lg p-4 bg-background hover:shadow-md transition-all duration-200 group relative",
                      line._isOffered && "bg-blue-50 border-blue-200"
                    )}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-13 gap-4 items-end">
                      <div className="md:col-span-4">
                        <ProductCombobox
                          products={products}
                          value={line.product_id}
                          onValueChange={(value) => {
                            if (line._isOffered) return; // Non éditable
                            updateProductLine(line.id, { product_id: value });
                            handleProductChange(value, line.id);
                          }}
                          placeholder="Sélectionnez un produit..."
                          disabled={!!line._isOffered}
                        />
                        {validationErrors[`product_lines.${index}.product_id`] && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {validationErrors[`product_lines.${index}.product_id`]}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-1">
                        <Input
                          id={`quantite-${line.id}`}
                          name={`product_lines[${index}][quantite_produit]`}
                          type="number"
                          min="1"
                          placeholder="Qté"
                          className="h-10 sm:h-11 w-[calc(100%+8px)]"
                          value={line.quantite_produit}
                          onChange={(e) => {
                            if (line._isOffered) return; // Non éditable
                            const newQuantite = e.target.value;
                            const newTotal = calculateTotal(line.prix_achat_produit, newQuantite);
                            updateProductLine(line.id, {
                              quantite_produit: newQuantite,
                              total: newTotal
                            });
                          }}
                          readOnly={!!line._isOffered}
                          onBlur={async () => {
                            if (line._isOffered) return;
                            // Log pour debug : onBlur appelé
                            console.log('[onBlur] Champ quantité perdu le focus pour la ligne', line.id, line);
                            if (line.product_id && line.quantite_produit && parseInt(line.quantite_produit) > 0) {
                              const product = products.find(p => p.id.toString() === line.product_id);
                              if (product) {
                                const mainRef = product.product_Ref;
                                try {
                                  const promoRes = await fetch(`/promotion-for-product/${mainRef}`);
                                  if (promoRes.ok) {
                                    const promoData = await promoRes.json();
                                    console.log('[onBlur] promoData:', promoData, 'quantité saisie:', line.quantite_produit);
                                    const x = promoData.quantite_produit_promotionnel; // quantité d'achat requise
                                    const y = promoData.offered_product?.quantite_offerte ?? 0; // quantité offerte
                                    const q = parseInt(line.quantite_produit);
                                    let nb_offerts = 0;
                                    if (x > 0 && y > 0 && q >= x) {
                                      nb_offerts = Math.floor(q / x) * y;
                                    }
                                    const offeredId = `offert-${line.id}`;
                                    // Utilise la version fonctionnelle de setProductLines pour garantir l'accès au state à jour
                                    setProductLines(prev => {
                                      const offeredIndex = prev.findIndex(l => l.id === offeredId);
                                      if (nb_offerts > 0 && promoData.exists && promoData.offered_product) {
                                        if (offeredIndex !== -1) {
                                          // Log debug : mise à jour ligne offerte
                                          console.log('[onBlur] Mise à jour ligne offerte', offeredId, 'quantité:', nb_offerts);
                                          return prev.map(l =>
                                            l.id === offeredId
                                              ? { ...l, quantite_produit: nb_offerts.toString() }
                                              : l
                                          );
                                        } else {
                                          // Log debug : ajout ligne offerte
                                          console.log('[onBlur] Ajout ligne offerte', offeredId, 'quantité:', nb_offerts);
                                          toast.success('Produit offert ajouté automatiquement (promotion)');
                                          return [
                                            ...prev,
                                            {
                                              id: offeredId,
                                              product_id: promoData.offered_product.product_id?.toString() || '',
                                              ref_produit: promoData.offered_product.ref_produit || '',
                                              prix_achat_produit: '0',
                                              quantite_produit: nb_offerts.toString(),
                                              total: '0',
                                              manque: '',
                                              _isOffered: true,
                                              _mainLineId: line.id,
                                            }
                                          ];
                                        }
                                      } else {
                                        if (offeredIndex !== -1) {
                                          // Log debug : suppression ligne offerte
                                          console.log('[onBlur] Suppression ligne offerte', offeredId);
                                          return prev.filter(l => l.id !== offeredId);
                                        }
                                        return prev;
                                      }
                                    });
                                  }
                                } catch (error) {
                                  console.error('Erreur lors de la récupération de la promotion:', error);
                                  toast.error('Erreur lors de la récupération de la promotion');
                                }
                              }
                            }
                          }}
                        />
                        {validationErrors[`product_lines.${index}.quantite_produit`] && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {validationErrors[`product_lines.${index}.quantite_produit`]}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <Input
                          id={`ref-produit-${line.id}`}
                          name={`product_lines[${index}][ref_produit]`}
                          type="text"
                          placeholder="Référence automatique"
                          className="h-10 sm:h-11 bg-muted"
                          value={line.ref_produit}
                          readOnly
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Input
                          id={`prix-colis-${line.id}`}
                          name={`product_lines[${index}][prix_achat_produit]`}
                          type="text"
                          placeholder="Prix automatique"
                          className={cn(
                            "h-10 sm:h-11",
                            (() => {
                              // On veut colorier si la valeur (brute ou formatée) est zéro
                              const val = (line.prix_achat_produit ?? '').replace(/\s/g, '').replace(',', '.');
                              return val && parseFloat(val) === 0 ? "bg-yellow-100" : "";
                            })()
                          )}
                          value={line.prix_achat_produit ?? ''}
                          onChange={(e) => {
                            if (line._isOffered) return; // Non éditable
                            // Autoriser la saisie libre (chiffres, virgule, point)
                            const raw = e.target.value.replace(/[^\d.,]/g, '');
                            // Remplacer toutes les virgules par des points pour le calcul
                            const normalized = raw.replace(/,/g, '.');
                            const newTotal = calculateTotal(normalized, line.quantite_produit);
                            updateProductLine(line.id, {
                              prix_achat_produit: raw,
                              total: newTotal
                            });
                          }}
                          onBlur={(e) => {
                            if (line._isOffered) return; // Non éditable
                            // Formatter à la sortie du champ
                            const blurRaw = e.target.value.replace(/[^\d.,]/g, '');
                            const blurNormalized = blurRaw.replace(/,/g, '.');
                            const blurNum = parseFloat(blurNormalized);
                            const blurFormatted = isNaN(blurNum) ? '' : formatNumber(blurNum);
                            updateProductLine(line.id, {
                              prix_achat_produit: blurFormatted
                            });
                          }}
                          readOnly={!!line._isOffered}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Input
                          id={`total-${line.id}`}
                          name={`product_lines[${index}][total]`}
                          type="text"
                          placeholder="Total"
                          className="h-10 sm:h-11 bg-muted font-medium"
                          value={line.total ? formatNumber(line.total) : ''}
                          readOnly
                        />
                      </div>

                      <div className="md:col-span-1 flex items-end justify-center">
                        {productLines.length > 1 && !line._isOffered && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeProductLine(line.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-10 sm:h-11 w-full transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Indicateur de statut de ligne */}
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          isLineValid(line)
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        )}
                      >
                        {isLineValid(line) ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Valide
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Incomplet
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* Affichage du badge "offert" si la ligne est une ligne offerte */}
                    {line._isOffered && (
                      <Badge
                        variant="outline"
                        className="absolute top-2 left-2 text-xs bg-blue-100 text-blue-800 border-blue-200"
                      >
                        Offert
                      </Badge>
                    )}
                  </div>
                ))}

                {/* Message si aucun produit */}
                {productLines.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun produit ajouté</p>
                    <p className="text-sm">Cliquez sur "Ajouter un produit" pour commencer</p>
                  </div>
                )}
              </div>

              {validationErrors.product_lines && (
                <Alert variant="destructive" className="mt-4 border-red-200 bg-red-50">
                  <AlertCircle className="w-4 h-4" />
                  <AlertTitle>Erreur de validation</AlertTitle>
                  <AlertDescription>
                    {validationErrors.product_lines}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Actions principales avec style amélioré */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="transition-all duration-200 hover:bg-muted flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </Button>

            <DialogFooter className="flex flex-col sm:flex-row gap-4 sm:gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                }}
                className="w-full sm:w-auto transition-all duration-200"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={processing}
                className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
              >
                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Check className="mr-2 h-4 w-4" />
                Créer
              </Button>
            </DialogFooter>
          </div>

          {/* Indicateur de progression */}
          {processing && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '33%' }}></div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Traitement en cours...
              </p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
