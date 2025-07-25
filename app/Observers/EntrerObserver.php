<?php

namespace App\Observers;

use App\Models\Entrer;
use App\Models\Stock;
use App\Models\Product;

class EntrerObserver
{
    /**
     * Handle the Entrer "created" event.
     */
    public function created(Entrer $entrer): void
    {
        // Mettre à jour le stock correspondant au produit
        $stock = Stock::firstOrCreate(
            ['product_id' => $entrer->product_id],
            [
                'quantite_totale_entree' => 0,
                'quantite_totale_sortie' => 0,
                'stock_disponible' => 0,
                'stock_minimum' => 0,
                'stock_maximum' => 0,
                'valeur_stock' => 0,
                'derniere_entree' => null,
                'derniere_sortie' => null,
            ]
        );

        // 1. Ajouter la quantité entrée à la quantité totale d'entrée
        $stock->quantite_totale_entree += $entrer->quantite_produit;

        // 2. Recalculer le stock disponible en utilisant la méthode dédiée
        $stock->recalculateStockDisponible();

        // 3. Mettre à jour la date de dernière entrée
        $stock->derniere_entree = now();

        // 4. Sauvegarder les changements
        $stock->save();
    }

    /**
     * Handle the Entrer "updated" event.
     */
    public function updated(Entrer $entrer): void
    {
        // Pour une mise à jour, on pourrait recalculer toutes les entrées du produit
        // Mais cette logique est gérée dans le contrôleur qui supprime et recrée les entrées
    }

    /**
     * Handle the Entrer "deleted" event.
     */
    public function deleted(Entrer $entrer): void
    {
        // Récupérer le stock correspondant au produit
        $stock = Stock::where('product_id', $entrer->product_id)->first();

        if ($stock) {
            // 1. Soustraire la quantité de l'entrée supprimée de la quantité totale d'entrée
            $stock->quantite_totale_entree -= $entrer->quantite_produit;

            // 2. Recalculer le stock disponible en utilisant la méthode dédiée
            $stock->recalculateStockDisponible();

            // 3. Sauvegarder les changements
            $stock->save();
        }
    }
}

