<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Brand;
use Illuminate\Support\Facades\DB;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         // ⚠️ Désactiver les clés étrangères pour éviter les conflits
         DB::statement('SET FOREIGN_KEY_CHECKS=0;');

         // 🧹 Vider la table (remise à zéro)
         Brand::truncate();

         // ✅ Réactiver les clés étrangères
         DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $brands = [
            'ZEN',
            'MIO',
            'FIX',
            'VITA FRESH',
            'VERDE',
            'TEOS',
            'SHARK',
            'PENA',
            'PAPILLON',
            'BAYETAS',
            'MASQUE',
            'MALA',
            'LOUX',
            'LIMPOS',
            'QZI',
            'KAND',
            'IRIS',
            'HAND',
            'CLAIRE\'S',
            'BLANDOUX',
            'BANO',
            'A+',
        ];

        foreach ($brands as $brandName) {
            Brand::create(['brand_name' => $brandName]);
        }
    }
}
