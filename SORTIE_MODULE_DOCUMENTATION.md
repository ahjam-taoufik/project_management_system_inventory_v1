# Module Sortie - Documentation Complète

## Vue d'ensemble

Le module Sortie gère les bons de livraison (sorties de produits) dans l'application. Il permet de créer, modifier, consulter et supprimer des sorties avec gestion automatique du stock.

## Installation Rapide

### Option 1: Commande Artisan (Recommandée)

```bash
php artisan sortie:install --seed
```

### Option 2: Installation Manuelle

```bash
# 1. Migrations
php artisan migrate

# 2. Permissions
php artisan db:seed --class=AssignSortiePermissionsSeeder

# 3. Données de test (optionnel)
php artisan db:seed --class=SortieSeeder
```

## Architecture

### Base de données

#### Table `sorties`

```sql
- id (bigint, primary key)
- numero_bl (string, unique) - Numéro du bon de livraison
- commercial_id (foreign key) - Référence au commercial
- client_id (foreign key) - Référence au client
- date_bl (date) - Date du bon de livraison
- livreur (string) - Nom du livreur
- total_bl (decimal) - Total calculé automatiquement
- timestamps
```

#### Table `sortie_products`

```sql
- id (bigint, primary key)
- sortie_id (foreign key) - Référence à la sortie
- product_id (foreign key) - Référence au produit
- ref_produit (string) - Référence du produit
- prix_vente_produit (decimal) - Prix de vente unitaire
- quantite_produit (integer) - Quantité vendue
- total_ligne (decimal) - Total de la ligne (prix × quantité)
- timestamps
```

### Modèles Eloquent

#### `App\Models\Sortie`

- Relations: `commercial()`, `client()`, `products()`
- Méthodes: `calculateTotal()`, `getProductCountAttribute()`
- Observers: Calcul automatique du total

#### `App\Models\SortieProduct`

- Relations: `sortie()`, `product()`
- Méthodes: `calculateTotalLigne()`
- Observers: Gestion du stock automatique

### Contrôleur

#### `App\Http\Controllers\SortieController`

- `index()` - Liste des sorties avec relations
- `store()` - Création avec validation et transaction
- `show()` - Affichage d'une sortie
- `update()` - Modification avec gestion des produits
- `destroy()` - Suppression avec remise en stock
- API: `getProductDetails()`, `checkBlExists()`, `getClientsByCommercial()`

### Validation

#### `App\Http\Requests\SortieRequest`

- Validation du numéro BL (unique)
- Validation des relations (commercial, client)
- Validation des produits (minimum 1)
- Messages d'erreur en français

### Permissions

```php
'sorties.view'    // Voir les sorties
'sorties.create'  // Créer des sorties
'sorties.edit'    // Modifier des sorties
'sorties.delete'  // Supprimer des sorties
```

## Interface Utilisateur (React/TypeScript)

### Composants Principaux

#### `resources/js/pages/mouvements/sortie/`

- `index.tsx` - Page principale
- `AppTable.tsx` - Composant principal avec données
- `config/columns.tsx` - Configuration des colonnes

#### `resources/js/pages/mouvements/sortie/components/`

- `SortieTable.tsx` - Tableau avec filtrage/pagination
- `SortieDialog.tsx` - Dialog de création
- `SortieEditDialog.tsx` - Dialog de modification
- `SortieDropDown.tsx` - Menu d'actions
- `PaginationSelection.tsx` - Composant de pagination

### Fonctionnalités UI

- ✅ Tableau responsive avec expansion des lignes
- ✅ Filtrage par numéro BL
- ✅ Pagination configurable
- ✅ Tri des colonnes
- ✅ Dialog de création avec produits multiples
- ✅ Dialog de modification
- ✅ Actions: voir, modifier, imprimer, supprimer
- ✅ Calcul automatique des totaux
- ✅ Notifications toast
- ✅ Raccourci clavier Alt+A pour nouvelle sortie

## Routes

### Routes Web

```php
Route::resource('sorties', SortieController::class);
// GET    /sorties           - Liste
// POST   /sorties           - Créer
// GET    /sorties/{sortie}  - Voir
// PUT    /sorties/{sortie}  - Modifier
// DELETE /sorties/{sortie}  - Supprimer
```

