import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface Props {
  triggerId?: string;
}

function LivreurDialog({ triggerId }: Props) {
  const [open, setOpen] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({ nom: '', telephone: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    post('/livreurs', {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button id={triggerId} size="sm">Ajouter un livreur</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un livreur</DialogTitle>
          <DialogDescription>
            Remplissez les informations du livreur à ajouter.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="nom"
            name="nom"
            placeholder="Nom du livreur"
            value={data.nom}
            onChange={e => setData('nom', e.target.value)}
            required
          />
          <Input
            id="telephone"
            name="telephone"
            placeholder="Téléphone du livreur"
            value={data.telephone}
            onChange={e => setData('telephone', e.target.value)}
            required
          />
          <Button type="submit" disabled={processing}>Ajouter</Button>
        </form>
        {errors.nom && <div className="text-red-500 text-xs">{errors.nom}</div>}
        {errors.telephone && <div className="text-red-500 text-xs">{errors.telephone}</div>}
      </DialogContent>
    </Dialog>
  );
}

export default LivreurDialog;
