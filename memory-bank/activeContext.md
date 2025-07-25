# Active Context - Current Work Focus

## Current Status
**Phase**: Suppression complète du module Stock (backend et frontend)
**Last Activity**: Suppression exhaustive du module stock (contrôleur, routes, composants React, navigation, configuration)
**Next Focus**: Recréation du module stock selon les patterns standardisés du projet

## Détail de l'opération récente

### ❌ Suppression du module Stock (Backend & Frontend)
- Suppression du contrôleur backend StockController et de toutes les routes associées
- Suppression de tous les fichiers frontend du module stock (AppTable, StockTable, PaginationSelection, columns.tsx, index.tsx, dossier mouvements/stock)
- Suppression de l'entrée "Stock" dans la navigation sidebar
- Vérification globale de l'absence de toute référence résiduelle (import, navigation, commentaire, etc.)
- Documentation de l'opération dans la mémoire du projet
- Préparation à une recréation propre du module stock selon les patterns standardisés

## Recent Accomplishments

### ✅ Entrer Module System (Just Completed)
1. **Entrer Management**
   - Full CRUD operations with validation
   - Product and transporteur relationships
   - React components with shadcn/ui integration
   - Permission-based access control
   - Automatic product details population
   - Date management with shadcn/ui components

2. **Advanced Features**
   - **Combobox avec recherche** pour la sélection des produits (Command + Popover)
   - Automatic reference and price population from selected product
   - Transporteur selection with vehicle and driver information
   - Optional date decharge and manque fields
   - Copy functionality for quick duplication
   - **Enhanced UX**: Recherche en temps réel dans la liste des produits avec affichage de la référence

### ✅ Product Management System (Previously Completed)
1. **Brand Management**
   - Full CRUD operations with validation
   - Brand model with unique constraints
   - React components with shadcn/ui integration
   - Permission-based access control

2. **Category Management**
   - Complete category CRUD functionality
   - Hierarchical category support ready
   - Consistent UI patterns with other modules
   - Proper form validation and error handling

3. **Product Management**
   - Comprehensive product catalog system
   - Brand and category relationships
   - Units per package tracking (`nombre_unite_par_colis`)
   - Advanced search and filtering capabilities
   - Print-ready product listings

### ✅ Core Infrastructure (Previously Completed)
- User authentication with Laravel Breeze
- Role-based permission system
- Client-Commercial relationship management
- Territory management (Villes/Secteurs)
- Print functionality for client lists

## Current Work Focus

### Immediate Priorities
1. **Entrer Module Testing**
   - Test all CRUD operations for the new Entrer module
   - Verify product selection and automatic field population
   - Test date validation and optional fields
   - Validate transporteur relationships

2. **System Integration Testing**
   - Verify all CRUD operations work correctly across all modules
   - Test permission enforcement across modules
   - Validate data relationships and constraints

3. **Code Quality Review**
   - Ensure consistent patterns across all modules
   - Verify TypeScript types are properly defined
   - Check for any remaining lint errors or warnings

4. **Performance Optimization**
   - Review database queries for N+1 issues
   - Optimize table pagination and search
   - Ensure proper eager loading relationships

## Recent Technical Decisions

### Database Design Choices
- Added `nombre_unite_par_colis` to products table for inventory tracking
- Implemented unique constraints on product libelle for data integrity
- Used proper foreign key relationships throughout

### Frontend Architecture
- Maintained consistent component structure across all modules
- Used dialog modals for create/edit operations
- Implemented reusable pagination and search components
- Followed shadcn/ui patterns for all new components

### ⚠️ CRITICAL HTTP Request Rule (Recently Established)
**ALWAYS use Inertia.js instead of fetch() for form submissions and CRUD operations**

**Exceptions (cas particuliers)**:
1. **API calls for dynamic data loading** (e.g., `/api/product-details/{id}` for populating form fields)
2. **Real-time validation checks** (e.g., `/api/check-bl-exists/{numeroBl}` for duplicate checking)
3. **File uploads with progress tracking** (if needed)
4. **WebSocket connections** (if implemented)

**Why**: Prevents CSRF issues (error 419), ensures consistent error handling, and maintains SPA experience.

