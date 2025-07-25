import React from 'react';
import type { Client } from '../../config/columns';
import { formatNumericValue } from './utils';

interface PrintableClientsBySpecificCommercialProps {
  clients: Client[];
  commercial: {
    id: number;
    commercial_code: string;
    commercial_fullName: string;
  };
}

export const PrintableClientsBySpecificCommercial = React.forwardRef<HTMLDivElement, PrintableClientsBySpecificCommercialProps>(
  ({ clients, commercial }, ref) => {
    const currentDate = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

        // Filtrer et trier les clients pour ce commercial spécifique
    const filteredClients = React.useMemo(() => {
      const targetCommercialId = commercial.id.toString();

      return clients
        .filter(client => {
          // Normaliser les IDs pour la comparaison
          const clientCommercialId = client.idCommercial ? client.idCommercial.toString() : null;
          return clientCommercialId === targetCommercialId;
        })
        .sort((a, b) => {
          // Trier par ville (ASC)
          const villeA = a.ville?.nameVille || '';
          const villeB = b.ville?.nameVille || '';
          return villeA.localeCompare(villeB, 'fr', { numeric: true });
        });
    }, [clients, commercial.id]);

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

              .print-subtitle {
                font-size: 18px;
                color: #555;
                margin-bottom: 10px;
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

              .commercial-info {
                background-color: #f5f5f5;
                padding: 15px;
                border-left: 4px solid #333;
                margin-bottom: 20px;
              }

              .commercial-name {
                font-size: 18px;
                font-weight: bold;
                color: #333;
                margin-bottom: 5px;
              }

              .commercial-code {
                font-size: 14px;
                color: #666;
                margin-bottom: 5px;
              }

              .commercial-stats {
                font-size: 12px;
                color: #888;
              }

              .print-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                font-size: 11px;
              }

              .print-table th,
              .print-table td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }

              .print-table th {
                background-color: #f8f8f8;
                font-weight: bold;
                font-size: 12px;
              }

              .print-table tbody tr:nth-child(even) {
                background-color: #fafafa;
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

              .no-clients {
                font-style: italic;
                color: #999;
                text-align: center;
                padding: 20px;
                background-color: #f9f9f9;
                border: 1px dashed #ccc;
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
          <h1 className="print-title">Rapport des Clients</h1>
          <p className="print-subtitle">Par Commercial</p>
          <p className="print-date">Généré le {currentDate}</p>
          <p className="print-stats">
            {filteredClients.length} {filteredClients.length > 1 ? 'clients' : 'client'} assigné(s)
          </p>
        </div>

        <div className="commercial-info">
          <div className="commercial-name">{commercial.commercial_fullName}</div>
          <div className="commercial-code">Code Commercial: {commercial.commercial_code}</div>
          <div className="commercial-stats">
            Clients assignés: {filteredClients.length}
          </div>
        </div>

        {filteredClients.length > 0 ? (
          <table className="print-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Nom Complet</th>
                <th>Téléphone</th>
                <th>Ville</th>
                <th>Secteur</th>
                <th className="text-right">Remise Spéciale</th>
                <th className="text-right">Pourcentage</th>
                <th className="text-center">Date Création</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client, index) => (
                <tr key={client.id || index}>
                  <td>{client.code}</td>
                  <td>{client.fullName}</td>
                  <td>{client.telephone}</td>
                  <td>{client.ville?.nameVille || 'Inconnue'}</td>
                  <td>{client.secteur?.nameSecteur || 'Inconnu'}</td>
                  <td className="text-right">{formatNumericValue(client.remise_special)}%</td>
                  <td className="text-right">{formatNumericValue(client.pourcentage)}%</td>
                  <td className="text-center">
                    {new Date(client.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-clients">
            <h3>Aucun client assigné</h3>
            <p>Ce commercial n'a actuellement aucun client assigné.</p>
          </div>
        )}

        <div className="print-footer">
          <p>Système de Gestion d'Inventaire - Rapport généré automatiquement</p>
          <p>Commercial: {commercial.commercial_fullName} | Code: {commercial.commercial_code}</p>
        </div>
      </div>
    );
  }
);

PrintableClientsBySpecificCommercial.displayName = 'PrintableClientsBySpecificCommercial';
