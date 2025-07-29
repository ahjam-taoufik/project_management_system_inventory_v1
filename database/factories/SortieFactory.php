<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Sortie;
use App\Models\Commercial;
use App\Models\Client;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sortie>
 */
class SortieFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Sortie::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
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

        return [
            'numero_bl' => 'BL-S-' . $this->faker->unique()->numberBetween(1000, 9999),
            'commercial_id' => Commercial::factory(),
            'client_id' => Client::factory(),
            'date_bl' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'livreur' => $this->faker->randomElement($livreurs),
            'total_bl' => 0, // Sera calculé automatiquement
        ];
    }
}