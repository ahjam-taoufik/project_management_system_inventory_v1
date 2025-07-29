<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\SortieProduct;
use App\Models\Stock;

class SortieProductObserver
{
    /**
     * Handle the SortieProduct "created" event.
     */
    public function created(SortieProduct $sortieProduct): void
    {
        $this->updateStock($sortieProduct, 'decrease');
    }

    /**
     * Handle the SortieProduct "updated" event.
     */
    public function updated(SortieProduct $sortieProduct): void
    {
        // Si la quantité a changé, ajuster le stock
        if ($sortieProduct->wasChanged('quantite_produit')) {
            $oldQuantity = $sortieProduct->getOriginal('quantite_produit');
            $newQuantity = $sortieProduct->quantite_produit;
            $difference = $newQuantity - $oldQuantity;

            $stock = Stock::where('product_id', $sortieProduct->product_id)->first();
            if ($stock) {
                // Si la différence est positive, on diminue le stock (plus de produits sortis)
                // Si la différence est négative, on augmente le stock (moins de produits sortis)
                $stock->decrement('stock_disponible', $difference);
                $stock->increment('quantite_totale_sortie', $difference);
                $stock->update(['derniere_sortie' => now()]);
            }
        }
    }

    /**
     * Handle the SortieProduct "deleted" event.
     */
    public function deleted(SortieProduct $sortieProduct): void
    {
        $this->updateStock($sortieProduct, 'increase');
    }

    /**
     * Handle the SortieProduct "restored" event.
     */
    public function restored(SortieProduct $sortieProduct): void
    {
        $this->updateStock($sortieProduct, 'decrease');
    }

    /**
     * Handle the SortieProduct "force deleted" event.
     */
    public function forceDeleted(SortieProduct $sortieProduct): void
    {
        $this->updateStock($sortieProduct, 'increase');
    }

    /**
     * Update stock based on sortie product
     */
    private function updateStock(SortieProduct $sortieProduct, string $operation): void
    {
        $stock = Stock::where('product_id', $sortieProduct->product_id)->first();
        
        if ($stock) {
            if ($operation === 'decrease') {
                // Diminuer le stock lors d'une sortie
                $stock->decrement('stock_disponible', $sortieProduct->quantite_produit);
                $stock->increment('quantite_totale_sortie', $sortieProduct->quantite_produit);
                $stock->update(['derniere_sortie' => now()]);
            } elseif ($operation === 'increase') {
                // Augmenter le stock lors d'une annulation
                $stock->increment('stock_disponible', $sortieProduct->quantite_produit);
                $stock->decrement('quantite_totale_sortie', $sortieProduct->quantite_produit);
            }
        }
    }
}