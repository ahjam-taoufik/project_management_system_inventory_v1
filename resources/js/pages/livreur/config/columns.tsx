import type { Livreur } from '@/types';

export function createColumns(): Array<{ id: keyof Livreur; header: string; cell?: (livreur: Livreur) => React.ReactNode }> {
  return [
    {
      id: 'nom',
      header: 'Nom',
      cell: (livreur: Livreur) => livreur.nom,
    },
    {
      id: 'telephone',
      header: 'Téléphone',
      cell: (livreur: Livreur) => livreur.telephone,
    },
  ];
}
