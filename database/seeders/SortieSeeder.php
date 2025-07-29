<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Sortie;
use App\Models\SortieProduct;
use App\Models\Commercial;
use App\Models\Client;
use App\Models\Product;
use Carbon\Carbon;

class SortieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer des données existantes
        $commerciaux = Commercial::all();
        $clients = Client::all();
        $products = Product::where('product_isActive', true)->get();

        if ($commerciaux->isEmpty() || $clients->isEmpty() || $products->isEmpty()) {
            $this->command->warn('Veuillez d\'abord exécuter les seeders pour commerciaux, clients et produits');
            return;
        }

        $livreurs = [
            'Ahmed Benali',
            'Mohamed Alami',
            'Youssef Tazi',
            'Hassan Idrissi',
            'Omar Benjelloun',
            'Khalid Fassi',
            'Rachid Berrada',
            'Abdelkader Lahlou'
        ];

        // Créer 10 sorties de test (réduit pour éviter les problèmes de mémoire)
        for ($i = 1; $i <= 10; $i++) {
            $commercial = $commerciaux->random();
            // Filtrer les clients par commercial, sinon prendre un client aléatoire
            $clientsForCommercial = $clients->where('idCommercial', $commercial->id);
            $client = $clientsForCommercial->isNotEmpty() ? $clientsForCommercial->random() : $clients->random();
            
            // Générer un numéro BL unique
            $numeroBl = 'BL-S-' . time() . '-' . str_pad($i, 3, '0', STR_PAD_LEFT);
            
            $sortie = Sortie::create([
                'numero_bl' => $numeroBl,
                'commercial_id' => $commercial->id,
                'client_id' => $client->id,
                'date_bl' => Carbon::now()->subDays(rand(0, 30)),
                'livreur' => $livreurs[array_rand($livreurs)],
                'total_bl' => 0, // Sera calculé après
            ]);

            // Ajouter 1 à 3 produits par sortie (réduit)
            $numberOfProducts = rand(1, 3);
            $selectedProducts = $products->random($numberOfProducts);
            $totalSortie = 0;

            foreach ($selectedProducts as $product) {
                $quantite = rand(1, 5);
                $prixVente = $product->prix_vente_colis ?? rand(50, 200);
                $totalLigne = $prixVente * $quantite;
                $totalSortie += $totalLigne;
                
                SortieProduct::create([
                    'sortie_id' => $sortie->id,
                    'product_id' => $product->id,
                    'ref_produit' => $product->product_Ref,
                    'prix_vente_produit' => $prixVente,
                    'quantite_produit' => $quantite,
                    'total_ligne' => $totalLigne,
                ]);
            }

            // Mettre à jour le total directement
            $sortie->update(['total_bl' => $totalSortie]);
        }

        $this->command->info('10 sorties créées avec succès');
    }
}