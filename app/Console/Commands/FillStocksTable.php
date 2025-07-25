<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use App\Models\Stock;

class FillStocksTable extends Command
{
    protected $signature = 'stocks:fill-initial';
    protected $description = 'Remplit la table stocks avec tous les produits existants (stock à zéro si la ligne n’existe pas)';

    public function handle()
    {
        $count = 0;
        Product::all()->each(function ($product) use (&$count) {
            if (!Stock::where('product_id', $product->id)->exists()) {
                Stock::create([
                    'product_id' => $product->id,
                    'quantite_totale_entree' => 0,
                    'quantite_totale_sortie' => 0,
                    'stock_minimum' => 0,
                    'stock_maximum' => 0,
                    'valeur_stock' => 0,
                    'derniere_entree' => null,
                    'derniere_sortie' => null,
                ]);
                $count++;
            }
        });
        $this->info("$count lignes de stock créées.");
        return 0;
    }
}
