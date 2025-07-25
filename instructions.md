
# Système de Gestion d'Inventaire - Laravel 12 + Inertia + React
vous êtes un expert en développement (laravel 12 full stack inertia et React intégrer)
## Vue d'ensemble du projet
Application de gestion d'inventaire construite avec Laravel 12, utilisant Inertia.js pour l'intégration frontend et React avec TypeScript pour l'interface utilisateur.

## Technologies principales
- **Backend** : Laravel 12 (PHP 8.2+)
- **Frontend** : React avec TypeScript
- **Bridge** : Inertia.js
- **Styling** : TailwindCSS + shadcn/ui
- **Base de données** : MySQL
- **Authentification** : Laravel Breeze + Sanctum
- **Permissions** : spatie/laravel-permission
- **Impression** : react-to-print

## Fonctionnalités principales

### Gestion des utilisateurs et permissions
- Authentification sécurisée avec Laravel Breeze
- Système de rôles et permissions avec spatie/laravel-permission
- Gestion des profils utilisateurs
- Interface d'administration des utilisateurs

### Gestion géographique
- **Villes** : Gestion des villes avec CRUD complet
- **Secteurs** : Organisation par secteurs géographiques

### Gestion commerciale
- **Commerciaux** : Gestion des représentants commerciaux
- **Clients** : Gestion complète des clients avec assignation aux commerciaux

### 🆕 Système d'impression
- **Impression de la liste complète des clients** : Format PDF optimisé avec toutes les informations
- **Impression par commercial** : Rapport groupé par commercial avec détails de chaque client
- **Styles d'impression professionnels** : Optimisés pour format A4
- **Gestion des états de chargement** : Feedback utilisateur pendant l'impression
- **Titres automatiques** : Avec dates et statistiques

## Structure des fichiers

### Backend (Laravel)
```
app/
├── Http/Controllers/     # Contrôleurs Inertia
├── Models/              # Modèles Eloquent
├── Http/Requests/       # Validation des formulaires
└── Http/Middleware/     # Middleware personnalisés

database/
├── migrations/          # Migrations de base de données
├── seeders/            # Données de test
└── factories/          # Factories pour les tests
```

### Frontend (React + TypeScript)
```
resources/js/
├── pages/              # Pages Inertia
│   ├── client/         # Gestion des clients
│   │   └── components/
│   │       └── print/  # 🆕 Composants d'impression
│   ├── commercial/     # Gestion des commerciaux
│   ├── user/          # Gestion des utilisateurs
│   ├── role/          # Gestion des rôles
│   ├── ville/         # Gestion des villes
│   └── secteur/       # Gestion des secteurs
├── components/         # Composants réutilisables
├── layouts/           # Layouts de l'application
├── hooks/             # Hooks React personnalisés
└── types/             # Types TypeScript
```

## 🆕 Documentation du système d'impression

### Composants d'impression

#### `PrintButtons`
- Menu déroulant avec options d'impression
- Gestion des états de chargement
- Désactivation automatique si aucun client

#### `PrintableClientList`
- Format liste complète avec tableau structuré
- En-tête avec date et statistiques
- Styles optimisés pour l'impression

#### `PrintableClientsByCommercial`
- Groupement intelligent par commercial
- Sections dédiées pour chaque commercial
- Gestion des clients non assignés

### Utilisation
```tsx
import { PrintButtons } from '@/pages/client/components/print';

<PrintButtons clients={clients} commerciaux={commerciaux} />
```

### Fonctionnalités
- ✅ Impression optimisée A4
- ✅ Formatage français des dates
- ✅ Gestion des erreurs
- ✅ États de chargement
- ✅ Titres automatiques
- ✅ Styles responsive

## Installation et configuration

### Prérequis
- PHP 8.2+
- Node.js 18+
- MySQL 8.0+
- Composer

### Installation
```bash
# Cloner le projet
git clone [repository-url]
cd projet_v1

# Installation des dépendances backend
composer install

# Installation des dépendances frontend
npm install

# Configuration de l'environnement
cp .env.example .env
php artisan key:generate

# Migration et seeding
php artisan migrate --seed

# Compilation des assets
npm run build
```

### Développement
```bash
# Serveur Laravel
php artisan serve

# Serveur de développement Vite
npm run dev
```

## Commandes utiles

### Laravel
```bash
php artisan make:controller --resource
php artisan make:model -mfr
php artisan make:request
php artisan migrate:fresh --seed
```

### Frontend
```bash
npm run dev          # Développement
npm run build        # Production
npm run lint         # Linting ESLint
npm run format       # Formatage Prettier
```

## Tests

### Tests backend
```bash
php artisan test
```

### Tests frontend
```bash
npm run lint
```

## Sécurité

- **CSRF Protection** : Activé via Sanctum
- **Authentication** : Laravel Breeze
- **Authorization** : Système de rôles et permissions
- **Validation** : Form Requests Laravel
- **Sanitization** : Validation côté client et serveur

## Performance

- **Optimisation Vite** : Bundle splitting automatique
- **Lazy Loading** : Composants chargés à la demande
- **Caching** : Cache Laravel activé
- **Image Optimization** : Assets optimisés

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push sur la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## Licence

Ce projet est sous licence MIT.

---

## 🔄 Changelog récent

### v1.1.0 - Système d'impression
- ✅ Ajout du système d'impression pour les clients
- ✅ Support de l'impression par commercial
- ✅ Styles d'impression optimisés
- ✅ Interface utilisateur améliorée
- ✅ Documentation complète

### v1.0.0 - Version initiale
- ✅ CRUD complet pour toutes les entités
- ✅ Système d'authentification
- ✅ Gestion des permissions
- ✅ Interface utilisateur moderne
