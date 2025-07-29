"use client";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Calendar, User, Phone, MapPin, Package, Truck } from 'lucide-react';
import { Sortie } from './types';
import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gérer les Sorties',
        href: '/sorties',
    },
    {
        title: 'Détails de la sortie',
        href: '#',
    },
];

export default function Show() {
    const { props: { sortie } } = usePage();
    const sortieData = sortie as Sortie;

    const handleBack = () => {
        router.visit('/sorties');
    };

    // Safety check
    if (!sortieData) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Sortie non trouvée" />
                <div className="poppins p-5 border w-full min-h-screen">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <p>Sortie non trouvée</p>
                            <Button onClick={handleBack} className="mt-4">
                                Retour à la liste
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Sortie ${sortieData.numero_bl}`} />
            <div className="poppins p-5 border w-full min-h-screen">
                <div className="mb-6">
                    <Button 
                        variant="outline" 
                        onClick={handleBack}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour à la liste
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Informations générales */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Informations de la sortie
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Numéro BL</label>
                                    <p className="text-lg font-semibold">{sortieData.numero_bl}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Date BL</label>
                                    <p className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(sortieData.date_bl).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Livreur</label>
                                <p className="flex items-center gap-2">
                                    <Truck className="h-4 w-4" />
                                    {sortieData.livreur}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Nombre de produits</label>
                                <p className="text-lg font-semibold">{sortieData.product_count}</p>
                            </div>
                            {sortieData.total_bl && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Total BL</label>
                                    <p className="text-xl font-bold text-green-600">{sortieData.total_bl} DH</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Informations commercial */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Commercial
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {sortieData.commercial ? (
                                <>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Code</label>
                                        <p className="font-semibold">{sortieData.commercial.code}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Nom</label>
                                        <p className="font-semibold">{sortieData.commercial.nom}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Téléphone</label>
                                        <p className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            {sortieData.commercial.telephone}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-500 italic">Aucun commercial assigné</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Informations client */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Informations Client
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {sortieData.client ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Code Client</label>
                                        <p className="font-semibold">{sortieData.client.code}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Nom</label>
                                        <p className="font-semibold">{sortieData.client.nom}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Téléphone</label>
                                        <p className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            {sortieData.client.telephone}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Ville</label>
                                        <p>{typeof sortieData.client.ville === 'object' && sortieData.client.ville?.nameVille ? sortieData.client.ville.nameVille : sortieData.client.ville}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Secteur</label>
                                        <p>{sortieData.client.secteur}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Type Client</label>
                                        <p className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm inline-block">
                                            {sortieData.client.type_client}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">Aucun client assigné</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Liste des produits */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Produits de la sortie</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {sortieData.products.map((product, index) => (
                                <div
                                    key={`product-${index}`}
                                    className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-lg">{product.product.product_libelle}</h4>
                                        <p className="text-sm text-gray-600">Référence: {product.ref_produit}</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <div className="text-sm">
                                            <span className="text-gray-500">Quantité:</span>
                                            <span className="font-semibold ml-2">{product.quantite_produit}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-500">Prix unitaire:</span>
                                            <span className="font-semibold ml-2">{product.prix_vente_produit} DH</span>
                                        </div>
                                        <div className="text-lg font-bold text-green-600">
                                            Total: {product.total_ligne} DH
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Total général */}
                        <div className="mt-6 pt-4 border-t">
                            <div className="flex justify-end">
                                <div className="text-right">
                                    <p className="text-lg font-semibold">
                                        Total général: {' '}
                                        <span className="text-2xl font-bold text-green-600">
                                            {sortieData.products.reduce((sum, product) => sum + product.total_ligne, 0)} DH
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}