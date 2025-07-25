import React from 'react';
import { Stock } from '../../types';
import { formatPrix, formatNombre, calculerMontant } from '../../utils/formatting';

interface PrintableStockByMultipleBrandsProps {
  stocks: Stock[];
  brands: Array<{
    id: number;
    brand_name: string;
  }>;
  totalMontantAchat?: number;
  totalMontantVente?: number;
}

export const PrintableStockByMultipleBrands = React.forwardRef<HTMLDivElement, PrintableStockByMultipleBrandsProps>(
  ({
    stocks,
    brands,
    totalMontantAchat = 0,
    totalMontantVente = 0
  }, ref) => {
    const currentDate = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Filtrer les stocks pour ne garder que ceux des marques sélectionnées
    const selectedBrandIds = brands.map(brand => brand.id);
    const filteredStocks = stocks.filter(stock =>
      stock.product?.brand_id && selectedBrandIds.includes(stock.product.brand_id)
    );

    // Calculer les totaux pour ces marques
    const brandsTotalAchat = filteredStocks.reduce((total, stock) =>
      total + calculerMontant(stock.valeur_stock, stock.product?.prix_achat_colis), 0);

    const brandsTotalVente = filteredStocks.reduce((total, stock) =>
      total + calculerMontant(stock.valeur_stock, stock.product?.prix_vente_colis), 0);

    const brandsTotalDiff = brandsTotalVente - brandsTotalAchat;

    // Pourcentage de ces marques par rapport au total
    const percentageOfTotalAchat = totalMontantAchat > 0
      ? (brandsTotalAchat / totalMontantAchat * 100)
      : 0;

    const percentageOfTotalVente = totalMontantVente > 0
      ? (brandsTotalVente / totalMontantVente * 100)
      : 0;

    // Regrouper les produits par marque
    const stocksByBrand = brands.map(brand => {
      const brandStocks = filteredStocks.filter(stock => stock.product?.brand_id === brand.id);
      const brandTotalAchat = brandStocks.reduce((total, stock) =>
        total + calculerMontant(stock.valeur_stock, stock.product?.prix_achat_colis), 0);
      const brandTotalVente = brandStocks.reduce((total, stock) =>
        total + calculerMontant(stock.valeur_stock, stock.product?.prix_vente_colis), 0);
      const brandTotalDiff = brandTotalVente - brandTotalAchat;

      return {
        brand,
        stocks: brandStocks,
        totalAchat: brandTotalAchat,
        totalVente: brandTotalVente,
        totalDiff: brandTotalDiff,
        percentageOfSelectionAchat: brandsTotalAchat > 0
          ? (brandTotalAchat / brandsTotalAchat * 100)
          : 0
      };
    });

    return (
      <div ref={ref} className="print-content">
        <style>
          {`
            @media print {
              .print-content {
                font-family: Arial, sans-serif;
                font-size: 12px;
                color: #000;
                background: white url('../../mio.jpg') no-repeat center center;
                background-size: 80%;
                background-position: center center;
                background-attachment: fixed;
                background-blend-mode: lighten;
                opacity: 1;
                max-width: 100%;
                margin: 0;
                padding: 0;
                position: relative;
              }

              /* Ajouter un pseudo-élément pour contrôler l'opacité de l'image d'arrière-plan */
              .print-content::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                opacity: 0.1; /* Ajuster l'opacité de l'image d'arrière-plan */
              }

              body {
                margin: 0;
                padding: 0;
              }

              @page {
                margin: 10mm;
                size: auto;
              }

              .print-header {
                text-align: center;
                margin-bottom: 20px;
                border-bottom: 2px solid #333;
                padding: 15px 15px 15px 15px;
                /* Empêcher le saut de page juste après l'en-tête principal */
                page-break-after: avoid;
              }

              .print-title {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
                color: #333;
              }

              .print-subtitle {
                font-size: 18px;
                color: #666;
                margin-bottom: 5px;
              }

              .print-date {
                font-size: 14px;
                color: #666;
                margin-bottom: 10px;
              }

              .print-stats {
                font-size: 12px;
                color: #888;
              }

              .print-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                font-size: 11px;
                /* Permettre les sauts de page dans les grandes tables */
                page-break-inside: auto;
              }

              .print-table th,
              .print-table td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }

              .print-table th {
                background-color: #f5f5f5;
                font-weight: bold;
                font-size: 12px;
              }
              
              /* Répéter les en-têtes de tableau sur chaque page */
              .print-table thead {
                display: table-header-group;
              }
              
              /* Permettre aux corps de tableau de se diviser entre les pages */
              .print-table tbody {
                display: table-row-group;
              }

              .print-table tbody tr:nth-child(even) {
                background-color: #f9f9f9;
              }

              .print-footer {
                margin-top: 30px;
                text-align: center;
                font-size: 10px;
                color: #888;
                border-top: 1px solid #ddd;
                padding-top: 15px;
              }

              .text-right {
                text-align: right;
              }

              .text-center {
                text-align: center;
              }

              .totals-section {
                margin-top: 20px;
                border-top: 1px solid #ddd;
                padding-top: 10px;
              }

              .totals-table {
                width: 100%;
                margin-top: 10px;
                border-collapse: collapse;
              }

              .totals-table th,
              .totals-table td {
                padding: 8px;
                text-align: right;
              }

              .totals-label {
                font-weight: bold;
              }

              .positive {
                color: green;
              }

              .negative {
                color: red;
              }

              .info-section {
                background-color: #f9f9f9;
                padding: 10px;
                margin-bottom: 20px;
                border-radius: 5px;
                border: 1px solid #eee;
                /* Garder la section d'info avec l'en-tête */
                page-break-before: avoid;
                page-break-after: avoid;
              }

              .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
              }

              .info-item {
                padding: 5px;
              }

              .info-label {
                font-weight: bold;
                color: #555;
              }

              .info-value {
                margin-left: 5px;
              }

              .brand-section {
                margin-bottom: 40px;
                /* Permettre le saut de page à l'intérieur des sections de marque */
                page-break-inside: auto;
              }

              .brand-header {
                background-color: #eee;
                padding: 10px;
                margin-bottom: 10px;
                border-radius: 4px;
                /* Empêcher le saut de page juste après l'en-tête de marque */
                page-break-after: avoid;
              }

              .brand-title {
                font-size: 16px;
                font-weight: bold;
                color: #333;
              }

              .brand-stats {
                font-size: 12px;
                color: #666;
              }
            }

            @media screen {
              .print-content {
                max-width: 210mm;
                margin: 0 auto;
                padding: 20px;
                background: white;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
              }
            }
          `}
        </style>

        <div className="print-header">
          <h1 className="print-title">Rapport de Stock</h1>
          <h2 className="print-subtitle">Marques Sélectionnées ({brands.length})</h2>
          <p className="print-date">Généré le {currentDate}</p>
          <p className="print-stats">
            Total: {filteredStocks.length} {filteredStocks.length > 1 ? 'produits' : 'produit'} dans {brands.length} {brands.length > 1 ? 'marques' : 'marque'}
          </p>
        </div>

        <div className="info-section">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Montant total d'achat:</span>
              <span className="info-value">{formatPrix(brandsTotalAchat)} DH</span>
            </div>
            <div className="info-item">
              <span className="info-label">Montant total de vente:</span>
              <span className="info-value">{formatPrix(brandsTotalVente)} DH</span>
            </div>
            <div className="info-item">
              <span className="info-label">Différence (Profit estimé):</span>
              <span className={`info-value ${brandsTotalDiff >= 0 ? 'positive' : 'negative'}`}>
                {formatPrix(brandsTotalDiff)} DH
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Pourcentage du stock total:</span>
              <span className="info-value">
                {percentageOfTotalAchat.toFixed(2)}% (achat) | {percentageOfTotalVente.toFixed(2)}% (vente)
              </span>
            </div>
          </div>
        </div>

        {/* Afficher les stocks par marque */}
        {stocksByBrand.map((brandData) => (
          <div key={brandData.brand.id} className="brand-section">
            <div className="brand-header">
              <h3 className="brand-title">
                {brandData.brand.brand_name}
              </h3>
              <div className="brand-stats">
                {brandData.stocks.length} {brandData.stocks.length > 1 ? 'produits' : 'produit'} |
                Achat: {formatPrix(brandData.totalAchat)} DH |
                Vente: {formatPrix(brandData.totalVente)} DH |
                Diff: <span className={brandData.totalDiff >= 0 ? 'positive' : 'negative'}>
                  {formatPrix(brandData.totalDiff)} DH
                </span> |
                {brandData.percentageOfSelectionAchat.toFixed(2)}% du total sélectionné
              </div>
            </div>

            <table className="print-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Référence</th>
                  <th className="text-right">Valeur Stock</th>
                  <th className="text-right">Prix Achat (DH)</th>
                  <th className="text-right">Prix Vente (DH)</th>
                  <th className="text-right">Montant Achat (DH)</th>
                  <th className="text-right">Montant Vente (DH)</th>
                  <th className="text-right">Diff. (DH)</th>
                </tr>
              </thead>
              <tbody>
                {brandData.stocks.map((stock, index) => {
                  const montantAchat = calculerMontant(stock.valeur_stock, stock.product?.prix_achat_colis);
                  const montantVente = calculerMontant(stock.valeur_stock, stock.product?.prix_vente_colis);
                  const diff = montantVente - montantAchat;

                  return (
                    <tr key={stock.id || index}>
                      <td>{stock.product?.product_libelle || ''}</td>
                      <td>{stock.product?.product_Ref || '-'}</td>
                      <td className="text-right">{formatNombre(stock.valeur_stock)}</td>
                      <td className="text-right">{formatPrix(stock.product?.prix_achat_colis)}</td>
                      <td className="text-right">{formatPrix(stock.product?.prix_vente_colis)}</td>
                      <td className="text-right">{formatPrix(montantAchat)}</td>
                      <td className="text-right">{formatPrix(montantVente)}</td>
                      <td className={`text-right ${diff >= 0 ? 'positive' : 'negative'}`}>
                        {formatPrix(diff)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Les informations de totaux sont déjà affichées dans l'en-tête de la marque */}
          </div>
        ))}

        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '11px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          <p><strong>Note:</strong> Les produits avec des valeurs de stock négatives ne sont pas pris en compte dans le calcul des montants totaux d'achat et de vente.</p>
        </div>

        <div className="print-footer">
          <p>© {new Date().getFullYear()} - Rapport généré automatiquement</p>
        </div>
      </div>
    );
  }
);