**Pattern**:
```tsx
// ✅ CORRECT
router.put(route('entrers.update', { entrer: entrer.id }), formData, {
  onSuccess: () => toast.success('Success!'),
  onError: (errors) => setErrors(errors),
  onFinish: () => setProcessing(false),
});

// ❌ WRONG - Causes CSRF issues
fetch(route('entrers.update', { entrer: entrer.id }), {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
```

### Permission Strategy
- Extended permission system to include brand/category/product permissions
- Maintained consistent permission naming convention
- Integrated permissions into both backend policies and frontend visibility

## Known Issues & Considerations

### ✅ Recently Resolved Issues
1. **Accordéon qui s'ouvre automatiquement après édition/duplication**
   - **Problème** : L'accordéon des produits s'ouvrait automatiquement après sauvegarde d'une modification ou duplication
   - **Cause** : Propagation des événements de clic des modals vers la table en arrière-plan
   - **Solution** : Ajout de protections contre la propagation d'événements dans les modals
   - **Fichiers modifiés** : `ProductEditDialog.tsx`, `ProductDialog.tsx`, `ProductTable.tsx`
   - **Pattern à réutiliser** : `onPointerDownOutside`, `onInteractOutside`, `onClick` avec `stopPropagation()`

2. **Bouton Annuler non fonctionnel en mode duplication**
   - **Problème** : Le bouton "Annuler" ne fermait pas le modal en mode duplication
   - **Cause** : Utilisation de `setOpen(false)` au lieu de `setDialogOpen(false)`
   - **Solution** : Correction de la logique de gestion d'état du modal
   - **Pattern à réutiliser** : Gestion cohérente des états locaux vs externes dans les modals

### Pending Items
1. **Testing Coverage**: Need to add tests for new modules
   - Unit tests for new models
   - Feature tests for new controllers
   - Component tests for new React components

2. **Documentation Updates**: 
   - API documentation for new endpoints
   - User guide updates for new features
   - Database schema documentation

### Technical Debt
- Some duplicate code patterns could be abstracted
- Table components have similar pagination logic
- Form validation patterns could be more standardized

## Next Steps (Priority Order)

### 1. Immediate (Current Session)
- [x] Create complete Entrer module with all components
- [x] Implement database migration and model relationships
- [x] Add permissions and navigation integration
- [x] Create test data with seeder
- [ ] Test all CRUD operations for Entrer module
- [ ] Verify automatic product details population
- [ ] Test date validation and optional fields

### 2. Short Term (Next 1-2 Sessions)
- [ ] Add comprehensive tests for new modules
- [ ] Implement any missing permissions or policies
- [ ] Optimize database queries and relationships
- [ ] Add data export functionality for products

### 3. Medium Term (Next Week)
- [ ] Implement inventory tracking features
- [ ] Add advanced reporting capabilities
- [ ] Create data import/export tools
- [ ] Enhance search and filtering options

## Patterns & Insights Learned

### What's Working Well
1. **Consistent Component Architecture**: The established pattern of index.tsx → AppTable.tsx → components/ is scaling well
2. **Permission Integration**: The permission hooks and policy integration provides good security
3. **Dialog Modal Pattern**: Users prefer modal dialogs over separate pages for CRUD operations
4. **Search Integration**: Global search with server-side filtering performs well
5. **Module Creation Patterns**: Documented comprehensive patterns for rapid module development

### Areas for Improvement
1. **Code Duplication**: Table components share a lot of similar logic
2. **Form Validation**: Could benefit from shared validation patterns
3. **Type Safety**: Some areas still need better TypeScript coverage
4. **Testing**: Need better test coverage for complex interactions

### New UI Patterns (Recently Added)
1. **ProductCombobox Pattern**: Combinaison dropdown/zone de recherche pour la sélection des produits
   - Utilise les composants Command + Popover de shadcn/ui
   - Recherche en temps réel sur le nom et la référence du produit
   - Affichage de la référence sous le nom du produit
   - Gestion des produits inactifs avec désactivation
   - Pattern réutilisable pour d'autres sélections complexes

