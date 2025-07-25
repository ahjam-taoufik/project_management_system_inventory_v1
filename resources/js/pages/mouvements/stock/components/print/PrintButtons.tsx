import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Printer, ChevronDown, FileText, LayoutGrid, Package, Check } from 'lucide-react';
import { PrintableStockList } from './PrintableStockList';
import { PrintableStockByBrand } from './PrintableStockByBrand';
import { PrintableStockByMultipleBrands } from './PrintableStockByMultipleBrands';
import { calculerMontant } from '../../utils/formatting';
import { Stock } from '../../types';

interface PrintButtonsProps {
  stocks: Stock[];
  brands: Array<{
    id: number;
    brand_name: string;
  }>;
  totalMontantAchat?: number;
  totalMontantVente?: number;
  totalDiff?: number;
}

export function PrintButtons({
  stocks,
  brands,
  totalMontantAchat = 0,
  totalMontantVente = 0,
  totalDiff = 0
}: PrintButtonsProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  // État pour la multi-sélection de marques
  const [selectedBrands, setSelectedBrands] = useState<Array<{
    id: number;
    brand_name: string;
  }>>([]);

  // Refs pour les composants imprimables
  const stockListRef = useRef<HTMLDivElement>(null);
  const stocksByBrandRef = useRef<HTMLDivElement>(null);
  const stocksByMultipleBrandsRef = useRef<HTMLDivElement>(null);

  // Gestionnaire pour imprimer tous les stocks
  // Utiliser une fonction wrapper pour handlePrintAllStocks
  const handlePrintAllStocksOriginal = useReactToPrint({
    contentRef: stockListRef,
    documentTitle: `Liste_Stocks_${new Date().toISOString().split('T')[0]}`,
    onBeforePrint: () => {
      return new Promise<void>((resolve) => {
        // Attendez un court instant pour s'assurer que tout est rendu
        setTimeout(resolve, 100);
      });
    },
    onAfterPrint: () => {
      // Utiliser un court délai avant de modifier l'état
      setTimeout(() => {
        setIsPrinting(false);
      }, 100);
    },
    onPrintError: (error) => {
      setTimeout(() => {
        setIsPrinting(false);
        console.error("Erreur d'impression:", error);
      }, 100);
    },
  });

  // Fonction wrapper pour gérer l'impression avec une meilleure gestion des erreurs
  const handlePrintAllStocks = () => {
    try {
      // Petit délai pour éviter les problèmes de port déconnecté
      requestAnimationFrame(() => {
        handlePrintAllStocksOriginal();
      });
    } catch (error) {
      console.error("Erreur lors de la préparation de l'impression:", error);
      // Utiliser requestAnimationFrame pour modifier l'état en toute sécurité
      requestAnimationFrame(() => {
        setIsPrinting(false);
      });
    }
  };

  // Gestionnaire pour imprimer les stocks par marque
  const handlePrintByBrandOriginal = useReactToPrint({
    contentRef: stocksByBrandRef,
    documentTitle: `Stocks_Par_Marque_${new Date().toISOString().split('T')[0]}`,
    pageStyle: `
      @page { size: A4; margin: 10mm; }
      @media print {
        html, body { height: 100%; margin: 0; padding: 0; }
        .print-content { padding: 0 !important; margin: 0 !important; }
        .first-page-content { page-break-after: avoid !important; }
        .brand-section { page-break-inside: avoid !important; }
      }
    `,
    onBeforePrint: () => {
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 100);
      });
    },
    onAfterPrint: () => {
      setTimeout(() => {
        setIsPrinting(false);
      }, 100);
    },
    onPrintError: (error) => {
      setTimeout(() => {
        setIsPrinting(false);
        console.error("Erreur d'impression:", error);
      }, 100);
    },
  });

  // Fonction pour lancer l'impression
  const handlePrintByBrand = () => {
    if (!stocksByBrandRef.current) {
      console.error("Le composant d'impression n'est pas prêt");
      requestAnimationFrame(() => {
        setIsPrinting(false);
      });
      return;
    }

    try {
      // Utiliser requestAnimationFrame pour éviter les problèmes de port déconnecté
      requestAnimationFrame(() => {
        handlePrintByBrandOriginal();
      });
    } catch (error) {
      console.error("Erreur lors de l'impression:", error);
      requestAnimationFrame(() => {
        setIsPrinting(false);
      });
    }
  };

  // Gestionnaire pour imprimer les stocks par marques multiples
  const handlePrintByMultipleBrands = useReactToPrint({
    contentRef: stocksByMultipleBrandsRef,
    documentTitle: `Stocks_Marques_Multiples_${new Date().toISOString().split('T')[0]}`,
    onBeforePrint: () => {
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 100);
      });
    },
    onAfterPrint: () => {
      setTimeout(() => {
        setIsPrinting(false);
        setSelectedBrands([]); // Réinitialiser la sélection après l'impression
      }, 100);
    },
    onPrintError: (error) => {
      setTimeout(() => {
        setIsPrinting(false);
        setSelectedBrands([]);
        console.error("Erreur d'impression pour marques multiples:", error);
      }, 100);
    },
  });

  // Gérer la sélection de marques et déclencher l'impression
  function handleBrandSelection(
    brandSelection: Array<{ id: number; brand_name: string }> | { id: number; brand_name: string }
  ) {
    // Normaliser en tableau
    const brandsArray = Array.isArray(brandSelection) ? brandSelection : [brandSelection];

    // Utiliser requestAnimationFrame pour des modifications d'état plus sûres
    requestAnimationFrame(() => {
      setSelectedBrands(brandsArray);

      // Attendre que l'état soit mis à jour
      requestAnimationFrame(() => {
        setIsPrinting(true);

        // Utiliser requestAnimationFrame pour l'impression
        requestAnimationFrame(() => {
          try {
            if (document.body.contains(stocksByMultipleBrandsRef.current)) {
              handlePrintByMultipleBrands();
            } else {
              console.error("Référence d'impression non disponible");
              setIsPrinting(false);
              setSelectedBrands([]);
            }
          } catch (error) {
            console.error("Erreur lors de l'impression par marques:", error);
            requestAnimationFrame(() => {
              setIsPrinting(false);
              setSelectedBrands([]);
            });
          }
        });
      });
    });
  }

  // Dialog state and logic moved to the main component scope
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogSelectedBrands, setDialogSelectedBrands] = useState<Array<{
    id: number;
    brand_name: string;
  }>>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleOpenModal = () => {
      setIsDialogOpen(true);
      setDialogSelectedBrands([]);
      setSearchTerm('');
    };

    window.addEventListener('open-brand-selection-modal', handleOpenModal);

    return () => {
      window.removeEventListener('open-brand-selection-modal', handleOpenModal);
    };
  }, []);

  // Filtrer les marques en fonction du terme de recherche
  const filteredBrands = brands.filter(brand =>
    brand.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Vérifier si une marque est sélectionnée
  const isBrandSelected = (brandId: number) => {
    return dialogSelectedBrands.some(brand => brand.id === brandId);
  };

  // Gérer la sélection/désélection d'une marque
  const handleToggleBrand = (brand: { id: number; brand_name: string }) => {
    if (isBrandSelected(brand.id)) {
      setDialogSelectedBrands(prev => prev.filter(b => b.id !== brand.id));
    } else {
      setDialogSelectedBrands(prev => [...prev, brand]);
    }
  };

  // Gérer la validation de la sélection
  const handleConfirmSelection = () => {
    if (dialogSelectedBrands.length > 0) {
      handleBrandSelection(dialogSelectedBrands);
    }
    setIsDialogOpen(false);
  };

  // Gérer le changement d'état du dialog
  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setDialogSelectedBrands([]);
      setSearchTerm('');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled={isPrinting || stocks.length === 0}
          >
            <Printer className="h-4 w-4" />
            {isPrinting ? 'Impression...' : 'Imprimer'}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuItem
            onClick={() => {
              setIsPrinting(true);
              // Appeler la nouvelle fonction wrapper
              handlePrintAllStocks();
            }}
            disabled={isPrinting || stocks.length === 0}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Liste complète des stocks
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsPrinting(true);
              // Utiliser un court délai pour laisser l'état se mettre à jour
              setTimeout(handlePrintByBrand, 50);
            }}
            disabled={isPrinting || stocks.length === 0}
            className="flex items-center gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            Tous les stocks par marque
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              const event = new CustomEvent('open-brand-selection-modal');
              window.dispatchEvent(event);
            }}
            disabled={isPrinting || stocks.length === 0 || brands.length === 0}
            className="flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            Stocks par marques (sélection)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Composants imprimables cachés */}
      <div style={{ display: 'none' }}>
        <PrintableStockList
          ref={stockListRef}
          stocks={[...stocks].sort((a, b) => {
            // Trier par nom de produit (DESC)
            const nomA = a.product?.product_libelle?.toLowerCase() || '';
            const nomB = b.product?.product_libelle?.toLowerCase() || '';
            return nomB.localeCompare(nomA); // Ordre inversé pour DESC
          })}
          title="Liste Complète des Stocks"
          totalMontantAchat={
            // Calculer le total en ignorant les valeurs négatives
            stocks.reduce((total, stock) => {
              // Calculer le montant pour ce stock
              const montant = calculerMontant(stock.valeur_stock, stock.product?.prix_achat_colis);
              // Ajouter au total seulement si c'est positif
              return total + (montant > 0 ? montant : 0);
            }, 0)
          }
          totalMontantVente={
            // Calculer le total en ignorant les valeurs négatives
            stocks.reduce((total, stock) => {
              // Calculer le montant pour ce stock
              const montant = calculerMontant(stock.valeur_stock, stock.product?.prix_vente_colis);
              // Ajouter au total seulement si c'est positif
              return total + (montant > 0 ? montant : 0);
            }, 0)
          }
          totalDiff={
            // Recalculer la différence avec les nouveaux totaux
            stocks.reduce((total, stock) => {
              const montantVente = calculerMontant(stock.valeur_stock, stock.product?.prix_vente_colis);
              const montantAchat = calculerMontant(stock.valeur_stock, stock.product?.prix_achat_colis);
              // Ajouter au total seulement si les montants sont positifs
              return total + ((montantVente > 0 ? montantVente : 0) - (montantAchat > 0 ? montantAchat : 0));
            }, 0)
          }
        />
        <PrintableStockByBrand
          ref={stocksByBrandRef}
          stocks={stocks}
          brands={brands}
          totalMontantAchat={totalMontantAchat}
          totalMontantVente={totalMontantVente}
          totalDiff={totalDiff}
        />

        {selectedBrands.length > 0 && (
          <PrintableStockByMultipleBrands
            ref={stocksByMultipleBrandsRef}
            stocks={stocks}
            brands={selectedBrands}
            totalMontantAchat={totalMontantAchat}
            totalMontantVente={totalMontantVente}
          />
        )}
      </div>

      {/* Dialogue modal pour la sélection de marques avec Dialog standardisé */}
      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange} modal={false}>
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black/70 z-50 animate-in fade-in-0" aria-hidden="true"></div>
        )}
        <DialogContent
          onInteractOutside={e => e.preventDefault()}
          className="max-w-2xl z-50">
          <DialogHeader>
            <DialogTitle>Sélectionner des marques</DialogTitle>
            <DialogDescription>
              Sélectionnez une ou plusieurs marques pour imprimer les stocks correspondants.
            </DialogDescription>
          </DialogHeader>

          {/* Recherche */}
          <div className="relative my-4">
            <input
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
          <div className="flex justify-between pt-4">
            <div className="text-sm text-gray-500">
              {dialogSelectedBrands.length} marque{dialogSelectedBrands.length > 1 ? 's' : ''} sélectionnée{dialogSelectedBrands.length > 1 ? 's' : ''}
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleConfirmSelection}
                disabled={dialogSelectedBrands.length === 0}
              >
                Confirmer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
