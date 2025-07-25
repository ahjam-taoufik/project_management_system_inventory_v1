<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Livreur;
use Illuminate\Database\Eloquent\Factories\Factory;

class LivreurFactory extends Factory
{
    protected $model = Livreur::class;

    public function definition(): array
    {
        return [
            'nom' => fake()->name(),
            'telephone' => fake()->phoneNumber(),
        ];
    }
}
