'use client';

import React from 'react';
import ProtectedCombobox from '@/components/patterns/ProtectedCombobox';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Plus, Trash2, Check, Truck, Package, AlertCircle, CheckCircle, XCircle, RotateCcw, Calculator } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Client, Commercial, Product } from '../types';
import { cn } from "@/lib/utils";

interface SortieDialogProps {
    products: Product[];
    commerciaux: Commercial[];
    clients: Client[];
    livreurs?: Array<{
        id: number;
        nom: string;
        telephone?: string;
    }>;
}

interface SortieFormData {
    numero_bl: string;
    commercial_id: string;
    client_id: string;
    date_bl: string;
    livreur: string;
    products: Array<{
        product_id: string;
        quantite_produit: number;
        prix_vente_produit: number;
        poids_produit: number;
    }>;
    remise_speciale: string;
    remise_trimestrielle: string;
    valeur_ajoutee: string;
    retour: string;
    decharge: string;
    [key: string]: string | Array<{
        product_id: string;
        quantite_produit: number;
        prix_vente_produit: number;
        poids_produit: number;
    }>; // Index signature avec types spécifiques
}

export default function SortieDialog({ products, commerciaux, clients, livreurs = [] }: SortieDialogProps) {
    const [open, setOpen] = useState(false);
    const [usePurchasePrice, setUsePurchasePrice] = useState(false);

    // Effet pour mettre à jour les prix de tous les produits lorsque l'état du switch change
    React.useEffect(() => {
        setSelectedProducts(prevProducts =>
            prevProducts.map(product => {
                if (product.product_id) {
                    const productData = products.find(p => p.id.toString() === product.product_id);
                    if (productData) {
                        return {
                            ...product,
                            prix_vente_produit: usePurchasePrice ? productData.prix_achat_colis : productData.prix_vente_colis,
                            poids_produit: productData.product_Poids || product.poids_produit || 0,
                        };
                    }
                }
                return product;
            })
        );
    }, [usePurchasePrice, products]);

    const [selectedProducts, setSelectedProducts] = useState<
        Array<{
            product_id: string;
            quantite_produit: number;
            prix_vente_produit: number;
            poids_produit: number;
        }>
    >([
        // Ligne par défaut
        {
            product_id: '',
            quantite_produit: 1,
            prix_vente_produit: 0,
            poids_produit: 0,
        },
    ]);

    const { data, setData, post, processing, errors, reset } = useForm<SortieFormData>({
        numero_bl: '',
        commercial_id: '',
        client_id: '',
        date_bl: new Date().toISOString().split('T')[0],
        livreur: '',
        products: [],
        remise_speciale: '',
        remise_trimestrielle: '',
        valeur_ajoutee: '',
        retour: '',
        decharge: '',
    });

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

    // Calculer le total général
    const totalGeneral = selectedProducts.reduce((total, product) => {
        const lineTotal = product.quantite_produit * product.prix_vente_produit;
        return total + lineTotal;
    }, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedProducts.length === 0) {
            toast.error('Veuillez ajouter au moins un produit');
            return;
        }

        // Update the form data with selected products before submitting
        setData('products', selectedProducts);

        // Submit the form with updated data
        setTimeout(() => {
            post(route('sorties.store'), {
                onSuccess: () => {
                    toast.success('Sortie créée avec succès');
                    setOpen(false);
                    reset();
                    setSelectedProducts([
                        {
                            product_id: '',
                            quantite_produit: 1,
                            prix_vente_produit: 0,
                            poids_produit: 0,
                        },
                    ]);
                },
                onError: (errors) => {
                    console.error(errors);
                    toast.error('Erreur lors de la création de la sortie');
                },
            });
        }, 0);
    };

    const addProduct = () => {
        setSelectedProducts([
            {
                product_id: '',
                quantite_produit: 1,
                prix_vente_produit: 0,
                poids_produit: 0,
            },
            ...selectedProducts,
        ]);
    };

    const removeProduct = (index: number) => {
        setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
    };

    const updateProduct = (index: number, field: keyof typeof selectedProducts[0], value: string | number) => {
        const updatedProducts = [...selectedProducts];

        if (field === 'product_id') {
            const selectedProduct = products.find((p) => p.id.toString() === value);
            if (selectedProduct) {
                updatedProducts[index] = {
                    ...updatedProducts[index],
                    product_id: value as string,
                    prix_vente_produit: usePurchasePrice ? selectedProduct.prix_achat_colis : selectedProduct.prix_vente_colis,
                    poids_produit: selectedProduct.product_Poids ? selectedProduct.product_Poids * updatedProducts[index].quantite_produit : 0,
                };
            }
        } else {
            updatedProducts[index] = {
                ...updatedProducts[index],
                [field]: value,
            };

            // Si on change la quantité, recalculer le poids automatiquement
            if (field === 'quantite_produit') {
                const selectedProduct = products.find((p) => p.id.toString() === updatedProducts[index].product_id);
                if (selectedProduct && selectedProduct.product_Poids) {
                    updatedProducts[index].poids_produit = (value as number) * selectedProduct.product_Poids;
                }
            }
        }

        setSelectedProducts(updatedProducts);
    };

    // Fonction pour vérifier si une ligne de produit est valide
    const isProductLineValid = (productLine: { product_id: string; quantite_produit: number; prix_vente_produit: number; poids_produit: number }) => {
        return productLine.product_id !== '' && productLine.quantite_produit > 0 && productLine.prix_vente_produit >= 0;
    };

    // Fonction pour vérifier si le formulaire peut être soumis
    const canSubmitForm = () => {
        // Vérifier les champs obligatoires du formulaire principal (livreur est maintenant optionnel)
        const mainFieldsValid = data.numero_bl.trim() !== '' && data.client_id !== '' && data.date_bl !== '';

        // Vérifier qu'il y a au moins une ligne de produit valide
        const hasValidProductLine = selectedProducts.some(isProductLineValid);

        return mainFieldsValid && hasValidProductLine;
    };

    // Fonction pour réinitialiser complètement le formulaire
    const resetForm = () => {
        reset();
        setSelectedProducts([
            {
                product_id: '',
                quantite_produit: 1,
                prix_vente_produit: 0,
                poids_produit: 0,
            },
        ]);
    };

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            setOpen(newOpen);
            if (!newOpen) {
                // Réinitialiser complètement quand la modal se ferme
                resetForm();
            }
        }}>
            <DialogTrigger asChild>
                <Button id="add-sortie-button" className="h-10 w-full sm:w-auto justify-start transition-all duration-200 hover:scale-105">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle Sortie
                </Button>
            </DialogTrigger>
            <DialogContent
                className="w-[95vw] max-w-[1200px] max-h-[95vh] overflow-y-auto p-4 sm:p-6 sm:max-w-[1200px] md:p-7 md:px-8 poppins mt-8"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl md:text-[22px] text-center sm:text-left flex items-center gap-2">
                        <Truck className="w-6 h-6 text-blue-600" />
                        Créer une nouvelle sortie
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Formulaire pour créer une nouvelle sortie
                    </DialogDescription>
                </DialogHeader>
                <Separator className="my-4" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Section des quatre colonnes principales côte à côte */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Section des informations générales du BL */}
                        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-blue-800 text-sm">
                                    <Truck className="w-4 h-4" />
                                    Informations BL
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-1">
                                    <Label htmlFor="numero-bl" className="text-xs font-medium flex items-center gap-1">
                                        Numéro BL
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="numero-bl"
                                            name="numero_bl"
                                            type="text"
                                            placeholder="BL-2024-001"
                                            className="h-9 text-sm transition-all duration-200"
                                            value={data.numero_bl}
                                            onChange={(e) => setData('numero_bl', e.target.value)}
                                            aria-describedby={errors.numero_bl ? 'numero-bl-error' : undefined}
                                        />
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                            {data.numero_bl.trim() && !errors.numero_bl && <CheckCircle className="w-3 h-3 text-green-500" />}
                                            {errors.numero_bl && <XCircle className="w-3 h-3 text-red-500" />}
                                        </div>
                                    </div>
                                    {errors.numero_bl && (
                                        <p id="numero-bl-error" className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.numero_bl}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="date-bl" className="text-xs font-medium flex items-center gap-1">
                                        Date BL
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="date-bl"
                                            name="date_bl"
                                            type="date"
                                            className="h-9 text-sm transition-all duration-200"
                                            value={data.date_bl}
                                            onChange={(e) => setData('date_bl', e.target.value)}
                                            aria-describedby={errors.date_bl ? 'date-bl-error' : undefined}
                                        />
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                            {data.date_bl && !errors.date_bl && <CheckCircle className="w-3 h-3 text-green-500" />}
                                            {errors.date_bl && <XCircle className="w-3 h-3 text-red-500" />}
                                        </div>
                                    </div>
                                    {errors.date_bl && (
                                        <p id="date-bl-error" className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.date_bl}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="livreur-select" className="text-xs font-medium flex items-center gap-1">
                                        Livreur
                                        <Badge variant="secondary" className="text-xs">Optionnel</Badge>
                                    </Label>
                                    <ProtectedCombobox
                                        items={livreurs.map((livreur) => ({
                                            id: livreur.id,
                                            label: livreur.nom,
                                            subLabel: livreur.telephone ? `(${livreur.telephone})` : undefined,
                                            isActive: true,
                                        }))}
                                        value={data.livreur}
                                        onValueChange={(value) => setData('livreur', value)}
                                        placeholder="Sélectionner un livreur..."
                                        searchPlaceholder="Rechercher un livreur..."
                                        className="h-9 text-sm"
                                    />
                                    {errors.livreur && (
                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.livreur}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs font-medium flex items-center gap-1">
                                        Type de prix
                                    </Label>
                                    <div className="flex items-center space-x-2 p-2 bg-white rounded-md border">
                                        <span className="text-xs font-medium">Vente</span>
                                        <div
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${usePurchasePrice ? 'bg-blue-600' : 'bg-gray-200'}`}
                                            onClick={() => setUsePurchasePrice(!usePurchasePrice)}
                                        >
                                            <span
                                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${usePurchasePrice ? 'translate-x-5' : 'translate-x-1'}`}
                                            />
                                        </div>
                                        <span className="text-xs font-medium">Achat</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section des informations client */}
                        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-green-800 text-sm">
                                    <Check className="w-4 h-4" />
                                    Informations Client
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-1">
                                    <Label htmlFor="client-select" className="text-xs font-medium flex items-center gap-1">
                                        Code Client
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <ProtectedCombobox
                                            items={clients
                                                .sort((a, b) => {
                                                    const codeA = a.code || '';
                                                    const codeB = b.code || '';
                                                    const numA = parseInt(codeA.replace(/\D/g, '')) || 0;
                                                    const numB = parseInt(codeB.replace(/\D/g, '')) || 0;
                                                    return numA - numB;
                                                })
                                                .map((client) => ({
                                                    id: client.id,
                                                    label: client.code || `CL${client.id}`,
                                                    subLabel: client.fullName || `Client ${client.id}`,
                                                    isActive: true,
                                                }))}
                                            value={data.client_id}
                                            onValueChange={(value) => {
                                                setData('client_id', value);
                                                const selectedClient = clients.find((c) => c.id.toString() === value);
                                                if (selectedClient) {
                                                    const associatedCommercial = commerciaux.find((c) => c.id === selectedClient.idCommercial);
                                                    if (associatedCommercial) {
                                                        setData((prev) => ({
                                                            ...prev,
                                                            client_id: value,
                                                            commercial_id: associatedCommercial.id.toString(),
                                                        }));
                                                    }
                                                }
                                            }}
                                            placeholder="Sélectionner un client..."
                                            searchPlaceholder="Rechercher un client..."
                                            className="h-9 text-sm"
                                        />
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                            {data.client_id && !errors.client_id && <CheckCircle className="w-3 h-3 text-green-500" />}
                                            {errors.client_id && <XCircle className="w-3 h-3 text-red-500" />}
                                        </div>
                                    </div>
                                    {errors.client_id && (
                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.client_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs font-medium">Nom Client</Label>
                                    <Input
                                        value={(() => {
                                            const selectedClient = clients.find((c) => c.id.toString() === data.client_id);
                                            return selectedClient?.fullName || '';
                                        })()}
                                        readOnly
                                        className="h-9 text-sm bg-gray-50"
                                        placeholder="Nom du client"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs font-medium">Téléphone Client</Label>
                                    <Input
                                        value={(() => {
                                            const selectedClient = clients.find((c) => c.id.toString() === data.client_id);
                                            return selectedClient?.telephone || '';
                                        })()}
                                        readOnly
                                        className="h-9 text-sm bg-gray-50"
                                        placeholder="Téléphone"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs font-medium">Localisation</Label>
                                    <Input
                                        value={(() => {
                                            const selectedClient = clients.find((c) => c.id.toString() === data.client_id);
                                            if (selectedClient) {
                                                let ville = '';
                                                let secteur = '';

                                                if (typeof selectedClient.ville === 'string') {
                                                    ville = selectedClient.ville;
                                                } else if (selectedClient.ville && typeof selectedClient.ville === 'object' && 'nameVille' in selectedClient.ville) {
                                                    ville = selectedClient.ville.nameVille;
                                                }

                                                if (typeof selectedClient.secteur === 'string') {
                                                    secteur = selectedClient.secteur;
                                                } else if (selectedClient.secteur && typeof selectedClient.secteur === 'object' && 'nameSecteur' in selectedClient.secteur) {
                                                    secteur = selectedClient.secteur.nameSecteur;
                                                }

                                                if (ville && secteur) {
                                                    return `${ville} - ${secteur}`;
                                                } else if (ville) {
                                                    return ville;
                                                } else if (secteur) {
                                                    return secteur;
                                                }
                                            }
                                            return '';
                                        })()}
                                        readOnly
                                        className="h-9 text-sm bg-gray-50"
                                        placeholder="Ville + Secteur"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section des informations commercial */}
                        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-purple-800 text-sm">
                                    <Check className="w-4 h-4" />
                                    Informations Commercial
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium">Nom Commercial</Label>
                                    <Input
                                        value={(() => {
                                            const selectedClient = clients.find((c) => c.id.toString() === data.client_id);
                                            if (selectedClient) {
                                                const commercial = commerciaux.find((c) => c.id === selectedClient.idCommercial);
                                                return commercial?.commercial_fullName || '';
                                            }
                                            return '';
                                        })()}
                                        readOnly
                                        className="h-9 text-sm bg-gray-50"
                                        placeholder="Nom du commercial"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs font-medium">Téléphone Commercial</Label>
                                    <Input
                                        value={(() => {
                                            const selectedClient = clients.find((c) => c.id.toString() === data.client_id);
                                            if (selectedClient) {
                                                const commercial = commerciaux.find((c) => c.id === selectedClient.idCommercial);
                                                return commercial?.commercial_telephone || '';
                                            }
                                            return '';
                                        })()}
                                        readOnly
                                        className="h-9 text-sm bg-gray-50"
                                        placeholder="Téléphone"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs font-medium flex items-center gap-1">
                                        Remise ES
                                        <Badge variant="secondary" className="text-xs">%</Badge>
                                    </Label>
                                    <Input
                                        value={(() => {
                                            const selectedClient = clients.find((c) => c.id.toString() === data.client_id);
                                            return selectedClient?.remise_special ? `${selectedClient.remise_special}%` : '';
                                        })()}
                                        readOnly
                                        className="h-9 text-sm bg-gray-50"
                                        placeholder="Remise spéciale"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs font-medium flex items-center gap-1">
                                        Client G/DG
                                        <Badge variant="secondary" className="text-xs">%</Badge>
                                    </Label>
                                    <Input
                                        value={(() => {
                                            const selectedClient = clients.find((c) => c.id.toString() === data.client_id);
                                            return selectedClient?.pourcentage ? `${selectedClient.pourcentage}%` : '';
                                        })()}
                                        readOnly
                                        className="h-9 text-sm bg-gray-50"
                                        placeholder="Type client"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section des informations supplémentaires */}
                        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-orange-800 text-sm">
                                    <Calculator className="w-4 h-4" />
                                    Informations Supplémentaires
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium">Remise Spéciale</Label>
                                    <Input
                                        value={data.remise_speciale || ''}
                                        onChange={(e) => setData('remise_speciale', e.target.value)}
                                        className="h-9 text-sm"
                                        placeholder="Remise spéciale"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs font-medium">Remise Trimestrielle</Label>
                                    <Input
                                        value={data.remise_trimestrielle || ''}
                                        onChange={(e) => setData('remise_trimestrielle', e.target.value)}
                                        className="h-9 text-sm"
                                        placeholder="Remise trimestrielle"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs font-medium">Valeur Ajoutée</Label>
                                    <Input
                                        value={data.valeur_ajoutee || ''}
                                        onChange={(e) => setData('valeur_ajoutee', e.target.value)}
                                        className="h-9 text-sm"
                                        placeholder="Valeur ajoutée"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs font-medium">Retour</Label>
                                    <Input
                                        value={data.retour || ''}
                                        onChange={(e) => setData('retour', e.target.value)}
                                        className="h-9 text-sm"
                                        placeholder="Retour"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

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
                                        onClick={addProduct}
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
                                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 rounded-lg border">
                                    <div className="col-span-4">
                                        <Label className="text-sm font-medium text-gray-700">Nom de produit</Label>
                                    </div>
                                    <div className="col-span-1.5">
                                        <Label className="text-sm font-medium text-gray-700">Quantité</Label>
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-sm font-medium text-gray-700">Prix</Label>
                                    </div>
                                    <div className="col-span-1.5">
                                        <Label className="text-sm font-medium text-gray-700">Total</Label>
                                    </div>
                                    <div className="col-span-1.5">
                                        <Label className="text-sm font-medium text-gray-700">Poids (kg)</Label>
                                    </div>
                                    <div className="col-span-1">
                                        <Label className="text-sm font-medium text-gray-700">Action</Label>
                                    </div>
                                </div>

                                {selectedProducts.map((productItem, index) => (
                                    <div key={index} className={cn("border rounded-lg p-4 bg-background hover:shadow-md transition-all duration-200 group relative")}>
                                        <div className="grid grid-cols-12 gap-4 items-end">
                                            {/* Product Selection */}
                                            <div className="col-span-4 space-y-1">
                                                <Label className="text-xs font-medium text-gray-600">Produit</Label>
                                                <ProtectedCombobox
                                                    items={products
                                                        .filter((product) => product.product_isActive)
                                                        .map((product) => ({
                                                            id: product.id,
                                                            label: product.product_libelle,
                                                            subLabel: product.product_Ref,
                                                            isActive: product.product_isActive,
                                                        }))}
                                                    value={productItem.product_id}
                                                    onValueChange={(value) => updateProduct(index, 'product_id', value)}
                                                    placeholder="Sélectionner un produit..."
                                                    searchPlaceholder="Rechercher un produit..."
                                                    className="h-9 text-sm"
                                                    dropdownDirection="up"
                                                />
                                            </div>

                                            {/* Quantity */}
                                            <div className="col-span-1.5 space-y-1">
                                                <Label className="text-xs font-medium text-gray-600">Quantité</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={productItem.quantite_produit}
                                                    onChange={(e) => {
                                                        const newQuantity = parseFloat(e.target.value) || 0;
                                                        updateProduct(index, 'quantite_produit', newQuantity);
                                                    }}
                                                    className="h-9 text-sm"
                                                    placeholder="0"
                                                />
                                            </div>

                                            {/* Price */}
                                            <div className="col-span-2 space-y-1">
                                                <Label className="text-xs font-medium text-gray-600">Prix</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={productItem.prix_vente_produit}
                                                    onChange={(e) => updateProduct(index, 'prix_vente_produit', parseFloat(e.target.value) || 0)}
                                                    className="h-9 text-sm"
                                                    placeholder="0.00"
                                                />
                                            </div>

                                            {/* Total */}
                                            <div className="col-span-2 space-y-1">
                                                <Label className="text-xs font-medium text-gray-600">Total</Label>
                                                <Input
                                                    value={formatNumber(productItem.quantite_produit * productItem.prix_vente_produit)}
                                                    readOnly
                                                    className="h-9 text-sm bg-gray-50 font-medium"
                                                    placeholder="0.00"
                                                />
                                            </div>

                                            {/* Weight */}
                                            <div className="col-span-1.5 space-y-1">
                                                <Label className="text-xs font-medium text-gray-600">Poids (kg)</Label>
                                                <Input
                                                    value={formatNumber(productItem.poids_produit)}
                                                    readOnly
                                                    className="h-9 text-sm bg-gray-50"
                                                    placeholder="0.00"
                                                />
                                            </div>

                                            {/* Delete Button */}
                                            <div className="col-span-1 flex justify-center">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeProduct(index)}
                                                    className="h-9 w-9 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                                {/* Status Badge */}
                                                <div className="absolute top-2 right-2">
                                                    {isProductLineValid(productItem) ? (
                                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Valide
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                                                            <AlertCircle className="w-3 h-3 mr-1" />
                                                            Incomplet
                                                        </Badge>
                                                    )}
                                                </div>
                                    </div>
                                ))}

                                {/* Message si aucun produit */}
                                {selectedProducts.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Aucun produit ajouté</p>
                                        <p className="text-sm">Cliquez sur "Ajouter un produit" pour commencer</p>
                                    </div>
                                )}
                            </div>
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
                                disabled={processing || !canSubmitForm()}
                                className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
                            >
                                {processing ? 'Création...' : 'Créer la sortie'}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
