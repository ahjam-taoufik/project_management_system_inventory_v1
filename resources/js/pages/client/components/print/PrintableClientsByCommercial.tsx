import React from 'react';
import type { Client } from '../../config/columns';
import { formatNumericValue } from './utils';

interface PrintableClientsByCommercialProps {
  clients: Client[];
  commerciaux: Array<{
    id: number;
    commercial_code: string;
    commercial_fullName: string;
  }>;
}

export const PrintableClientsByCommercial = React.forwardRef<HTMLDivElement, PrintableClientsByCommercialProps>(
  ({ clients, commerciaux }, ref) => {
    const currentDate = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

        // Grouper les clients par commercial
    const clientsByCommercial = React.useMemo(() => {
      const grouped = new Map<string, { commercial: { id: number | string, commercial_code: string, commercial_fullName: string }, clients: Client[] }>();

      // Initialize with all commercials
      commerciaux.forEach(commercial => {
        grouped.set(commercial.id.toString(), {
          commercial,
          clients: []
        });
      });

      // Add an entry for clients without commercial
      grouped.set('unassigned', {
        commercial: {
          id: 'unassigned',
          commercial_code: 'N/A',
          commercial_fullName: 'Non assigné'
        },
        clients: []
      });

      // Group clients by normalizing IDs
      clients.forEach(client => {
        // Normaliser l'ID commercial en string pour la comparaison
        const commercialId = client.idCommercial ? client.idCommercial.toString() : 'unassigned';
        const group = grouped.get(commercialId);

        if (group) {
          group.clients.push(client);
        }
      });

      // Convert to array and filter out empty groups
      return Array.from(grouped.values()).filter(group => group.clients.length > 0);
    }, [clients, commerciaux]);

    const totalClients = clients.length;

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
                font-size: 16px;
                color: #666;
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

              .commercial-section {
                margin-bottom: 40px;
                page-break-inside: avoid;
              }

              .commercial-header {
                background-color: #f0f0f0;
                padding: 12px;
                border-left: 4px solid #333;
                margin-bottom: 15px;
              }

              .commercial-name {
                font-size: 16px;
                font-weight: bold;
                color: #333;
                margin-bottom: 5px;
              }

              .commercial-code {
                font-size: 12px;
                color: #666;
                margin-bottom: 5px;
              }

              .commercial-stats {
                font-size: 11px;
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
                padding: 6px;
                text-align: left;
              }

              .print-table th {
                background-color: #f8f8f8;
                font-weight: bold;
                font-size: 11px;
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
          <p className="print-subtitle">Classement par Commercial</p>
          <p className="print-date">Généré le {currentDate}</p>
          <p className="print-stats">
            Total: {totalClients} {totalClients > 1 ? 'clients' : 'client'} |
            {clientsByCommercial.length} {clientsByCommercial.length > 1 ? 'commerciaux' : 'commercial'}
          </p>
        </div>

        {clientsByCommercial.map((group) => (
          <div key={group.commercial.id} className="commercial-section">
            <div className="commercial-header">
              <div className="commercial-name">{group.commercial.commercial_fullName}</div>
              <div className="commercial-code">Code: {group.commercial.commercial_code}</div>
              <div className="commercial-stats">
                {group.clients.length} {group.clients.length > 1 ? 'clients' : 'client'} assigné(s)
              </div>
            </div>

            {group.clients.length > 0 ? (
              <table className="print-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Nom Complet</th>
                    <th>Téléphone</th>
                    <th>Ville</th>
                    <th>Secteur</th>
                    <th className="text-right">Remise</th>
                    <th className="text-right">Pourcentage</th>
                    <th className="text-center">Date Création</th>
                  </tr>
                </thead>
                <tbody>
                  {group.clients.map((client, clientIndex) => (
                    <tr key={client.id || clientIndex}>
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
              <div className="no-clients">Aucun client assigné</div>
            )}
          </div>
        ))}

        <div className="print-footer">
          <p>Système de Gestion d'Inventaire - Rapport généré automatiquement</p>
          <p>Document confidentiel - Usage interne uniquement</p>
        </div>
      </div>
    );
  }
);

PrintableClientsByCommercial.displayName = 'PrintableClientsByCommercial';
