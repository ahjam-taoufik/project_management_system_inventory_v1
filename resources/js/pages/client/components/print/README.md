# Système d'Impression des Clients

Ce module fournit des fonctionnalités d'impression pour la gestion des clients dans l'application d'inventaire.

## 🖨️ Options d'impression disponibles

### 1. **📋 Liste complète des clients**
- Imprime tous les clients dans un tableau structuré
- Inclut toutes les informations (code, nom, téléphone, ville, secteur, commercial, remises, dates)
- Format optimisé pour l'impression A4

### 2. **👥 Tous les clients par commercial**
- Groupe tous les clients par commercial assigné
- Affiche une section pour chaque commercial avec ses clients
- Inclut les statistiques par commercial
- Gère les clients non assignés

### 3. **🎯 Client d'un commercial spécifique**
- **NOUVEAU !** Permet de sélectionner un commercial dans une liste déroulante
- Imprime uniquement les clients assignés au commercial choisi
- Interface de sélection intuitive avec nom complet et code commercial
- Rapport personnalisé avec informations du commercial en en-tête

## Composants

### `PrintButtons`
Composant principal qui affiche un menu déroulant avec les options d'impression :
- **Liste complète des clients** : Imprime tous les clients dans un format tabulaire
- **Tous les clients par commercial** : Imprime les clients groupés par tous les commerciaux
- **Client d'un commercial spécifique** : Permet de choisir un commercial et imprimer ses clients uniquement

### `PrintableClientList`
Composant d'impression pour la liste complète des clients avec :
- En-tête avec titre, date et statistiques
- Tableau avec toutes les informations client
- Pied de page avec informations système
- Formatage sécurisé des valeurs numériques

### `PrintableClientsByCommercial`
Composant d'impression pour les clients groupés par commercial avec :
- En-tête global avec statistiques
- Sections séparées pour chaque commercial
- Informations détaillées de chaque commercial
- Tableaux des clients assignés
- Formatage sécurisé des valeurs numériques

### `PrintableClientsBySpecificCommercial`
Composant d'impression pour les clients d'un commercial spécifique avec :
- En-tête personnalisé avec le nom du commercial
- Informations détaillées du commercial sélectionné
- Tableau uniquement des clients assignés à ce commercial
- Gestion du cas "aucun client assigné"
- Formatage sécurisé des valeurs numériques

### `CommercialSelectionDialog`
Dialog de sélection d'un commercial avec :
- Liste déroulante des commerciaux disponibles
- Affichage du nom complet et code commercial
- Validation de la sélection avant impression
- Interface utilisateur intuitive

### `utils.ts`
Fonctions utilitaires pour l'impression :
- **`formatNumericValue()`** : Formatage sécurisé des valeurs numériques (gère strings/numbers/null)

## Utilisation

```tsx
import { PrintButtons } from '@/pages/client/components/print';

// Dans votre composant
<PrintButtons 
  clients={clients} 
  commerciaux={commerciaux} 
/>
```

## Styles d'Impression

Les composants incluent des styles CSS intégrés optimisés pour :
- **Impression** : Format A4, polices lisibles, tableaux structurés
- **Aperçu écran** : Visualisation similaire au rendu imprimé

## Fonctionnalités

- ✅ Gestion des états de chargement
- ✅ Désactivation des boutons si aucun client
- ✅ Titres de documents automatiques avec date
- ✅ Formatage français des dates
- ✅ Gestion des erreurs d'impression
- ✅ Responsive design
- ✅ Groupement intelligent par commercial
- ✅ Styles optimisés pour l'impression
- ✅ Formatage sécurisé des valeurs numériques (évite les erreurs toFixed)
- ✅ Gestion robuste des types de données (string/number/null/undefined)
- ✅ Sélection de commercial spécifique via dialog
- ✅ Impression ciblée par commercial individuel
- ✅ Interface utilisateur améliorée avec options claires

## 🔧 Résolution de problèmes

### Problème : Documents vides lors de l'impression par commercial
**Symptôme** : Les options "Tous les clients par commercial" et "Client d'un commercial spécifique" génèrent des documents sans clients.

**Cause** : Problème de correspondance des types d'ID entre `client.idCommercial` (string) et `commercial.id` (number).

**Solution appliquée** :
```typescript
// Normalisation des IDs pour la comparaison
const commercialId = client.idCommercial ? client.idCommercial.toString() : 'unassigned';
const targetCommercialId = commercial.id.toString();
```

**Status** : ✅ **Résolu** - Les comparaisons d'ID sont maintenant normalisées en string pour assurer la correspondance correcte.

## Dépendances

- `react-to-print`: Gestion de l'impression React
- `lucide-react`: Icônes pour l'interface
- `@/components/ui/*`: Composants UI shadcn/ui 
