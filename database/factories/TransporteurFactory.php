<?php

declare(strict_types=1);

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transporteur>
 */
class TransporteurFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'conducteur_name' => fake()->name(),
            'vehicule_matricule' => fake()->unique()->regexify('[A-Z]{2}[0-9]{3}[A-Z]{2}'),
            'conducteur_cin' => fake()->unique()->regexify('[A-Z]{1}[0-9]{6}'),
            'conducteur_telephone' => fake()->phoneNumber(),
            'vehicule_type' => fake()->randomElement(['Camion', 'Fourgon', 'Pickup', 'Remorque']),
        ];
    }
}
