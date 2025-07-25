<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Entrer;
use App\Models\Product;
use App\Models\Transporteur;

class EntrerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer quelques produits et transporteurs existants
        $products = Product::take(5)->get();
        $transporteurs = Transporteur::take(3)->get();

        if ($products->isEmpty() || $transporteurs->isEmpty()) {
            $this->command->info('Aucun produit ou transporteur trouvé. Veuillez d\'abord exécuter les seeders ProductSeeder et TransporteurSeeder.');
            return;
        }

        $entrers = [
            [
                'product_id' => $products->first()->id,
                'ref_produit' => $products->first()->product_Ref,
                'prix_achat_produit' => $products->first()->prix_achat_unite,
                'quantite_produit' => 100,
                'numero_bl' => 'BL-2024-001',
                'transporteur_id' => $transporteurs->first()->id,
                'date_charge' => '2024-07-19',
                'date_decharge' => '2024-07-20',
                'manque' => 2,
            ],
            [
                'product_id' => $products->skip(1)->first()->id,
                'ref_produit' => $products->skip(1)->first()->product_Ref,
                'prix_achat_produit' => $products->skip(1)->first()->prix_achat_unite,
                'quantite_produit' => 50,
                'numero_bl' => 'BL-2024-002',
                'transporteur_id' => $transporteurs->skip(1)->first()->id,
                'date_charge' => '2024-07-18',
                'date_decharge' => null,
                'manque' => null,
            ],
            [
                'product_id' => $products->skip(2)->first()->id,
                'ref_produit' => $products->skip(2)->first()->product_Ref,
                'prix_achat_produit' => $products->skip(2)->first()->prix_achat_unite,
                'quantite_produit' => 75,
                'numero_bl' => 'BL-2024-003',
                'transporteur_id' => $transporteurs->skip(2)->first()->id,
                'date_charge' => '2024-07-17',
                'date_decharge' => '2024-07-18',
                'manque' => 0,
            ],
        ];

        foreach ($entrers as $entrer) {
            Entrer::create($entrer);
        }

        $this->command->info('Entrers créés avec succès!');
    }
}
