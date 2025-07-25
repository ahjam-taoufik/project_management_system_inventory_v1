import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import type { Livreur } from '@/types';

interface Props {
  livreur: Livreur;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function LivreurEditDialog({ livreur, onClose, open: externalOpen, onOpenChange }: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { data, setData, put, processing, errors, reset } = useForm({ nom: livreur.nom, telephone: livreur.telephone });

  // Utiliser l'état externe si fourni, sinon l'état interne
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  // Mettre à jour les données quand le livreur change
  useEffect(() => {
    setData('nom', livreur.nom);
    setData('telephone', livreur.telephone);
  }, [livreur, setData]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    put(`/livreurs/${livreur.id}`, {
      onSuccess: () => {
        setIsOpen(false);
        if (onClose) onClose();
      },
    });
  }

  function handleDialogChange(isOpen: boolean) {
    setIsOpen(isOpen);
    if (!isOpen && onClose) onClose();
  }

  // Si onOpenChange est fourni, ne pas afficher le trigger
  if (onOpenChange) {
    return (
      <Dialog open={isOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le livreur</DialogTitle>
            <DialogDescription>
              Modifiez les informations du livreur.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Nom du livreur"
              value={data.nom}
              onChange={e => setData('nom', e.target.value)}
              required
            />
            <Input
              placeholder="Téléphone du livreur"
              value={data.telephone}
              onChange={e => setData('telephone', e.target.value)}
              required
            />
            <Button type="submit" disabled={processing}>Enregistrer</Button>
          </form>
          {errors.nom && <div className="text-red-500 text-xs">{errors.nom}</div>}
          {errors.telephone && <div className="text-red-500 text-xs">{errors.telephone}</div>}
        </DialogContent>
      </Dialog>
    );
  }

  // Version avec trigger pour usage autonome
  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">Éditer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le livreur</DialogTitle>
          <DialogDescription>
            Modifiez les informations du livreur.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Nom du livreur"
            value={data.nom}
            onChange={e => setData('nom', e.target.value)}
            required
          />
          <Input
            placeholder="Téléphone du livreur"
            value={data.telephone}
            onChange={e => setData('telephone', e.target.value)}
            required
          />
          <Button type="submit" disabled={processing}>Enregistrer</Button>
        </form>
        {errors.nom && <div className="text-red-500 text-xs">{errors.nom}</div>}
        {errors.telephone && <div className="text-red-500 text-xs">{errors.telephone}</div>}
      </DialogContent>
    </Dialog>
  );
}

export default LivreurEditDialog;
