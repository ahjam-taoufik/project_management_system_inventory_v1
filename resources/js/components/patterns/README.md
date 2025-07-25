# Component Patterns

Ce dossier contient des composants de base réutilisables avec des patterns établis pour maintenir la cohérence et éviter les problèmes courants.

## ProtectedCombobox

### Problème résolu
Les combobox peuvent déclencher accidentellement des soumissions de formulaire ou d'autres actions non désirées à cause de la propagation d'événements.

### Solution
Composant combobox avec protection complète contre la propagation d'événements.

### Utilisation

```tsx
import ProtectedCombobox from '@/components/patterns/ProtectedCombobox';

// Dans votre composant
const products = [
  { id: 1, label: 'Produit A', subLabel: 'Ref: PROD001', isActive: true },
  { id: 2, label: 'Produit B', subLabel: 'Ref: PROD002', isActive: false },
];

<ProtectedCombobox
  items={products}
  value={selectedProductId}
  onValueChange={setSelectedProductId}
  placeholder="Sélectionnez un produit..."
  searchPlaceholder="Rechercher un produit..."
/>
```

### Props

- `items`: Array d'objets avec `id`, `label`, `subLabel?`, `isActive?`
- `value`: ID de l'élément sélectionné
- `onValueChange`: Callback appelé lors de la sélection
- `disabled?`: Désactive le combobox
- `placeholder?`: Texte affiché quand aucun élément n'est sélectionné
- `searchPlaceholder?`: Placeholder du champ de recherche
- `className?`: Classes CSS supplémentaires

### Protection d'événements

Le composant inclut automatiquement :
- `e.preventDefault()` et `e.stopPropagation()` sur tous les clics
- Protection sur le conteneur principal
- Protection sur le bouton de déclenchement
- Protection sur l'input de recherche
- Protection sur le dropdown
- Protection sur les éléments de la liste

## Patterns à suivre

### 1. Toujours utiliser ProtectedCombobox pour les sélections
```tsx
// ✅ CORRECT
<ProtectedCombobox items={items} value={value} onValueChange={setValue} />

// ❌ WRONG - Peut causer des problèmes de propagation
<select value={value} onChange={handleChange}>
  {items.map(item => <option key={item.id}>{item.label}</option>)}
</select>
```

### 2. Protection des modals
```tsx
<DialogContent
  onPointerDownOutside={(e) => e.preventDefault()}
  onInteractOutside={(e) => e.preventDefault()}
  onClick={(e) => e.stopPropagation()}
>
```

### 3. Protection des événements de table
```tsx
onClick={(e) => {
  e.stopPropagation();
  // logique de clic
}}
```

## Pourquoi c'est critique

- **Prévention des soumissions accidentelles** : Évite que les clics sur les combobox déclenchent des formulaires
- **UX cohérente** : Maintient un comportement prévisible
- **Évite les conflits** : Empêche les interactions non désirées entre éléments
- **Accessibilité** : Maintient la navigation clavier fonctionnelle 