### Routes API

```php
GET /api/sortie-product-details/{productId}     - Détails produit
GET /api/check-sortie-bl-exists/{numeroBl}      - Vérifier BL
GET /api/clients-by-commercial/{commercialId}   - Clients par commercial
```

## Gestion du Stock

### Observers Automatiques

#### `SortieObserver`

- `created()` - Diminue le stock lors de création
- `deleted()` - Remet le stock lors de suppression
- `restored()` - Gère la restauration

#### `SortieProductObserver`

- `created()` - Diminue le stock par produit
- `updated()` - Ajuste selon la différence de quantité
- `deleted()` - Remet le stock du produit

### Logique de Stock

```php
// Création sortie: stock -= quantité
// Suppression sortie: stock += quantité
// Modification quantité: stock -= (nouvelle_qté - ancienne_qté)
```

## Tests

### Tests Feature

```bash
php artisan test tests/Feature/SortieModuleTest.php
```

### Tests Disponibles

- ✅ Accès à l'index des sorties
- ✅ Création de sortie avec produits
- ✅ Modification de sortie
- ✅ Suppression de sortie
- ✅ Contrôle des permissions
- ✅ Calcul automatique des totaux

### Factories

```php
Sortie::factory()->create();
SortieProduct::factory()->create();
```

## Utilisation

### Workflow Typique

1. **Accès au module**: `/sorties`
2. **Nouvelle sortie**: Clic sur "Nouvelle Sortie" ou Alt+A
3. **Saisie des données**:
    - Numéro BL (unique)
    - Commercial (liste déroulante)
    - Client (filtré par commercial)
    - Date BL
    - Livreur
4. **Ajout de produits**:
    - Sélection produit → prix auto-rempli
    - Saisie quantité
    - Total ligne calculé automatiquement
5. **Validation**: Total BL calculé, stock mis à jour

### Gestion des Erreurs

- Validation côté client et serveur
- Messages d'erreur explicites
- Transactions pour cohérence des données
- Rollback automatique en cas d'erreur

## Sécurité

### Permissions

- Contrôle d'accès sur toutes les actions
- Middleware de permissions
- Validation des relations (commercial/client)

### Validation

- Numéro BL unique
- Produits existants et actifs
- Quantités positives
- Dates valides

## Maintenance

### Logs

- Erreurs loggées automatiquement
- Transactions tracées
- Observers avec gestion d'erreurs

### Performance

- Relations Eloquent optimisées
- Index sur colonnes fréquemment utilisées
- Pagination des résultats
- Cache des données statiques

## Dépendances

### Tables Requises

- `commerciaux` - Commerciaux
- `clients` - Clients avec relations ville/secteur
- `products` - Produits actifs
- `stocks` - Gestion du stock
- `villes` - Villes des clients
- `secteurs` - Secteurs des clients

### Packages

- Laravel 11
- Inertia.js
- React 18
- TypeScript
- Spatie Laravel Permission
- TanStack Table

## Troubleshooting

### Problèmes Courants

1. **Permissions manquantes**

    ```bash
    php artisan db:seed --class=AssignSortiePermissionsSeeder
    ```

2. **Stock non mis à jour**

    - Vérifier les observers dans `AppServiceProvider`
    - Vérifier la table `stocks`

3. **Relations manquantes**

    - Vérifier les données de base (commerciaux, clients, produits)
    - Exécuter les seeders de base

4. **Frontend non fonctionnel**
    ```bash
    npm run build
    php artisan optimize:clear
    ```

## Évolutions Futures

### Fonctionnalités Prévues

- [ ] Export PDF des bons de livraison
- [ ] Impression directe
- [ ] Historique des modifications
- [ ] Notifications par email
- [ ] Tableau de bord des ventes
- [ ] Rapports de performance
- [ ] API REST complète
- [ ] Synchronisation mobile

### Améliorations Techniques

- [ ] Cache Redis pour les performances
- [ ] Queue pour les traitements lourds
- [ ] Tests d'intégration complets
- [ ] Documentation API Swagger
- [ ] Monitoring et métriques

## Support

Pour toute question ou problème :

1. Consulter cette documentation
2. Vérifier les logs Laravel
3. Exécuter les tests
4. Vérifier les permissions utilisateur
