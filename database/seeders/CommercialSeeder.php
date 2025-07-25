<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Commercial;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommercialSeeder extends Seeder
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
          Commercial::truncate();

          // ✅ Réactiver les clés étrangères
          DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $commerciaux = [
            [
                'commercial_code' => 'COM001',
                'commercial_fullName' => 'EL HILLALY ABDENNABI',
                'commercial_telephone' => '06 61 38 95 62',
            ],
            [
                'commercial_code' => 'COM002',
                'commercial_fullName' => 'kHLIFA  ESSAKHI',
                'commercial_telephone' => '07 73 71 50 13',
            ],
            [
                'commercial_code' => 'COM003',
                'commercial_fullName' => 'BOUDERKA BRAHIM',
                'commercial_telephone' => '0665432109',
            ],
            [
                'commercial_code' => 'COM004',
                'commercial_fullName' => 'ESSAGHIRI ABDELALI',
                'commercial_telephone' => '06 67 43 82 80',
            ],
            [
                'commercial_code' => 'COM005',
                'commercial_fullName' => 'MOUAD',
                'commercial_telephone' => '00 00 00 00 00',
            ],
        ];

        foreach ($commerciaux as $commercial) {
            Commercial::create($commercial);
        }
    }
}