2. **ProtectedCombobox Pattern** (Dossier `/patterns`): Composant combobox sécurisé avec protection d'événements
   - **Emplacement**: `resources/js/components/patterns/ProtectedCombobox.tsx`
   - **Documentation**: `resources/js/components/patterns/README.md`
   - **Fonctionnalités**:
     - Protection complète contre la propagation d'événements
     - Recherche en temps réel avec filtre sur label et subLabel
     - Gestion des éléments inactifs avec désactivation visuelle
     - Support des sous-labels (ex: références de produits)
     - Interface cohérente avec shadcn/ui
   - **Utilisation standardisée**:
     ```tsx
     import ProtectedCombobox from '@/components/patterns/ProtectedCombobox';
     
     <ProtectedCombobox
       items={products}
       value={selectedProductId}
       onValueChange={setSelectedProductId}
       placeholder="Sélectionnez un produit..."
       searchPlaceholder="Rechercher un produit..."
     />
     ```

### ⚠️ CRITICAL: Event Propagation Protection Patterns (Newly Added)

#### 1. **ProtectedCombobox Component** (Standardized Solution)
**Problem**: Clicks on combobox components trigger parent form submissions.

**Solution**: Use the standardized `ProtectedCombobox` component from `/patterns`:
```tsx
// ✅ CORRECT - Use ProtectedCombobox
import ProtectedCombobox from '@/components/patterns/ProtectedCombobox';

<ProtectedCombobox
  items={products}
  value={selectedProductId}
  onValueChange={setSelectedProductId}
  placeholder="Sélectionnez un produit..."
  searchPlaceholder="Rechercher un produit..."
/>
```

**Alternative manual protection** (if custom combobox needed):
```tsx
// ✅ CORRECT - Manual Protected Combobox
<div 
  className="relative"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
  }}
>
  <Button
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(!open);
    }}
  >
  {open && (
    <div onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}>
      <Input
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
      />
    </div>
  )}
</div>
```

#### 2. **Modal Event Propagation Protection**
```tsx
<DialogContent
  onPointerDownOutside={(e) => e.preventDefault()}
  onInteractOutside={(e) => e.preventDefault()}
  onClick={(e) => e.stopPropagation()}
>
```

#### 3. **Table Row Event Protection**
```tsx
onClick={(e) => {
  e.stopPropagation();
  // logique de clic
}}
```

**Why Critical**: Prevents accidental form submissions, maintains proper UX flow, avoids conflicts between interactive elements.

## Module Creation Patterns (Newly Documented)

### Quick Start Guide for New Modules
1. **Copy the pattern structure** from `systemPatterns.md` section "Module Creation Patterns"
2. **Replace placeholders**: `[Entity]` → actual entity name, `[entity]` → lowercase entity name
3. **Create backend components**: Model, Migration, Controller, Request, Policy
4. **Create frontend components**: Follow the 6-pattern structure documented
5. **Add permissions**: Create and assign appropriate permissions
6. **Test the complete flow**: CRUD operations with proper validation

### Pattern Benefits
- **Consistency**: All modules follow the same structure and behavior
- **Speed**: New modules can be created in minutes by following patterns
- **Maintainability**: Standardized code is easier to maintain and debug
- **User Experience**: Consistent UI/UX across all modules
- **Security**: Built-in permission checks and validation patterns

### Pattern Components
1. **Index Page**: Main entry point with layout and toaster
2. **AppTable**: Table wrapper with search, filters, and actions
3. **Dialog**: Create modal with form validation
4. **DropDown**: Row actions (Edit, Copy, Delete) with permissions
5. **Table**: Data table with pagination and sorting
6. **Columns**: Column definitions with proper typing

### Key Technical Insights
- Inertia.js works excellently for this type of CRUD application
- shadcn/ui components provide good consistency and accessibility
- Laravel 12's auto-discovery features simplify development
- Permission-based UI rendering improves user experience significantly
- **Modal Event Isolation**: Critical to prevent event propagation between modals and background elements
- **State Management**: Consistent state handling between local and external modal states prevents UI bugs

## Development Environment Notes
- Running on Windows with PowerShell
- Using Vite for fast frontend development
- Database migrations are working correctly
- No major configuration issues encountered 
