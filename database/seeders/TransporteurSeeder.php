<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Transporteur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TransporteurSeeder extends Seeder
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
        Transporteur::truncate();

        // ✅ Réactiver les clés étrangères
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $transporteurs = [
            [
                'conducteur_name' => 'TRANSPORTEUR001',
                'vehicule_matricule' => 'ABC-123-45',
                'conducteur_cin' => 'AB123456',
                'conducteur_telephone' => '06 11 22 33 44',
                'vehicule_type' => 'Camion',
            ],
            [
                'conducteur_name' => 'TRANSPORTEUR002',
                'vehicule_matricule' => 'DEF-456-78',
                'conducteur_cin' => 'CD789012',
                'conducteur_telephone' => '06 22 33 44 55',
                'vehicule_type' => 'Fourgon',
            ],
            [
                'conducteur_name' => 'TRANSPORTEUR003',
                'vehicule_matricule' => 'GHI-789-01',
                'conducteur_cin' => 'EF345678',
                'conducteur_telephone' => '06 33 44 55 66',
                'vehicule_type' => 'Camion',
            ],
            [
                'conducteur_name' => 'TRANSPORTEUR004',
                'vehicule_matricule' => 'JKL-012-34',
                'conducteur_cin' => 'GH901234',
                'conducteur_telephone' => '06 44 55 66 77',
                'vehicule_type' => 'Fourgon',
            ],
            [
                'conducteur_name' => 'TRANSPORTEUR005',
                'vehicule_matricule' => 'MNO-345-67',
                'conducteur_cin' => 'IJ567890',
                'conducteur_telephone' => '06 55 66 77 88',
                'vehicule_type' => 'Camion',
            ],
        ];

        foreach ($transporteurs as $transporteur) {
            Transporteur::create($transporteur);
        }
    }
}
