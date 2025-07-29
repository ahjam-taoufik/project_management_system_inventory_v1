<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Sortie;
use App\Models\Stock;

class SortieObserver
{
    /**
     * Handle the Sortie "created" event.
     */
    public function created(Sortie $sortie): void
    {
        // Mettre à jour le stock après création d'une sortie
        $this->updateStock($sortie, 'decrease');
    }

    /**
     * Handle the Sortie "updated" event.
     */
    public function updated(Sortie $sortie): void
    {
        // Si nécessaire, gérer les mises à jour de stock
        // Pour l'instant, on ne fait rien car les produits sont gérés séparément
    }

    /**
     * Handle the Sortie "deleted" event.
     */
    public function deleted(Sortie $sortie): void
    {
        // Remettre le stock après suppression d'une sortie
        $this->updateStock($sortie, 'increase');
    }

    /**
     * Handle the Sortie "restored" event.
     */
    public function restored(Sortie $sortie): void
    {
        // Diminuer le stock après restauration d'une sortie
        $this->updateStock($sortie, 'decrease');
    }

    /**
     * Handle the Sortie "force deleted" event.
     */
    public function forceDeleted(Sortie $sortie): void
    {
        // Remettre le stock après suppression définitive
        $this->updateStock($sortie, 'increase');
    }

    /**
     * Update stock based on sortie products
     */
    private function updateStock(Sortie $sortie, string $operation): void
    {
        foreach ($sortie->products as $sortieProduct) {
            $stock = Stock::where('product_id', $sortieProduct->product_id)->first();
            
            if ($stock) {
                if ($operation === 'decrease') {
                    // Diminuer le stock lors d'une sortie
                    $stock->decrement('stock_disponible', $sortieProduct->quantite_produit);
                    $stock->increment('quantite_totale_sortie', $sortieProduct->quantite_produit);
                    $stock->update(['derniere_sortie' => now()]);
                } elseif ($operation === 'increase') {
                    // Augmenter le stock lors d'une annulation de sortie
                    $stock->increment('stock_disponible', $sortieProduct->quantite_produit);
                    $stock->decrement('quantite_totale_sortie', $sortieProduct->quantite_produit);
                }
            }
        }
    }
}