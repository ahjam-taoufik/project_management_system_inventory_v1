<?php

namespace App\Observers;

use App\Models\Product;
use App\Models\Stock;

class ProductObserver
{
    public function created(Product $product)
    {
        Stock::firstOrCreate([
            'product_id' => $product->id
        ], [
            'quantite_totale_entree' => 0,
            'quantite_totale_sortie' => 0,
            'stock_disponible' => 0,
            'stock_minimum' => 0,
            'stock_maximum' => 0,
            'valeur_stock' => 0,
            'derniere_entree' => null,
            'derniere_sortie' => null,
        ]);
    }

    public function updated(Product $product)
    {
        // Si un produit passe de inactif à actif, assurons-nous qu'il a une entrée de stock
        if ($product->product_isActive && !$product->getOriginal('product_isActive')) {
            Stock::firstOrCreate([
                'product_id' => $product->id
            ], [
                'quantite_totale_entree' => 0,
                'quantite_totale_sortie' => 0,
                'stock_disponible' => 0,
                'stock_minimum' => 0,
                'stock_maximum' => 0,
                'valeur_stock' => 0,
                'derniere_entree' => null,
                'derniere_sortie' => null,
            ]);
        }

        // Si un produit est désactivé, mettons à jour sa valeur stock_disponible à 0
        // Cela n'affectera pas les calculs historiques mais indiquera visuellement
        // que ce produit n'est plus disponible
        if (!$product->product_isActive && $product->getOriginal('product_isActive')) {
            $stock = Stock::where('product_id', $product->id)->first();
            if ($stock) {
                // Nous ne modifions pas les valeurs d'entrée/sortie pour préserver l'historique,
                // mais nous pouvons marquer le stock comme non disponible
                $stock->stock_disponible = 0;
                $stock->save();
            }
        }
    }
}
