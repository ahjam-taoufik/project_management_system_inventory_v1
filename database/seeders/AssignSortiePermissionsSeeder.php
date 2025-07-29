<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class AssignSortiePermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer les permissions pour les sorties si elles n'existent pas
        $sortiePermissions = [
            'sorties.view',
            'sorties.create',
            'sorties.edit',
            'sorties.delete',
        ];

        foreach ($sortiePermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Assigner toutes les permissions de sortie au rôle super-admin
        $superAdminRole = Role::firstOrCreate(['name' => 'super-admin']);
        
        $permissions = Permission::whereIn('name', $sortiePermissions)->get();
        $superAdminRole->givePermissionTo($permissions);

        $this->command->info('Permissions de sortie assignées au super-admin avec succès');
    }
}