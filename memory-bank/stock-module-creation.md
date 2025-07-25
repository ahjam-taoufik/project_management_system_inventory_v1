# Stock Module Creation - Documentation

## Règles métier spécifiques
- La table `stocks` doit contenir une ligne pour chaque produit de la table `products`.
- Seuls les produits actifs (`is_active = true` dans `products`) sont affichés dans le module stock.
- À la création d’un produit, une ligne de stock doit être créée automatiquement (stock à zéro).
- Si un produit est activé (passage de inactif à actif), il doit apparaître dans le module stock, avec une ligne de stock initialisée à zéro si elle n’existait pas.
- Si un produit est supprimé, la ligne de stock associée est supprimée (cascade).

## Étapes de création et de gestion du module stock

### 1. Backend
- [x] Création de la migration `stocks` (schéma conforme, clé étrangère, unique, timestamps)
- [x] Création du modèle `Stock` (fillable, casts, relation product, accesseurs dynamiques)
- [x] Création du FormRequest `StockRequest` (validation, unicité, règles métier)
- [x] Création de la Policy `StockPolicy` (permissions Spatie)
- [x] Création du Controller `StockController` (CRUD, autorisation, validation, Inertia, pagination, recherche, tri, relations)
- [x] Déclaration de la resource dans `routes/web.php`
- [x] Ajout des permissions dans le seeder
- [ ] Script de remplissage initial de la table `stocks` pour tous les produits existants
- [ ] Observer ou logique pour la création automatique d’une ligne de stock à chaque création/activation de produit
- [ ] Adaptation du contrôleur pour n’afficher que les produits actifs

### 2. Frontend
- [x] Création de la structure du dossier `mouvements/stock/` (index.tsx, AppTable.tsx, config/columns.tsx, components/…)
- [x] Squelettes des composants principaux (AppTable, StockDialog, etc.)
- [ ] Adaptation du type Stock pour gérer le cas où le stock est null
- [ ] Adaptation du tableau pour afficher tous les produits actifs, même sans stock existant (valeurs par défaut)
- [ ] Gestion des actions (création de stock si non existant, édition/suppression si existant)

### 3. Synchronisation & intégrité
- [ ] S’assurer que la table `stocks` reste synchronisée avec la table `products` (création, activation, suppression)
- [ ] Tests d’intégrité et de cohérence

---

**Ce fichier doit être mis à jour à chaque étape structurante ou règle métier ajoutée/modifiée pour le module stock.** 
