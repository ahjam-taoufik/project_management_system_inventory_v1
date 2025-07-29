<?php

/**
 * Script de vérification du module Sortie
 * Exécuter avec: php verify-sortie-module.php
 */

require_once 'vendor/autoload.php';

use Illuminate\Foundation\Application;
use App\Models\Sortie;
use App\Models\SortieProduct;
use App\Models\Commercial;
use App\Models\Client;
use App\Models\Product;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🔍 Vérification du module Sortie...\n\n";

// 1. Vérifier les tables
echo "📊 Tables de base de données:\n";
try {
    $sortiesCount = Sortie::count();
    $sortieProductsCount = SortieProduct::count();
    echo "   ✅ Table 'sorties': {$sortiesCount} enregistrements\n";
    echo "   ✅ Table 'sortie_products': {$sortieProductsCount} enregistrements\n";
} catch (Exception $e) {
    echo "   ❌ Erreur tables: " . $e->getMessage() . "\n";
}

// 2. Vérifier les permissions
echo "\n🔐 Permissions:\n";
$sortiePermissions = ['sorties.view', 'sorties.create', 'sorties.edit', 'sorties.delete'];
foreach ($sortiePermissions as $permission) {
    $exists = Permission::where('name', $permission)->exists();
    echo $exists ? "   ✅ {$permission}\n" : "   ❌ {$permission} manquante\n";
}

// 3. Vérifier le rôle super-admin
echo "\n👑 Rôle super-admin:\n";
try {
    $superAdmin = Role::where('name', 'super-admin')->first();
    if ($superAdmin) {
        $hasAllPermissions = $superAdmin->hasAllPermissions($sortiePermissions);
        echo $hasAllPermissions ? "   ✅ Toutes les permissions assignées\n" : "   ❌ Permissions manquantes\n";
    } else {
        echo "   ❌ Rôle super-admin non trouvé\n";
    }
} catch (Exception $e) {
    echo "   ❌ Erreur rôle: " . $e->getMessage() . "\n";
}

// 4. Vérifier les relations
echo "\n🔗 Relations:\n";
try {
    $sortie = Sortie::with(['commercial', 'client', 'products.product'])
        ->whereHas('products')
        ->latest()
        ->first();

    if ($sortie) {
        echo "   ✅ Relation Sortie -> Commercial: " . $sortie->commercial->commercial_fullName . "\n";
        echo "   ✅ Relation Sortie -> Client: " . $sortie->client->fullName . "\n";
        echo "   ✅ Relation Sortie -> Produits: " . $sortie->products->count() . " produits\n";

        if ($sortie->products->isNotEmpty()) {
            $firstProduct = $sortie->products->first();
            echo "   ✅ Relation SortieProduct -> Product: " . $firstProduct->product->product_libelle . "\n";
        }
    } else {
        echo "   ⚠️  Aucune sortie avec produits trouvée\n";
    }
} catch (Exception $e) {
    echo "   ❌ Erreur relations: " . $e->getMessage() . "\n";
}

// 5. Vérifier les calculs
echo "\n🧮 Calculs automatiques:\n";
try {
    $sortie = Sortie::with('products')->first();
    if ($sortie) {
        $totalCalcule = $sortie->products->sum('total_ligne');
        $totalEnregistre = $sortie->total_bl;

        if (abs($totalCalcule - $totalEnregistre) < 0.01) {
            echo "   ✅ Total BL correct: {$totalEnregistre} DH\n";
        } else {
            echo "   ❌ Total BL incorrect: calculé {$totalCalcule}, enregistré {$totalEnregistre}\n";
        }
    }
} catch (Exception $e) {
    echo "   ❌ Erreur calculs: " . $e->getMessage() . "\n";
}

// 6. Vérifier les dépendances
echo "\n📦 Dépendances:\n";
try {
    $commerciauxCount = Commercial::count();
    $clientsCount = Client::count();
    $productsCount = Product::count();

    echo "   ✅ Commerciaux: {$commerciauxCount}\n";
    echo "   ✅ Clients: {$clientsCount}\n";
    echo "   ✅ Produits: {$productsCount}\n";
} catch (Exception $e) {
    echo "   ❌ Erreur dépendances: " . $e->getMessage() . "\n";
}

echo "\n🎉 Vérification terminée !\n";
echo "\n📖 Pour accéder au module:\n";
echo "   • URL: /sorties\n";
echo "   • Permissions requises: sorties.view\n";
echo "   • Rôle: super-admin (ou rôle avec permissions sorties)\n";
echo "\n💡 Commandes utiles:\n";
echo "   • php artisan route:list --name=sorties\n";
echo "   • php artisan permission:show\n";
echo "   • php artisan tinker\n";
