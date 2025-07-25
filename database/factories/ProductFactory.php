<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\Illuminate\Database\Eloquent\Model>
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $prixAchatUnite = fake()->randomFloat(2, 5, 500);
        $prixAchatColis = $prixAchatUnite * fake()->numberBetween(6, 24); // Un colis contient plusieurs unités

        $margeUnite = fake()->randomFloat(2, 1.2, 2.5); // Marge entre 20% et 150%
        $margeColis = fake()->randomFloat(2, 1.15, 2.2); // Marge légèrement moins élevée pour les colis

        $prixVenteUnite = $prixAchatUnite * $margeUnite;
        $prixVenteColis = $prixAchatColis * $margeColis;

        return [
            'product_Ref' => strtoupper(fake()->unique()->bothify('PR-####-???')),
            'product_libelle' => fake()->unique()->words(3, true) . ' ' . fake()->randomElement(['Premium', 'Standard', 'Pro', 'Lite', 'Classic', 'Deluxe']),
            'prix_achat_colis' => round($prixAchatColis, 2),
            'prix_achat_unite' => round($prixAchatUnite, 2),
            'prix_vente_colis' => round($prixVenteColis, 2),
            'prix_vente_unite' => round($prixVenteUnite, 2),
            'brand_id' => Brand::factory(),
            'category_id' => Category::factory(),
            'product_Poids' => fake()->randomFloat(3, 0.1, 50.0), // Poids entre 100g et 50kg
            'nombre_unite_par_colis' => fake()->randomElement([6, 12, 24, 36, 48, 50, 100]), // Nombre d'unités par colis communs (obligatoire)
            'product_isActive' => fake()->boolean(80), // 80% de chance d'être actif
            'observation' => fake()->optional(0.3)->sentence(), // 30% de chance d'avoir une observation
        ];
    }

    /**
     * Indicate that the product is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'product_isActive' => true,
        ]);
    }

    /**
     * Indicate that the product is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'product_isActive' => false,
        ]);
    }
}
