<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\SortieProduct;
use App\Models\Sortie;
use App\Models\Product;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SortieProduct>
 */
class SortieProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = SortieProduct::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $product = Product::factory()->create();
        $quantite = $this->faker->numberBetween(1, 10);
        $prixVente = $product->prix_vente_colis ?? $this->faker->randomFloat(2, 50, 500);

        return [
            'sortie_id' => Sortie::factory(),
            'product_id' => $product->id,
            'ref_produit' => $product->product_Ref,
            'prix_vente_produit' => $prixVente,
            'quantite_produit' => $quantite,
            'total_ligne' => $prixVente * $quantite,
        ];
    }
}