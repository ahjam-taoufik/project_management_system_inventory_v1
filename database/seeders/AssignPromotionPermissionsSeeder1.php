<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Permission;

class AssignPromotionPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer le premier utilisateur
        $user = User::first();

        if ($user) {
            echo "Assigning promotion permissions to user: " . $user->name . "\n";

            // Assigner les permissions des promotions
            $user->givePermissionTo([
                'promotions.view',
                'promotions.create',
                'promotions.edit',
                'promotions.delete'
            ]);

            echo "Promotion permissions assigned successfully!\n";

            // Afficher les permissions actuelles
            echo "Current user permissions:\n";
            $permissions = $user->getAllPermissions()->pluck('name')->toArray();
            print_r($permissions);
        } else {
            echo "No user found in database.\n";
        }
    }
}
