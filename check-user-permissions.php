<?php

require_once 'vendor/autoload.php';

use Illuminate\Foundation\Application;
use App\Models\User;
use Spatie\Permission\Models\Role;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🔍 Vérification des permissions utilisateur...\n\n";

// Trouver les utilisateurs avec le rôle super-admin
$superAdminUsers = User::role('super-admin')->get();

echo "👑 Utilisateurs avec rôle super-admin:\n";
foreach ($superAdminUsers as $user) {
    echo "   - {$user->name} ({$user->email})\n";
    
    // Vérifier les permissions sorties
    $sortiePermissions = ['sorties.view', 'sorties.create', 'sorties.edit', 'sorties.delete'];
    echo "     Permissions sorties:\n";
    foreach ($sortiePermissions as $permission) {
        $hasPermission = $user->hasPermissionTo($permission);
        echo "       " . ($hasPermission ? '✅' : '❌') . " {$permission}\n";
    }
    echo "\n";
}

// Vérifier le rôle super-admin
$superAdminRole = Role::where('name', 'super-admin')->first();
if ($superAdminRole) {
    echo "🔐 Permissions du rôle super-admin:\n";
    $rolePermissions = $superAdminRole->permissions->pluck('name')->toArray();
    $sortiePermissions = ['sorties.view', 'sorties.create', 'sorties.edit', 'sorties.delete'];
    
    foreach ($sortiePermissions as $permission) {
        $hasPermission = in_array($permission, $rolePermissions);
        echo "   " . ($hasPermission ? '✅' : '❌') . " {$permission}\n";
    }
} else {
    echo "❌ Rôle super-admin non trouvé\n";
}

echo "\n💡 Si les permissions sont OK mais le lien n'apparaît pas:\n";
echo "   1. Vider le cache: php artisan cache:clear\n";
echo "   2. Recompiler les assets: npm run build\n";
echo "   3. Vérifier la connexion utilisateur\n";
echo "   4. Vérifier la console du navigateur\n";