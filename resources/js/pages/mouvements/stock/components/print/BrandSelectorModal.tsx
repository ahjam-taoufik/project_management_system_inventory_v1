import React, { useState, useEffect, useRef } from 'react';
import { Package, Check, X } from 'lucide-react';

// Types pour le sélecteur de marques modal
interface BrandSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  brands: Array<{
    id: number;
    brand_name: string;
  }>;
  onBrandSelected: (brands: Array<{ id: number; brand_name: string }>) => void;
}

// Composant Modal pour la sélection des marques
export function BrandSelectorModal({
  isOpen,
  onClose,
  brands,
  onBrandSelected
}: BrandSelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<Array<{
    id: number;
    brand_name: string;
  }>>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filtrer les marques basées sur le terme de recherche
  const filteredBrands = brands.filter(brand =>
    brand.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gérer la fermeture avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Bloquer le scroll quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus sur le champ de recherche quand le modal s'ouvre
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Réinitialiser l'état à la fermeture
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedBrands([]);
    }
  }, [isOpen]);

  // Vérifier si une marque est sélectionnée
  const isBrandSelected = (brandId: number) => {
    return selectedBrands.some(brand => brand.id === brandId);
  };

  // Gérer la sélection/désélection d'une marque
  const handleToggleBrand = (brand: { id: number; brand_name: string }) => {
    if (isBrandSelected(brand.id)) {
      setSelectedBrands(selectedBrands.filter(b => b.id !== brand.id));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Gérer la validation de la sélection
  const handleSubmit = () => {
    if (selectedBrands.length > 0) {
      onBrandSelected(selectedBrands);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto mx-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold">Sélectionner des marques</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-4 space-y-5">
          <p className="text-sm text-gray-600">
            Sélectionnez une ou plusieurs marques pour imprimer les stocks correspondants.
          </p>

          {/* Recherche */}
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Rechercher une marque..."
              className="w-full p-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          {/* Liste des marques */}
          <div className="max-h-80 overflow-auto border rounded-md">
            {filteredBrands.length === 0 ? (
              <div className="p-2 text-gray-500 text-sm">Aucune marque trouvée.</div>
            ) : (
              <ul className="grid grid-cols-2 gap-1 p-2">
                {filteredBrands.map(brand => (
                  <li key={brand.id}>
                    <button
                      className={`w-full text-left p-2 rounded-md border flex items-center transition-all duration-200 ${
                        isBrandSelected(brand.id) 
                          ? "bg-blue-50 border-blue-200" 
                          : "hover:bg-gray-50 border-gray-200"
                      }`}
                      onClick={() => handleToggleBrand(brand)}
                    >
                      <div className="flex-shrink-0 mr-2">
                        {isBrandSelected(brand.id) ? (
                          <Check className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Package className="h-4 w-4" />
                        )}
                      </div>
                      <span className={isBrandSelected(brand.id) ? "font-medium text-blue-700" : ""}>
                        {brand.brand_name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pied de page */}
          <div className="flex justify-between pt-2">
            <div className="text-sm text-gray-500">
              {selectedBrands.length} marque{selectedBrands.length > 1 ? 's' : ''} sélectionnée{selectedBrands.length > 1 ? 's' : ''}
            </div>

            <div className="flex space-x-2">
              <button
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                onClick={onClose}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                onClick={handleSubmit}
                disabled={selectedBrands.length === 0}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}