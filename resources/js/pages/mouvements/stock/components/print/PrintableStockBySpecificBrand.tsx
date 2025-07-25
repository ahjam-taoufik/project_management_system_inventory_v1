import React from 'react';
import { Stock } from '../../types';
import { formatPrix, formatNombre, calculerMontant } from '../../utils/formatting';

interface PrintableStockBySpecificBrandProps {
  stocks: Stock[];
  brand: {
    id: number;
    brand_name: string;
  };
  totalMontantAchat?: number;
  totalMontantVente?: number;
}

export const PrintableStockBySpecificBrand = React.forwardRef<HTMLDivElement, PrintableStockBySpecificBrandProps>(
  ({ 
    stocks, 
    brand,
    totalMontantAchat = 0,
    totalMontantVente = 0
  }, ref) => {
    const currentDate = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Filtrer les stocks pour ne garder que ceux de la marque spécifiée
    const brandStocks = stocks.filter(stock => 
      stock.product?.brand_id === brand.id
    );

    // Calculer les totaux pour cette marque
    const brandTotalAchat = brandStocks.reduce((total, stock) => 
      total + calculerMontant(stock.valeur_stock, stock.product?.prix_achat_colis), 0);

    const brandTotalVente = brandStocks.reduce((total, stock) => 
      total + calculerMontant(stock.valeur_stock, stock.product?.prix_vente_colis), 0);

    const brandTotalDiff = brandTotalVente - brandTotalAchat;

    // Pourcentage de la marque par rapport au total
    const percentageOfTotalAchat = totalMontantAchat > 0 
      ? (brandTotalAchat / totalMontantAchat * 100) 
      : 0;

    const percentageOfTotalVente = totalMontantVente > 0 
      ? (brandTotalVente / totalMontantVente * 100) 
      : 0;

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
          <h2 className="print-subtitle">Marque: {brand.brand_name}</h2>
          <p className="print-date">Généré le {currentDate}</p>
          <p className="print-stats">
            Total: {brandStocks.length} {brandStocks.length > 1 ? 'produits' : 'produit'}
          </p>
        </div>

        <div className="info-section">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Montant total d'achat:</span>
              <span className="info-value">{formatPrix(brandTotalAchat)} DH</span>
            </div>
            <div className="info-item">
              <span className="info-label">Montant total de vente:</span>
              <span className="info-value">{formatPrix(brandTotalVente)} DH</span>
            </div>
            <div className="info-item">
              <span className="info-label">Différence (Profit estimé):</span>
              <span className={`info-value ${brandTotalDiff >= 0 ? 'positive' : 'negative'}`}>
                {formatPrix(brandTotalDiff)} DH
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
            {brandStocks.map((stock, index) => {
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

        <div className="totals-section">
          <table className="totals-table">
            <tbody>
              <tr>
                <td className="totals-label">Total Montant Achat:</td>
                <td>{formatPrix(brandTotalAchat)} DH</td>
              </tr>
              <tr>
                <td className="totals-label">Total Montant Vente:</td>
                <td>{formatPrix(brandTotalVente)} DH</td>
              </tr>
              <tr>
                <td className="totals-label">Différence:</td>
                <td className={brandTotalDiff >= 0 ? 'positive' : 'negative'}>
                  {formatPrix(brandTotalDiff)} DH
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="print-footer">
          <p>Système de Gestion d'Inventaire - Rapport généré automatiquement</p>
          <p>Page 1 sur 1</p>
        </div>
      </div>
    );
  }
);

PrintableStockBySpecificBrand.displayName = 'PrintableStockBySpecificBrand';
