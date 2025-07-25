import React from 'react';
import { Stock } from '../../types';
import { formatPrix, formatNombre, calculerMontant } from '../../utils/formatting';

interface PrintableStockByBrandProps {
  stocks: Stock[];
  brands: Array<{
    id: number;
    brand_name: string;
  }>;
  totalMontantAchat?: number;
  totalMontantVente?: number;
  totalDiff?: number;
}

export const PrintableStockByBrand = React.forwardRef<HTMLDivElement, PrintableStockByBrandProps>(
  ({ 
    stocks, 
    brands,
    totalMontantAchat = 0,
    totalMontantVente = 0,
    totalDiff = 0
  }, ref) => {
    const currentDate = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Grouper les stocks par marque
    const stocksByBrand = brands.map(brand => {
      const brandStocks = stocks.filter(stock => 
        stock.product?.brand_id === brand.id
      );

      // Calculer les totaux pour cette marque
      const brandTotalAchat = brandStocks.reduce((total, stock) => 
        total + calculerMontant(stock.valeur_stock, stock.product?.prix_achat_colis), 0);

      const brandTotalVente = brandStocks.reduce((total, stock) => 
        total + calculerMontant(stock.valeur_stock, stock.product?.prix_vente_colis), 0);

      return {
        brand,
        stocks: brandStocks,
        totalAchat: brandTotalAchat,
        totalVente: brandTotalVente,
        diff: brandTotalVente - brandTotalAchat,
        percentageOfTotalAchat: totalMontantAchat > 0 ? (brandTotalAchat / totalMontantAchat * 100) : 0
      };
    }).filter(group => group.stocks.length > 0); // Ne garder que les marques avec des stocks

    return (
      <div ref={ref} className="print-content">
        <style>
          {`
            @media print {
              html, body {
                height: auto !important;
                margin: 0 !important;
                padding: 0 !important;
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
              }

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
                width: 100%;
                max-width: 100%;
                margin: 0;
                padding: 0;
                overflow: visible !important;
                display: block;
                min-height: 100vh; /* Assurer que le contenu remplit au moins la hauteur de la page */
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

              @page {
                size: A4;
                margin: 10mm;
              }

              /* Empêcher les sauts de page indésirables */
              .no-break {
                page-break-inside: avoid !important;
                page-break-before: auto !important;
                page-break-after: auto !important;
                break-inside: avoid !important;
                display: inline-block;
                width: 100%;
                position: relative;
              }

              /* Forcer un contenu sur une nouvelle page */
              .page-break {
                page-break-before: always !important;
                break-before: always !important;
              }

              /* Ce conteneur garde son contenu sur la première page */
              .first-page-content {
                display: block;
                position: relative;
                page-break-after: avoid !important;
                break-after: avoid !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                min-height: 200px; /* Hauteur minimale pour garder du contenu sur la première page */
                margin-bottom: 40px;
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

              .print-date {
                font-size: 14px;
                color: #666;
                margin-bottom: 10px;
              }

              .print-stats {
                font-size: 12px;
                color: #888;
              }

              .brand-section {
                margin-bottom: 40px;
                page-break-inside: auto;
              }

              /* Styles pour les sections de table individuelles */
              .brand-table-wrapper {
                page-break-inside: auto;
              }

              /* Éviter les sauts de page dans l'en-tête de marque et entre l'en-tête et le début du tableau */
              .brand-header {
                page-break-after: avoid;
                page-break-inside: avoid;
              }

              /* Permettre les sauts de page entre les lignes du tableau */
              .print-table tbody tr {
                page-break-inside: auto;
              }

              /* Garder l'en-tête du tableau avec au moins 2-3 lignes */
              .print-table thead {
                display: table-header-group;
                page-break-after: avoid;
              }

              /* Répéter l'en-tête du tableau à chaque page */
              @media print {
                thead {
                  display: table-header-group;
                }
              }

              .brand-header {
                background-color: #f0f0f0;
                padding: 10px;
                margin-bottom: 10px;
                border-bottom: 1px solid #ddd;
              }

              .brand-name {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 5px;
              }

              .brand-stats {
                font-size: 12px;
                color: #666;
              }

              .print-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 10px;
              }

              .print-table th,
              .print-table td {
                border: 1px solid #ddd;
                padding: 6px;
                text-align: left;
              }

              .print-table th {
                background-color: #f5f5f5;
                font-weight: bold;
                font-size: 11px;
              }

              .print-table tbody tr:nth-child(even) {
                background-color: #f9f9f9;
              }

              .brand-totals {
                margin-top: 10px;
                text-align: right;
                padding: 5px 0;
                border-top: 1px dashed #ddd;
                font-weight: bold;
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
                border-top: 2px solid #333;
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

              .summary-heading {
                font-size: 16px;
                font-weight: bold;
                margin-top: 30px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 5px;
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

        <div className="first-page-content">
          <div className="print-header">
            <h1 className="print-title">Stocks par Marque</h1>
            <p className="print-date">Généré le {currentDate}</p>
            <p className="print-stats">
              Total: {stocks.length} produits répartis sur {stocksByBrand.length} marques
            </p>
          </div>

          {/* Afficher la première marque sur la même page que l'en-tête */}
          {stocksByBrand.length > 0 && (
            <div className="no-break" style={{pageBreakInside: 'avoid', breakInside: 'avoid', display: 'block'}}>
              <div className="brand-header">
                <h2 className="brand-name">{stocksByBrand[0].brand.brand_name}</h2>
                <p className="brand-stats">
                  {stocksByBrand[0].stocks.length} {stocksByBrand[0].stocks.length > 1 ? 'produits' : 'produit'} |
                  Achat: {formatPrix(stocksByBrand[0].totalAchat)} DH |
                  Vente: {formatPrix(stocksByBrand[0].totalVente)} DH |
                  Diff: <span className={stocksByBrand[0].diff >= 0 ? 'positive' : 'negative'}>{formatPrix(stocksByBrand[0].diff)} DH</span> |
                  {stocksByBrand[0].percentageOfTotalAchat.toFixed(2)}% du total
                </p>
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
                  </tr>
                </thead>
                <tbody>
                  {stocksByBrand[0].stocks.map((stock, index) => (
                    <tr key={stock.id || index}>
                      <td>{stock.product?.product_libelle || ''}</td>
                      <td>{stock.product?.product_Ref || '-'}</td>
                      <td
                        className="text-right"
                        style={{
                          backgroundColor:
                            Number(stock.valeur_stock) < 0
                              ? "#ffcccc"
                              : Number(stock.valeur_stock) === 0
                              ? "#ffffcc"
                              : "transparent",
                          color:
                            Number(stock.valeur_stock) < 0
                              ? "#cc0000"
                              : "inherit"
                        }}
                      >
                        {formatNombre(stock.valeur_stock)}
                      </td>
                      <td className="text-right">{formatPrix(stock.product?.prix_achat_colis)}</td>
                      <td className="text-right">{formatPrix(stock.product?.prix_vente_colis)}</td>
                      <td className="text-right">
                        {formatPrix(calculerMontant(stock.valeur_stock, stock.product?.prix_achat_colis))}
                      </td>
                      <td className="text-right">
                        {formatPrix(calculerMontant(stock.valeur_stock, stock.product?.prix_vente_colis))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="brand-totals">
                <div>Total: {formatPrix(stocksByBrand[0].totalAchat)} DH → {formatPrix(stocksByBrand[0].totalVente)} DH | Diff: <span className={stocksByBrand[0].diff >= 0 ? 'positive' : 'negative'}>{formatPrix(stocksByBrand[0].diff)} DH</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Afficher les marques restantes avec possibilité de sauts de page entre elles */}
        {stocksByBrand.slice(1).map((group) => (
          <div key={group.brand.id} className="brand-section">
            <div className="brand-header">
              <h2 className="brand-name">{group.brand.brand_name}</h2>
              <p className="brand-stats">
                {group.stocks.length} {group.stocks.length > 1 ? 'produits' : 'produit'} |
                Achat: {formatPrix(group.totalAchat)} DH |
                Vente: {formatPrix(group.totalVente)} DH |
                Diff: <span className={group.diff >= 0 ? 'positive' : 'negative'}>{formatPrix(group.diff)} DH</span> |
                {group.percentageOfTotalAchat.toFixed(2)}% du total
              </p>
            </div>

            <div className="brand-table-wrapper">
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
                </tr>
              </thead>
              <tbody>
                {group.stocks.map((stock, index) => (
                  <tr key={stock.id || index}>
                    <td>{stock.product?.product_libelle || ''}</td>
                    <td>{stock.product?.product_Ref || '-'}</td>
                    <td
                      className="text-right"
                      style={{
                        backgroundColor: Number(stock.valeur_stock ?? 0) < 0
                          ? "#ffcccc"
                          : Number(stock.valeur_stock ?? 0) === 0
                          ? "#ffffcc"
                          : "transparent",
                        color: Number(stock.valeur_stock ?? 0) < 0
                          ? "#cc0000"
                          : "inherit"
                      }}
                    >
                      {formatNombre(stock.valeur_stock)}
                    </td>
                    <td className="text-right">{formatPrix(stock.product?.prix_achat_colis)}</td>
                    <td className="text-right">{formatPrix(stock.product?.prix_vente_colis)}</td>
                    <td className="text-right">
                      {formatPrix(calculerMontant(stock.valeur_stock, stock.product?.prix_achat_colis))}
                    </td>
                    <td className="text-right">
                      {formatPrix(calculerMontant(stock.valeur_stock, stock.product?.prix_vente_colis))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            <div className="brand-totals">
              <div>Achat: {formatPrix(group.totalAchat)} DH | Vente: {formatPrix(group.totalVente)} DH | 
              Diff: <span className={group.diff >= 0 ? 'positive' : 'negative'}>{formatPrix(group.diff)} DH</span></div>
            </div>
          </div>
        ))}

        <h3 className="summary-heading">Récapitulatif global</h3>
        <div className="totals-section">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px', gap: '20px' }}>
            <div style={{
              padding: '10px 20px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              backgroundColor: '#f9f9f9',
              minWidth: '200px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '5px' }}>Total Montant Achat</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{formatPrix(totalMontantAchat)} DH</div>
            </div>

            <div style={{
              padding: '10px 20px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              backgroundColor: '#f9f9f9',
              minWidth: '200px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '5px' }}>Total Montant Vente</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{formatPrix(totalMontantVente)} DH</div>
            </div>

            <div style={{
              padding: '10px 20px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              backgroundColor: totalDiff >= 0 ? '#f0f8f0' : '#fff0f0',
              minWidth: '200px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '5px' }}>Différence</div>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: totalDiff >= 0 ? 'green' : 'red'
              }}>{formatPrix(totalDiff)} DH</div>
            </div>
          </div>

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
        </div>

        <div className="print-footer">
          <p>Système de Gestion d'Inventaire - Rapport généré automatiquement</p>
        </div>
      </div>
    );
  }
);

PrintableStockByBrand.displayName = 'PrintableStockByBrand';
