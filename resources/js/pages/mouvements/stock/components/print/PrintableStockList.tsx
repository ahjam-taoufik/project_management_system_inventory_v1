import React from 'react';
import { Stock } from '../../types';
import { formatPrix, formatNombre, calculerMontant } from '../../utils/formatting';

interface PrintableStockListProps {
  stocks: Stock[];
  title?: string;
  totalMontantAchat?: number;
  totalMontantVente?: number;
  totalDiff?: number;
}

export const PrintableStockList = React.forwardRef<HTMLDivElement, PrintableStockListProps>(
  ({
    stocks,
    title = "Liste des Stocks",
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

    return (
      <div ref={ref} className="print-content">
        <style>
          {`
            @media print {
              .print-content {
                font-family: Arial, sans-serif;
                font-size: 12px;
                color: #000;
                background: white;
                max-width: 100%;
                margin: 0;
                padding: 0;
                position: relative;
                min-height: 100vh;
              }



              body {
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              html {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              img {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
                display: block !important;
                visibility: visible !important;
              }

              @page {
                margin: 10mm;
                size: auto;
                counter-increment: page;
                @bottom-center {
                  content: "Page " counter(page) " / " counter(pages);
                  font-family: Arial, sans-serif;
                  font-size: 11px;
                  color: #666;
                }
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

              .page-number {
                font-size: 12px;
                font-weight: bold;
                text-align: center;
                margin: 10px auto;
                padding: 5px 10px;
                border: 1px solid #ddd;
                border-radius: 15px;
                background-color: #f5f5f5;
                width: auto;
                display: inline-block;
              }

              .page-number::after {
                content: counter(page) " / " attr(data-total);
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
            }

            @media screen {
              .print-content {
                max-width: 210mm;
                margin: 0 auto;
                padding: 20px;
                background: white;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                position: relative;
              }


            }
          `}
        </style>

        <div className="print-header">
          <h1 className="print-title">{title}</h1>
          <p className="print-date">Généré le {currentDate}</p>
          <p className="print-stats">
            Total: {stocks.length} {stocks.length > 1 ? 'produits' : 'produit'}
          </p>
        </div>

        <table className="print-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Référence</th>
              <th>Marque</th>
              <th className="text-right">Valeur Stock</th>
              <th className="text-right">Prix Achat (DH)</th>
              <th className="text-right">Prix Vente (DH)</th>
              <th className="text-right">Montant Achat (DH)</th>
              <th className="text-right">Montant Vente (DH)</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr key={stock.id || index}>
                <td>{stock.product?.product_libelle || ''}</td>
                <td>{stock.product?.product_Ref || '-'}</td>
                <td>{stock.product?.brand?.brand_name || '-'}</td>
                <td className="text-right" style={{
                  backgroundColor: Number(stock.valeur_stock ?? 0) < 0 ? "#ffcccc" : Number(stock.valeur_stock ?? 0) === 0 ? "#ffffcc" : "transparent",
                  color: Number(stock.valeur_stock ?? 0) < 0 ? "#cc0000" : "inherit"
                }}>{formatNombre(stock.valeur_stock)}</td>
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

        <div className="print-footer">
          <p>Système de Gestion d'Inventaire - Rapport généré automatiquement</p>
          {/* La numérotation est gérée par le CSS @page */}
        </div>
      </div>
    );
  }
);

PrintableStockList.displayName = 'PrintableStockList';
