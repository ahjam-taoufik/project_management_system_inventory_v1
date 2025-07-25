<?php

namespace Database\Seeders;

use App\Models\Ville;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VilleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ⚠️ Désactiver les clés étrangères pour éviter les conflits
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // 🧹 Vider la table (remise à zéro)
        Ville::truncate();

        // ✅ Réactiver les clés étrangères
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Liste des villes à insérer
        $villes = [
            'INZEGANE',
            'LAQLIAA',
            'BIOUGRA',
            'AIT MELLOUL',
            'BELFAA',
            'AIT AAMIRA',
            'OULAD DAHOU',
            'AZROU',
            'AGADIR',
            'LARBAA AIT BOUTAIB',
            'ANZA',
            'SIDI BIBI',
            'GUELMIM',
            'LAKHSASS',
            'TIZNIT',
            'MASSA',
            'SEBT AIT MILK',
            'TANTAN',
            'DRARGA',
            'DAKHLA',
            'DCHEIRA',
            'POLYVALENT',
            'TAGADIRTE',
            'TAMAAIT',
            'AOURIR',
            'TIKIWINE',
            'DAKHLA SAHARA',
            'AIT BAHA',
            'LAAYOUNE'
        ];

        foreach ($villes as $villeName) {
            Ville::create(['nameVille' => $villeName]);
        }
    }
}
