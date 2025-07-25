import React from 'react';
import type { Client } from '../../config/columns';
import { formatNumericValue } from './utils';

interface PrintableClientListProps {
  clients: Client[];
  title?: string;
}

export const PrintableClientList = React.forwardRef<HTMLDivElement, PrintableClientListProps>(
  ({ clients, title = "Liste des Clients" }, ref) => {
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
                padding: 20px;
              }

              .print-header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #333;
                padding-bottom: 15px;
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

              .text-right {
                text-align: right;
              }

              .text-center {
                text-align: center;
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
          <h1 className="print-title">{title}</h1>
          <p className="print-date">Généré le {currentDate}</p>
          <p className="print-stats">
            Total: {clients.length} {clients.length > 1 ? 'clients' : 'client'}
          </p>
        </div>

        <table className="print-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Nom Complet</th>
              <th>Téléphone</th>
              <th>Ville</th>
              <th>Secteur</th>
              <th>Commercial</th>
              <th className="text-right">Remise Spéciale</th>
              <th className="text-right">Pourcentage</th>
              <th className="text-center">Date Création</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr key={client.id || index}>
                <td>{client.code}</td>
                <td>{client.fullName}</td>
                <td>{client.telephone}</td>
                <td>{client.ville?.nameVille || 'Inconnue'}</td>
                <td>{client.secteur?.nameSecteur || 'Inconnu'}</td>
                <td>{client.commercial?.commercial_fullName || 'Non assigné'}</td>
                <td className="text-right">{formatNumericValue(client.remise_special)}%</td>
                <td className="text-right">{formatNumericValue(client.pourcentage)}%</td>
                <td className="text-center">
                  {new Date(client.created_at).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="print-footer">
          <p>Système de Gestion d'Inventaire - Rapport généré automatiquement</p>
          <p>Page 1 sur 1</p>
        </div>
      </div>
    );
  }
);

PrintableClientList.displayName = 'PrintableClientList';
