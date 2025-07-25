"use client";
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Entrer } from "../types";
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
  [key: string]: string;
  product_id: string;
  ref_produit: string;
  prix_achat_produit: string;
  quantite_produit: string;
  total: string;
  manque: string;
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
            {products.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                Chargement des produits...
              </div>
            ) : filteredProducts.length === 0 ? (
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

interface EntrerEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  entrer: Entrer;
  products?: Product[];
  transporteurs?: Transporteur[];
}

export default function EntrerEditDialog({
  isOpen,
  onOpenChange,
  entrer,
  products = [],
  transporteurs = []
}: EntrerEditDialogProps) {
  const { can } = usePermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [currentEntrerId, setCurrentEntrerId] = useState<number | null>(null);

  // Fonction pour convertir une date ISO en format yyyy-MM-dd
  const formatDateForInput = (dateString: string | null): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return '';
    }
  };

  // Fonction pour s'assurer qu'une valeur n'est jamais null
  const ensureString = (value: unknown): string => {
    return value?.toString() || '';
  };

    // Fonction pour formater les nombres en format français
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

  // État local pour les données du formulaire (évite les conflits avec useForm)
  const [formData, setFormData] = useState({
    numero_bl: '',
    transporteur_id: '',
    date_charge: '',
    date_decharge: '',
    product_lines: [] as ProductLine[],
  });

  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Utiliser formData.product_lines comme source de vérité unique
  const productLines = formData.product_lines;

    // Fonction pour récupérer les détails du produit sélectionné
  const handleProductChange = async (productId: string, lineIndex: number) => {
    if (!productId) {
      setFormData(prev => {
        const updatedLines = [...prev.product_lines];
        updatedLines[lineIndex] = {
          ...updatedLines[lineIndex],
          ref_produit: '',
          prix_achat_produit: '',
          total: '',
        };
        return { ...prev, product_lines: updatedLines };
      });
      return;
    }

    try {
      const response = await fetch(`/api/product-details/${productId}`);
      if (response.ok) {
        const productDetails = await response.json();
        const prix = productDetails.prix_achat_colis ? productDetails.prix_achat_colis.toString() : '0';

        setFormData(prev => {
          const currentLine = prev.product_lines[lineIndex];
          const total = calculateTotal(prix, currentLine?.quantite_produit || '');

          const updatedLines = [...prev.product_lines];
          updatedLines[lineIndex] = {
            ...updatedLines[lineIndex],
            ref_produit: productDetails.ref_produit || '',
            prix_achat_produit: prix,
            total: total,
          };
          return { ...prev, product_lines: updatedLines };
        });
      } else {
        console.error('Erreur API product-details:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du produit:', error);
    }
  };

    // Fonction pour charger les données du BL
  const loadBlData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bl-details/${encodeURIComponent(entrer.numero_bl)}`);
      if (response.ok) {
        const blData = await response.json();

        // Vérifier et corriger les product_lines pour s'assurer qu'ils existent dans la liste des produits
        const validatedProductLines = (blData.product_lines || []).map((line: Record<string, unknown>) => {
          const productId = String(line.product_id);
          const productExists = products.some(p => p.id.toString() === productId);

          if (!productExists) {
            return {
              ...line,
              product_id: '', // Réinitialiser si le produit n'existe pas
              ref_produit: '',
              prix_achat_produit: '',
              total: '',
              quantite_produit: ensureString(line.quantite_produit),
              manque: ensureString(line.manque),
            };
          }
          return {
            ...line,
            product_id: productId,
            ref_produit: ensureString(line.ref_produit),
            prix_achat_produit: ensureString(line.prix_achat_produit),
            total: ensureString(line.total),
            quantite_produit: ensureString(line.quantite_produit),
            manque: ensureString(line.manque),
          };
        });

        const formattedData = {
          numero_bl: blData.numero_bl || '',
          transporteur_id: blData.transporteur_id?.toString() || '',
          date_charge: formatDateForInput(blData.date_charge),
          date_decharge: formatDateForInput(blData.date_decharge),
          product_lines: validatedProductLines,
        };

        // Mettre à jour les données en une seule fois pour éviter les conflits
        setFormData(formattedData);
      } else {
        toast.error('Erreur lors du chargement des données du BL');
      }
    } catch {
      toast.error('Erreur lors du chargement des données du BL');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour ajouter une ligne de produit
  const addProductLine = () => {
    const newLine: ProductLine = {
      product_id: '',
      ref_produit: '',
      prix_achat_produit: '',
      quantite_produit: '',
      total: '',
      manque: '',
    };
    setFormData(prev => ({
      ...prev,
      product_lines: [newLine, ...prev.product_lines]
    }));
  };

  // Fonction pour supprimer une ligne de produit
  const removeProductLine = (index: number) => {
    setFormData(prev => {
      const mainLine = prev.product_lines[index];
      // Supprimer la ligne principale et toute ligne offerte associée (prix=0, ref_produit identique)
      const filteredLines = prev.product_lines.filter((line, i) => {
        if (i === index) return false; // ligne principale supprimée
        // Si la ligne a prix=0 et même ref_produit, c'est la promo associée
        if (Number(line.prix_achat_produit) === 0 && line.ref_produit === mainLine.ref_produit) return false;
        return true;
      });
      return { ...prev, product_lines: filteredLines };
    });
  };

  // Fonction pour mettre à jour une ligne de produit
  const updateProductLine = (index: number, field: keyof ProductLine, value: string) => {
    setFormData(prev => {
      const updatedLines = [...prev.product_lines];
      const currentLine = updatedLines[index];

      updatedLines[index] = {
        ...currentLine,
        [field]: value,
      };

      // Recalculer le total si la quantité ou le prix change
      if (field === 'quantite_produit' || field === 'prix_achat_produit') {
        const prix = field === 'prix_achat_produit' ? value : currentLine.prix_achat_produit;
        const quantite = field === 'quantite_produit' ? value : currentLine.quantite_produit;
        const total = calculateTotal(prix, quantite);
        updatedLines[index].total = total;
      }

      return { ...prev, product_lines: updatedLines };
    });
  };

  // Calculer le total général
  const totalGeneral = productLines.reduce((total, line) => {
    const prix = parseFloat(ensureString(line.prix_achat_produit)) || 0;
    const quantite = parseInt(ensureString(line.quantite_produit)) || 0;
    return total + (prix * quantite);
  }, 0);

  // Vérifier si une ligne est valide
  const isLineValid = (line: ProductLine): boolean => {
    return !!(line.product_id && line.quantite_produit && parseInt(line.quantite_produit) > 0);
  };

  // Vérifier si un champ a une erreur
  const hasError = (field: string): boolean => {
    return !!errors[field];
  };

  // Vérifier si un champ est valide
  const isValid = (field: string): boolean => {
    return !hasError(field) && !!(formData as Record<string, unknown>)[field];
  };

  // Mettre à jour le formulaire quand l'entrer change
  useEffect(() => {
    if (isOpen && currentEntrerId !== entrer.id) {
      setCurrentEntrerId(entrer.id);
      loadBlData();
    }
  }, [isOpen, entrer.id, currentEntrerId]);

  // Effet pour supprimer automatiquement les erreurs quand les champs deviennent valides
  useEffect(() => {
    try {
      // Supprimer l'erreur du numéro BL si le champ est maintenant valide
      if (formData.numero_bl && formData.numero_bl.trim()) {
        if (errors.numero_bl) {
          const newErrors = { ...errors };
          delete newErrors.numero_bl;
          setErrors(newErrors);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'erreur numero_bl:', error);
    }
  }, [formData.numero_bl]); // Retirer errors des dépendances

  useEffect(() => {
    try {
      // Supprimer l'erreur du transporteur si le champ est maintenant valide
      if (formData.transporteur_id) {
        if (errors.transporteur_id) {
          const newErrors = { ...errors };
          delete newErrors.transporteur_id;
          setErrors(newErrors);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'erreur transporteur_id:', error);
    }
  }, [formData.transporteur_id]); // Retirer errors des dépendances

  useEffect(() => {
    try {
      // Supprimer l'erreur de la date de charge si le champ est maintenant valide
      if (formData.date_charge) {
        if (errors.date_charge) {
          const newErrors = { ...errors };
          delete newErrors.date_charge;
          setErrors(newErrors);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'erreur date_charge:', error);
    }
  }, [formData.date_charge]); // Retirer errors des dépendances

  // Effet pour supprimer les erreurs des lignes de produits quand elles deviennent valides
  useEffect(() => {
    try {
      let hasChanges = false;
      const newErrors = { ...errors };

      productLines.forEach((line, index) => {
        // Vérifier si la ligne est maintenant valide
        if (line.product_id && line.quantite_produit && parseInt(line.quantite_produit) > 0) {
          // Supprimer les erreurs de cette ligne seulement si elles existent
          if (newErrors[`product_lines.${index}.product_id`]) {
            delete newErrors[`product_lines.${index}.product_id`];
            hasChanges = true;
          }
          if (newErrors[`product_lines.${index}.quantite_produit`]) {
            delete newErrors[`product_lines.${index}.quantite_produit`];
            hasChanges = true;
          }
        }
      });

      // Mettre à jour seulement s'il y a des changements
      if (hasChanges) {
        setErrors(newErrors);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression des erreurs des lignes de produits:', error);
    }
  }, [productLines]); // Retirer errors des dépendances pour éviter les boucles

  if (!can('entrers.edit')) {
    return null;
  }

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    // Validation côté client avant soumission
    const validationErrors: Record<string, string> = {};

    // Vérifier les champs obligatoires
    if (!formData.numero_bl.trim()) {
      validationErrors.numero_bl = 'Le numéro BL est obligatoire';
    }
    if (!formData.transporteur_id) {
      validationErrors.transporteur_id = 'Le transporteur est obligatoire';
    }
    if (!formData.date_charge) {
      validationErrors.date_charge = 'La date de charge est obligatoire';
    }

    // Vérifier qu'il y a au moins un produit
    if (productLines.length === 0) {
      validationErrors.product_lines = 'Veuillez ajouter au moins un produit';
    } else {
      // Vérifier chaque ligne de produit
      productLines.forEach((line, index) => {
        if (!line.product_id) {
          validationErrors[`product_lines.${index}.product_id`] = 'Le produit est obligatoire';
        }
        if (!line.quantite_produit || parseInt(line.quantite_produit) <= 0) {
          validationErrors[`product_lines.${index}.quantite_produit`] = 'La quantité doit être supérieure à 0';
        }
      });
    }

    // Si il y a des erreurs de validation, les afficher et arrêter
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Veuillez corriger les erreurs avant de continuer');
      setProcessing(false);
      return;
    }

    // Préparer les données pour la mise à jour
    const updateData = {
      ...formData,
      product_lines: productLines.map(line => ({
        product_id: line.product_id,
        ref_produit: line.ref_produit,
        prix_achat_produit: line.prix_achat_produit,
        quantite_produit: line.quantite_produit,
        total: line.total,
        manque: line.manque,
      })),
      // Ajouter l'ID original pour éviter la création d'un nouveau BL
      original_numero_bl: entrer.numero_bl,
    };

    // Utiliser Inertia.js pour la mise à jour
    router.put(route('entrers.update', { entrer: entrer.id }), updateData, {
      onSuccess: () => {
        toast.success('BL mis à jour avec succès!');
        onOpenChange(false);
      },
      onError: (errors) => {
        setErrors(errors);
        toast.error('Échec de la mise à jour du BL!');
      },
      onFinish: () => {
        setProcessing(false);
      },
      preserveScroll: true,
    });
  };

  const handleCancel = () => {
    setFormData({
      numero_bl: '',
      transporteur_id: '',
      date_charge: '',
      date_decharge: '',
      product_lines: [],
    });
    setCurrentEntrerId(null);
    setErrors({});
    onOpenChange(false);
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-[800px] max-h-[95vh] overflow-y-auto p-4 sm:p-6 sm:max-w-[800px] md:p-7 md:px-8 poppins">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              Chargement...
            </DialogTitle>
            <DialogDescription className="sr-only">
              Chargement des données du BL
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement des données...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        key={`entrer-edit-${entrer.id}`}
        className="w-[95vw] max-w-[1200px] max-h-[95vh] overflow-y-auto p-4 sm:p-6 sm:max-w-[1200px] md:p-7 md:px-8 poppins mt-8"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl md:text-[22px] text-center sm:text-left flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            Modifier le BL
          </DialogTitle>
          <DialogDescription className="sr-only">
            Formulaire pour modifier le BL
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
                Modifiez les détails principaux du bon de livraison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="edit-numero-bl" className="text-sm font-medium flex items-center gap-1">
                    Numéro BL
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="edit-numero-bl"
                      name="numero_bl"
                      type="text"
                      placeholder="Entrez le numéro BL"
                      className="h-10 sm:h-11 transition-all duration-200"
                      value={formData.numero_bl}
                      onChange={(e) => setFormData(prev => ({ ...prev, numero_bl: e.target.value }))}
                      required
                      aria-describedby={hasError('numero_bl') ? 'edit-numero-bl-error' : undefined}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isValid('numero_bl') && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {hasError('numero_bl') && <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                  {errors.numero_bl && (
                    <p id="edit-numero-bl-error" className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.numero_bl}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="edit-transporteur-select" className="text-sm font-medium flex items-center gap-1">
                    Immatricule transporteur
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <select
                      id="edit-transporteur-select"
                      name="transporteur_id"
                      value={formData.transporteur_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, transporteur_id: e.target.value }))}
                      className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                      required
                      aria-describedby={hasError('transporteur_id') ? 'edit-transporteur-error' : undefined}
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
                    <p id="edit-transporteur-error" className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.transporteur_id}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="edit-date-charge" className="text-sm font-medium flex items-center gap-1">
                    Date de charge
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-date-charge"
                    name="date_charge"
                    type="date"
                    className="h-10 sm:h-11 transition-all duration-200"
                    value={formData.date_charge}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_charge: e.target.value }))}
                    required
                    aria-describedby={hasError('date_charge') ? 'edit-date-charge-error' : undefined}
                  />
                  {errors.date_charge && (
                    <p id="edit-date-charge-error" className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.date_charge}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="edit-date-decharge" className="text-sm font-medium flex items-center gap-2">
                    Date de décharge
                    <Badge variant="secondary" className="text-xs">Optionnel</Badge>
                  </Label>
                  <Input
                    id="edit-date-decharge"
                    type="date"
                    className="h-10 sm:h-11 transition-all duration-200"
                    value={formData.date_decharge}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_decharge: e.target.value }))}
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
                    <Label className="text-sm font-medium text-gray-700">Manque</Label>
                  </div>
                  <div className="md:col-span-1">
                    <Label className="text-sm font-medium text-gray-700">Action</Label>
                  </div>
                </div>

                {productLines.map((line, index) => {
                  const isOffered = line.prix_achat_produit !== '' && Number(line.prix_achat_produit) === 0;
                  return (
                    <div
                      key={index}
                      className={cn(
                        "border rounded-lg p-4 bg-background hover:shadow-md transition-all duration-200 group relative",
                        isOffered && "bg-blue-100 border-blue-400"
                      )}
                    >
                      {/* Badge Offert */}
                      {isOffered && (
                        <Badge
                          variant="outline"
                          className="absolute top-2 left-2 text-xs bg-blue-100 text-blue-800 border-blue-200"
                        >
                          Offert
                        </Badge>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-13 gap-4 items-end">
                        <div className="md:col-span-4">
                          <ProductCombobox
                            products={products}
                            value={line.product_id}
                            onValueChange={(value) => {
                              updateProductLine(index, 'product_id', value);
                              handleProductChange(value, index);
                            }}
                            placeholder="Sélectionnez un produit..."
                            disabled={isOffered}
                          />
                          {errors[`product_lines.${index}.product_id`] && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors[`product_lines.${index}.product_id`]}
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-1">
                          <Input
                            id={`edit-quantite-${index}`}
                            name={`product_lines[${index}][quantite_produit]`}
                            type="number"
                            min="1"
                            placeholder="Qté"
                            className="h-10 sm:h-11 w-[calc(100%+8px)]"
                            value={ensureString(line.quantite_produit)}
                            onChange={(e) => updateProductLine(index, 'quantite_produit', e.target.value)}
                            required
                            readOnly={isOffered}
                            onBlur={async () => {
                              if (isOffered) return;
                              // Ajout logique d'ajout automatique du produit offert (promotion)
                              if (line.product_id && line.quantite_produit && parseInt(line.quantite_produit) > 0) {
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
                                      const offeredIndex = productLines.findIndex((l, i) => i !== index && Number(l.prix_achat_produit) === 0 && l.ref_produit === promoData.offered_product?.ref_produit);
                                      if (nb_offerts > 0 && promoData.exists && promoData.offered_product) {
                                        if (offeredIndex !== -1) {
                                          // Mise à jour de la ligne offerte existante
                                          setFormData(prev => {
                                            const updatedLines = prev.product_lines.map((l, i) =>
                                              i === offeredIndex
                                                ? {
                                                    ...l,
                                                    product_id: promoData.offered_product.product_id?.toString() || '',
                                                    ref_produit: promoData.offered_product.ref_produit || '',
                                                    prix_achat_produit: '0',
                                                    quantite_produit: nb_offerts.toString(),
                                                    total: '0',
                                                    manque: '',
                                                  }
                                                : l
                                            );
                                            return { ...prev, product_lines: updatedLines };
                                          });
                                        } else {
                                          // Ajout d'une nouvelle ligne offerte
                                          setFormData(prev => {
                                            const newLines = [
                                              ...prev.product_lines,
                                              {
                                                product_id: promoData.offered_product.product_id?.toString() || '',
                                                ref_produit: promoData.offered_product.ref_produit || '',
                                                prix_achat_produit: '0',
                                                quantite_produit: nb_offerts.toString(),
                                                total: '0',
                                                manque: '',
                                              }
                                            ];
                                            return { ...prev, product_lines: newLines };
                                          });
                                        }
                                        toast.success('Produit offert ajouté automatiquement (promotion)');
                                      } else {
                                        // Suppression de la ligne offerte si plus de lot atteint
                                        if (offeredIndex !== -1) {
                                          setFormData(prev => {
                                            const filteredLines = prev.product_lines.filter((_, i) => i !== offeredIndex);
                                            return { ...prev, product_lines: filteredLines };
                                          });
                                        }
                                      }
                                    }
                                  } catch (error) {
                                    console.error('Erreur lors de la récupération de la promotion:', error);
                                    toast.error('Erreur lors de la récupération de la promotion');
                                  }
                                }
                              }
                            }}
                          />
                          {errors[`product_lines.${index}.quantite_produit`] && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors[`product_lines.${index}.quantite_produit`]}
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <Input
                            id={`edit-ref-${index}`}
                            name={`product_lines[${index}][ref_produit]`}
                            type="text"
                            placeholder="Référence automatique"
                            className="h-10 sm:h-11 bg-muted"
                            value={ensureString(line.ref_produit)}
                            readOnly
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Input
                            id={`edit-prix-${index}`}
                            name={`product_lines[${index}][prix_achat_produit]`}
                            type="text"
                            placeholder="Prix automatique"
                            className="h-10 sm:h-11"
                            value={line.prix_achat_produit ? formatNumber(line.prix_achat_produit) : ''}
                            onChange={(e) => {
                              const newPrix = e.target.value.replace(/[^\d,]/g, '').replace(',', '.');
                              updateProductLine(index, 'prix_achat_produit', newPrix);
                            }}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Input
                            id={`edit-total-${index}`}
                            name={`product_lines[${index}][total]`}
                            type="text"
                            placeholder="Total"
                            className="h-10 sm:h-11 bg-muted font-medium"
                            value={line.total ? formatNumber(line.total) : ''}
                            readOnly
                          />
                        </div>

                        <div className="md:col-span-1">
                          <Input
                            id={`edit-manque-${index}`}
                            name={`product_lines[${index}][manque]`}
                            type="number"
                            min="0"
                            placeholder="Manque"
                            className="h-10 sm:h-11"
                            value={ensureString(line.manque)}
                            onChange={(e) => updateProductLine(index, 'manque', e.target.value)}
                          />
                        </div>

                        <div className="md:col-span-1 flex items-end justify-center">
                          {productLines.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeProductLine(index)}
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
                    </div>
                  );
                })}

                {/* Message si aucun produit */}
                {productLines.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun produit ajouté</p>
                    <p className="text-sm">Cliquez sur "Ajouter un produit" pour commencer</p>
                  </div>
                )}
              </div>

              {errors.product_lines && (
                <Alert variant="destructive" className="mt-4 border-red-200 bg-red-50">
                  <AlertCircle className="w-4 h-4" />
                  <AlertTitle>Erreur de validation</AlertTitle>
                  <AlertDescription>
                    {errors.product_lines}
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
              onClick={() => {
                loadBlData();
                setErrors({});
              }}
              className="transition-all duration-200 hover:bg-muted flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </Button>

            <DialogFooter className="flex flex-col sm:flex-row gap-4 sm:gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto transition-all duration-200"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={processing || productLines.length === 0}
                className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
              >
                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Check className="mr-2 h-4 w-4" />
                Mettre à jour
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
