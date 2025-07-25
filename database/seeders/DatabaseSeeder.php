<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Créer d'abord TOUTES les permissions via les seeders
        $this->call([
            PermissionSeeder::class,
            VilleSeeder::class,
            SecteurSeeder::class,
            CommercialSeeder::class,
            LivreurSeeder::class,
            ClientSeeder::class,
            BrandSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            TransporteurSeeder::class,
        ]);

        // 2. Maintenant créer le rôle Super Admin avec TOUTES les permissions
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin']);

        // 3. Assigner toutes les permissions au rôle Super Admin
        $allPermissions = Permission::all();
        $superAdminRole->syncPermissions($allPermissions);

        // 4. Créer le super utilisateur
        $superUser = User::firstOrCreate(
            ['email' => 'superadmin@admin.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password'),
            ]
        );

        // 5. Assigner le rôle Super Admin à l'utilisateur
        $superUser->assignRole($superAdminRole);

        // 6. Créer d'autres utilisateurs de test
        // $users = [
        //     [
        //         'name' => 'John Doe',
        //         'email' => 'john@example.com',
        //         'password' => bcrypt('password'),
        //     ],
        //     [
        //         'name' => 'Jane Smith',
        //         'email' => 'jane@example.com',
        //         'password' => bcrypt('password'),
        //     ],
        // ];

        // foreach ($users as $userData) {
        //     User::firstOrCreate(
        //         ['email' => $userData['email']],
        //         $userData
        //     );
        // }
    }
}
