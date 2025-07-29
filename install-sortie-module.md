# Installation du Module Sortie

Ce guide vous explique comment installer et configurer le module de sortie (bon de livraison) dans votre application Laravel.

## Étapes d'installation

### 1. Exécuter les migrations

```bash
php artisan migrate
```

### 2. Exécuter les seeders pour les permissions

```bash
php artisan db:seed --class=AssignSortiePermissionsSeeder
```

### 3. (Optionnel) Exécuter le seeder pour les données de test

```bash
php artisan db:seed --class=SortieSeeder
```

### 4. Ou exécuter tous les seeders

```bash
php artisan db:seed
```

## Structure créée

### Tables de base de données :
- `sorties` : Table principale des sorties
- `sortie_products` : Table des produits associés aux sorties

### Modèles :
- `App\Models\Sortie` : Modèle principal des sorties
- `App\Models\SortieProduct` : Modèle des produits de sortie

### Contrôleur :
- `App\Http\Controllers\SortieController` : Contrôleur CRUD complet

### Permissions créées :
- `sorties.view` : Voir les sorties
- `sorties.create` : Créer des sorties
- `sorties.edit` : Modifier des sorties
- `sorties.delete` : Supprimer des sorties

### Routes disponibles :
- `GET /sorties` : Liste des sorties
- `POST /sorties` : Créer une sortie
- `GET /sorties/{sortie}` : Voir une sortie
- `PUT /sorties/{sortie}` : Modifier une sortie
- `DELETE /sorties/{sortie}` : Supprimer une sortie

### Routes API :
- `GET /api/sortie-product-details/{productId}` : Détails d'un produit
- `GET /api/check-sortie-bl-exists/{numeroBl}` : Vérifier si un BL existe
- `GET /api/clients-by-commercial/{commercialId}` : Clients par commercial

## Fonctionnalités

### Interface utilisateur :
- ✅ Tableau avec filtrage et pagination
- ✅ Dialog de création avec sélection multiple de produits
- ✅ Dialog de modification
- ✅ Actions (voir, modifier, imprimer, supprimer)
- ✅ Expansion des lignes pour voir les détails des produits
- ✅ Calcul automatique des totaux

### Backend :
- ✅ Validation complète des données
- ✅ Gestion des transactions pour la cohérence
- ✅ Observers pour la gestion automatique du stock
- ✅ Relations Eloquent optimisées
- ✅ Permissions et sécurité

### Gestion du stock :
- ✅ Diminution automatique du stock lors des sorties
- ✅ Remise en stock lors des suppressions
- ✅ Gestion des modifications de quantité

## Utilisation

1. Accédez à `/sorties` dans votre application
2. Utilisez le bouton "Nouvelle Sortie" pour créer un bon de livraison
3. Sélectionnez un commercial, un client, et ajoutez des produits
4. Le total est calculé automatiquement
5. Le stock est mis à jour automatiquement

## Permissions

Toutes les permissions sont automatiquement assignées au rôle `super-admin`. Pour d'autres rôles, assignez manuellement les permissions nécessaires :

```php
$role = Role::findByName('nom-du-role');
$role->givePermissionTo(['sorties.view', 'sorties.create', 'sorties.edit', 'sorties.delete']);
```

## Dépendances

Le module dépend des entités suivantes qui doivent être présentes :
- Commerciaux (`commerciaux` table)
- Clients (`clients` table)
- Produits (`products` table)
- Villes (`villes` table)
- Secteurs (`secteurs` table)

## Tests

Des factories sont disponibles pour les tests :
- `SortieFactory`
- `SortieProductFactory`

Exemple d'utilisation :
```php
$sortie = Sortie::factory()
    ->has(SortieProduct::factory()->count(3))
    ->create();
```