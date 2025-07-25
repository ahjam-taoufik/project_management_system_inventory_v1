<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Livreur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LivreurSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ⚠️ Désactiver les clés étrangères pour éviter les conflits
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // 🧹 Vider la table (remise à zéro)
        Livreur::truncate();

        // ✅ Réactiver les clés étrangères
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $livreurs = [
            [
                'nom' => 'LIVREUR001',
                'telephone' => '06 12 34 56 78',
            ],
            [
                'nom' => 'LIVREUR002',
                'telephone' => '06 23 45 67 89',
            ],
            [
                'nom' => 'LIVREUR003',
                'telephone' => '06 34 56 78 90',
            ],
            [
                'nom' => 'LIVREUR004',
                'telephone' => '06 45 67 89 01',
            ],
            [
                'nom' => 'LIVREUR005',
                'telephone' => '06 56 78 90 12',
            ],
        ];

        foreach ($livreurs as $livreur) {
            Livreur::create($livreur);
        }
    }
}
