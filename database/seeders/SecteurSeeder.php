<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Secteur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SecteurSeeder extends Seeder
{
    public function run(): void
    {
          // ⚠️ Désactiver les clés étrangères pour éviter les conflits
          DB::statement('SET FOREIGN_KEY_CHECKS=0;');

          // 🧹 Vider la table (remise à zéro)
          Secteur::truncate();

          // ✅ Réactiver les clés étrangères
          DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $sectors = [
            ['nameSecteur' => 'AGADIR', 'idVille' => 9],
            ['nameSecteur' => 'ADRAR', 'idVille' => 9],
            ['nameSecteur' => 'AIT AAMIRA', 'idVille' => 6],
            ['nameSecteur' => 'AIT MELLOUL', 'idVille' => 4],
            ['nameSecteur' => 'AZROU', 'idVille' => 8],
            ['nameSecteur' => 'BELFAA', 'idVille' => 5],
            ['nameSecteur' => 'BIOUGRA', 'idVille' => 3],
            ['nameSecteur' => 'EL LHOUDA', 'idVille' => 9],
            ['nameSecteur' => 'EL QODS', 'idVille' => 9],
            ['nameSecteur' => 'ELJIHADIYA', 'idVille' => 1],
            ['nameSecteur' => 'GUELMIM', 'idVille' => 13],
            ['nameSecteur' => 'JARF', 'idVille' => 1],
            ['nameSecteur' => 'KASBAT TAHER', 'idVille' => 4],
            ['nameSecteur' => 'LAAZIB LAQLIAA', 'idVille' => 2],
            ['nameSecteur' => 'LAKHSASS', 'idVille' => 14],
            ['nameSecteur' => 'LAQLIAA', 'idVille' => 2],
            ['nameSecteur' => 'LARBAA AIT BOUTAIB', 'idVille' => 10],
            ['nameSecteur' => 'MASSA', 'idVille' => 16],
            ['nameSecteur' => 'OULAD DAHOU', 'idVille' => 7],
            ['nameSecteur' => 'SEBT AIT MILK', 'idVille' => 17],
            ['nameSecteur' => 'SIDI BIBI', 'idVille' => 12],
            ['nameSecteur' => 'SIDI MIMOUNE', 'idVille' => 4],
            ['nameSecteur' => 'TADDART', 'idVille' => 11],
            ['nameSecteur' => 'TARRAST', 'idVille' => 1],
            ['nameSecteur' => 'TEMSSIA', 'idVille' => 4],
            ['nameSecteur' => 'TIZNIT', 'idVille' => 15],
            ['nameSecteur' => 'HAYMOHAMMADI', 'idVille' => 9],
            ['nameSecteur' => 'TANTAN', 'idVille' => 18],
            ['nameSecteur' => 'DRARGA', 'idVille' => 19],
            ['nameSecteur' => 'DAKHLA', 'idVille' => 20],
            ['nameSecteur' => 'DCHEIRA', 'idVille' => 21],
            ['nameSecteur' => 'POLYVALENT', 'idVille' => 22],
            ['nameSecteur' => 'TAGADIRTE', 'idVille' => 23],
            ['nameSecteur' => 'TAMAAIT', 'idVille' => 24],
            ['nameSecteur' => 'AOURIR', 'idVille' => 25],
            ['nameSecteur' => 'AGDAL', 'idVille' => 4],
            ['nameSecteur' => 'SALAM', 'idVille' => 9],
            ['nameSecteur' => 'TIKIWINE', 'idVille' => 26],
            ['nameSecteur' => 'MASSIRA', 'idVille' => 9],
            ['nameSecteur' => 'BENSERGAOU', 'idVille' => 9],
            ['nameSecteur' => 'EL MASSIRA', 'idVille' => 4],
            ['nameSecteur' => 'DAKHLA SAHARA', 'idVille' => 27],
            ['nameSecteur' => 'TAMAZARTE', 'idVille' => 4],
            ['nameSecteur' => 'BENAANFAR', 'idVille' => 2],
            ['nameSecteur' => 'CHOHADA', 'idVille' => 4],
            ['nameSecteur' => 'ELFARAH', 'idVille' => 9],
            ['nameSecteur' => 'ANZA', 'idVille' => 11],
            ['nameSecteur' => 'ALMOUSTAQBAL', 'idVille' => 4],
            ['nameSecteur' => 'RMAL', 'idVille' => 1],
            ['nameSecteur' => 'AMOUGAY', 'idVille' => 21],
            ['nameSecteur' => 'AIT BAHA', 'idVille' => 28],
            ['nameSecteur' => 'ELWIFAQ', 'idVille' => 9],
            ['nameSecteur' => 'LAMZAR', 'idVille' => 4],
            ['nameSecteur' => 'TILILA', 'idVille' => 9],
            ['nameSecteur' => 'IMORAN', 'idVille' => 9],
            ['nameSecteur' => 'LHARCH', 'idVille' => 4],
            ['nameSecteur' => 'TASSILA', 'idVille' => 9],
            ['nameSecteur' => 'LAAYOUNE', 'idVille' => 29],
            ['nameSecteur' => 'IHCHACHE', 'idVille' => 9],
            ['nameSecteur' => 'ARGANA', 'idVille' => 4],
            ['nameSecteur' => 'YOUSSOUFIA', 'idVille' => 15],
            ['nameSecteur' => 'AIT JRAR', 'idVille' => 15],
            ['nameSecteur' => 'IMJJAD', 'idVille' => 15],
            ['nameSecteur' => '11 -- JANVIER', 'idVille' => 26],
            ['nameSecteur' => 'TAMRAGHT', 'idVille' => 25],
            ['nameSecteur' => 'TERMINUS', 'idVille' => 2],
            ['nameSecteur' => 'LIRAK BOUARGAN', 'idVille' => 9],
        ];

        foreach ($sectors as $sector) {
            Secteur::create(
                [
                    'nameSecteur' => $sector['nameSecteur'],
                    'idVille' => $sector['idVille']
                ]
            );
        }
    }
}
