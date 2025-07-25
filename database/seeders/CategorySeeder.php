<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
          // ⚠️ Désactiver les clés étrangères pour éviter les conflits
          DB::statement('SET FOREIGN_KEY_CHECKS=0;');

          // 🧹 Vider la table (remise à zéro)
          Category::truncate();

          // ✅ Réactiver les clés étrangères
          DB::statement('SET FOREIGN_KEY_CHECKS=1;');

          $categories = [
            ['category_name' => 'POUDRE MAIN', 'brand_id' => 1],
            ['category_name' => 'PATE', 'brand_id' => 1],
            ['category_name' => 'POUDRE MATIC', 'brand_id' => 1],
            ['category_name' => 'LIQUIDE VAISSELLE', 'brand_id' => 1],
            ['category_name' => 'LIQUIDE DETERGENT', 'brand_id' => 1],
            ['category_name' => 'LAVE SOL', 'brand_id' => 1],
            ['category_name' => 'JAVEL', 'brand_id' => 1],
            ['category_name' => 'SERPILLERE', 'brand_id' => 1],
            ['category_name' => 'SAC CONGELATION', 'brand_id' => 4],
            ['category_name' => 'FILM ALIMENTAIRE', 'brand_id' => 4],
            ['category_name' => 'SAC POUBELLE', 'brand_id' => 5],
            ['category_name' => 'LAVE MAIN', 'brand_id' => 6],
            ['category_name' => 'SERPILLERE', 'brand_id' => 7],
            ['category_name' => 'MOUCHOIRS', 'brand_id' => 8],
            ['category_name' => 'LINGETTE', 'brand_id' => 8],
            ['category_name' => 'PAPIER HYGIENIQUE', 'brand_id' => 9],
            ['category_name' => 'MOUCHOIRS', 'brand_id' => 9],
            ['category_name' => 'LINGETTE', 'brand_id' => 9],
            ['category_name' => 'SOLUTION', 'brand_id' => 2],
            ['category_name' => 'POUDRE MAIN', 'brand_id' => 2],
            ['category_name' => 'PATE', 'brand_id' => 2],
            ['category_name' => 'NETTOYANT', 'brand_id' => 2],
            ['category_name' => 'POUDRE MATIC', 'brand_id' => 2],
            ['category_name' => 'LIQUIDE VAISSELLE', 'brand_id' => 2],
            ['category_name' => 'LIQUIDE DETERGENT', 'brand_id' => 2],
            ['category_name' => 'LAVE VITRE', 'brand_id' => 2],
            ['category_name' => 'LAVE SOL', 'brand_id' => 2],
            ['category_name' => 'JAVEL', 'brand_id' => 2],
            ['category_name' => 'DETARTRANT', 'brand_id' => 2],
            ['category_name' => 'GEL', 'brand_id' => 2],
            ['category_name' => 'MICROFIBRE', 'brand_id' => 10],
            ['category_name' => 'MASQUE', 'brand_id' => 11],
            ['category_name' => 'POUDRE MAIN', 'brand_id' => 12],
            ['category_name' => 'LAVE MAIN', 'brand_id' => 13],
            ['category_name' => 'NETTOYANT', 'brand_id' => 14],
            ['category_name' => 'LIQUIDE VAISSELLE', 'brand_id' => 15],
            ['category_name' => 'POUDRE MAIN', 'brand_id' => 16],
            ['category_name' => 'POUDRE MAIN', 'brand_id' => 17],
            ['category_name' => 'POUDRE MAIN', 'brand_id' => 18],
            ['category_name' => 'POUDRE MAIN', 'brand_id' => 3],
            ['category_name' => 'LAVE MAIN', 'brand_id' => 19],
            ['category_name' => 'AIR FRESHENER', 'brand_id' => 19],
            ['category_name' => 'PAPIER HYGIENIQUE', 'brand_id' => 20],
            ['category_name' => 'POUDRE MATIC', 'brand_id' => 21],
            ['category_name' => 'LIQUIDE DETERGENT', 'brand_id' => 21],
            ['category_name' => 'POUDRE MATIC', 'brand_id' => 22],
            ['category_name' => 'LIQUIDE DETERGENT', 'brand_id' => 22],
          ];

          foreach ($categories as $category){
            Category::create([
                'category_name' => $category['category_name'],
                'brand_id' => $category['brand_id'],
            ]);
          }


    }
}

