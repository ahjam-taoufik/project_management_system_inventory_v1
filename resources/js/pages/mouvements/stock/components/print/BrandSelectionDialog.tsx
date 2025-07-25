import React, { useState, useEffect } from 'react';
import { Package, Check } from 'lucide-react';

// Types
interface BrandSelectionDialogProps {
  brands: Array<{
    id: number;
    brand_name: string;
  }>;
  onBrandSelected: (brands: Array<{ id: number; brand_name: string }>) => void;
  disabled?: boolean;
  multiSelect?: boolean;
  isModal?: boolean;
  buttonId?: string;
  buttonLabel?: string;
  customEventName?: string;
}

// Bouton simple
function SimpleButton({
  children,
  className = "",
  disabled = false,
  onClick = () => {},
  type = "button",
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

// Composant de dialogue modal simple
function SimpleDialog({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Bloquer le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Arrêter la propagation pour que les clics à l'intérieur du dialogue ne ferment pas le dialogue
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto"
        onClick={handleContentClick}
      >
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fermer"
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export function BrandSelectionDialog({
  brands,
  onBrandSelected,
  disabled = false,
  multiSelect = false
}: BrandSelectionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<Array<{id: number; brand_name: string}>>([]);

  // Réinitialiser les marques sélectionnées à l'ouverture du dialogue
  useEffect(() => {
    if (isOpen) {
      setSelectedBrands([]);
    }
  }, [isOpen]);

  // Filtrer les marques en fonction du terme de recherche
  const filteredBrands = brands.filter(brand => 
    brand.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Fermer d'abord le dropdown si nécessaire
    document.body.click();

    // Puis ouvrir le dialogue
    setTimeout(() => {
      setIsOpen(true);
    }, 50);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggleBrand = (brand: { id: number; brand_name: string }) => {
    if (!multiSelect) {
      // Mode sélection unique
      setSelectedBrands([brand]);
      handleConfirmSelection();
      return;
    }

    // Mode multi-sélection
    setSelectedBrands(prev => {
      const isSelected = prev.some(item => item.id === brand.id);
      if (isSelected) {
        return prev.filter(item => item.id !== brand.id);
      } else {
        return [...prev, brand];
      }
    });
  };

  const handleConfirmSelection = () => {
    const brandsToSubmit = [...selectedBrands];
    handleClose();

    // Délai pour s'assurer que le dialogue est fermé avant d'exécuter l'action
    setTimeout(() => {
      if (multiSelect) {
        onBrandSelected(brandsToSubmit);
      } else {
        // Pour maintenir la compatibilité avec l'ancienne interface
        onBrandSelected(brandsToSubmit.length > 0 ? [brandsToSubmit[0]] : []);
      }
    }, 100);
  };

  // Vérifier si une marque est sélectionnée
  const isBrandSelected = (brandId: number) => {
    return selectedBrands.some(brand => brand.id === brandId);
  };

  return (
    <>
      <SimpleButton
        className="w-full bg-transparent hover:bg-gray-100 text-left justify-start py-1.5 text-sm transition-colors"
        disabled={disabled}
        onClick={handleOpen}
      >
        <Package className="mr-2 h-4 w-4" />
        {multiSelect ? "Stocks par marques multiples" : "Stocks par marque spécifique"}
      </SimpleButton>

      <SimpleDialog
        isOpen={isOpen}
        onClose={handleClose}
        title={multiSelect ? "Sélectionner des marques" : "Sélectionner une marque"}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            {multiSelect 
              ? "Sélectionnez une ou plusieurs marques pour imprimer les stocks correspondants." 
              : "Choisissez une marque pour imprimer les stocks correspondants."}
          </p>

          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une marque..."
              className="w-full p-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-auto border rounded-md">
            {filteredBrands.length === 0 ? (
              <div className="p-2 text-gray-500 text-sm">Aucune marque trouvée.</div>
            ) : (
              <ul className="divide-y">
                {filteredBrands.map(brand => (
                  <li key={brand.id}>
                    <button
                      className="w-full text-left p-2 hover:bg-gray-100 flex items-center"
                      onClick={() => handleToggleBrand(brand)}
                    >
                      <div className="flex-shrink-0 mr-2">
                        {isBrandSelected(brand.id) ? (
                          <Check className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Package className="h-4 w-4" />
                        )}
                      </div>
                      <span className={isBrandSelected(brand.id) ? "font-medium" : ""}>
                        {brand.brand_name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-between pt-2">
            {multiSelect && (
              <div className="text-sm text-gray-500">
                {selectedBrands.length} marque{selectedBrands.length > 1 ? 's' : ''} sélectionnée{selectedBrands.length > 1 ? 's' : ''}
              </div>
            )}

            <div className="flex space-x-2">
              <SimpleButton
                className="bg-transparent border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md"
                onClick={handleClose}
              >
                Annuler
              </SimpleButton>

              {multiSelect && (
                <SimpleButton
                  className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md"
                  onClick={handleConfirmSelection}
                  disabled={selectedBrands.length === 0}
                >
                  Confirmer
                </SimpleButton>
              )}
            </div>
          </div>
        </div>
      </SimpleDialog>
    </>
  );
}
