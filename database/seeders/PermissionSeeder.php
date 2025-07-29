<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          // ⚠️ Désactiver les clés étrangères pour éviter les conflits
          DB::statement('SET FOREIGN_KEY_CHECKS=0;');

          // 🧹 Vider la table (remise à zéro)
          Permission::truncate();

          // ✅ Réactiver les clés étrangères
          DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $permissions = [
                            // Permissions Utilisateurs
                            'users.view',
                            'users.create',
                            'users.edit',
                            'users.delete',
                            // Permissions Commerciaux
                            'commerciaux.view',
                            'commerciaux.create',
                            'commerciaux.edit',
                            'commerciaux.delete',
                            // Permissions Reglement
                            'reglement.view',
                            'reglement.create',
                            'reglement.edit',
                            'reglement.delete',
                            // Permissions Rôles
                            'roles.view',
                            'roles.create',
                            'roles.edit',
                            'roles.delete',
                            // Permissions Clients
                            'clients.view',
                            'clients.create',
                            'clients.edit',
                            'clients.delete',
                            // Permissions Secteurs
                            'secteurs.view',
                            'secteurs.create',
                            'secteurs.edit',
                            'secteurs.delete',
                            // Permissions Villes
                            'villes.view',
                            'villes.create',
                            'villes.edit',
                            'villes.delete',
                            // Permissions Brands
                            'brands.view',
                            'brands.create',
                            'brands.edit',
                            'brands.delete',
                            // Permissions Categories
                            'categories.view',
                            'categories.create',
                            'categories.edit',
                            'categories.delete',
                            // Permissions Products
                            'products.view',
                            'products.create',
                            'products.edit',
                            'products.delete',
                            // Permissions Livreurs
                            'livreurs.view',
                            'livreurs.create',
                            'livreurs.edit',
                            'livreurs.delete',
                            // Permissions Transporteurs
                            'transporteurs.view',
                            'transporteurs.create',
                            'transporteurs.edit',
                            'transporteurs.delete',
                            // Permissions Promotions
                            'promotions.view',
                            'promotions.create',
                            'promotions.edit',
                            'promotions.delete',
                            // Permissions Entrers
                            'entrers.view',
                            'entrers.create',
                            'entrers.edit',
                            'entrers.delete',
                            // Permissions Sorties
                            'sorties.view',
                            'sorties.create',
                            'sorties.edit',
                            'sorties.delete',
                            // Permissions Stocks
                            'stocks.view',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Après la création de toutes les permissions :
        $superAdminRole = Role::firstOrCreate(['name' => 'super-admin']);
        $allPermissions = Permission::all();
        $superAdminRole->syncPermissions($allPermissions);
    }
}

