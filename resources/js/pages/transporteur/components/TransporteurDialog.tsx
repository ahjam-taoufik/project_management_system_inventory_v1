import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';

interface TransporteurDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransporteurDialog({ open, onOpenChange }: TransporteurDialogProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    conducteur_name: '',
    vehicule_matricule: '',
    conducteur_cin: '',
    conducteur_telephone: '',
    vehicule_type: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('transporteurs.store'), {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    onOpenChange(newOpen);
  };



  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal={false}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Ajouter un transporteur</DialogTitle>
          <DialogDescription>
            Remplissez les informations du transporteur et de son véhicule.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="conducteur_name">Nom du conducteur</Label>
            <Input
              id="conducteur_name"
              value={data.conducteur_name}
              onChange={(e) => setData('conducteur_name', e.target.value)}
              placeholder="Nom du conducteur"
            />
            <InputError message={errors.conducteur_name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicule_matricule">Matricule du véhicule</Label>
            <Input
              id="vehicule_matricule"
              value={data.vehicule_matricule}
              onChange={(e) => setData('vehicule_matricule', e.target.value)}
              placeholder="Matricule du véhicule"
            />
            <InputError message={errors.vehicule_matricule} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="conducteur_cin">CIN du conducteur</Label>
            <Input
              id="conducteur_cin"
              value={data.conducteur_cin}
              onChange={(e) => setData('conducteur_cin', e.target.value)}
              placeholder="CIN du conducteur"
            />
            <InputError message={errors.conducteur_cin} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="conducteur_telephone">Téléphone du conducteur</Label>
            <Input
              id="conducteur_telephone"
              value={data.conducteur_telephone}
              onChange={(e) => setData('conducteur_telephone', e.target.value)}
              placeholder="Téléphone du conducteur"
            />
            <InputError message={errors.conducteur_telephone} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicule_type">Type de véhicule</Label>
                        <Select value={data.vehicule_type} onValueChange={(value) => setData('vehicule_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Camion">Camion</SelectItem>
                <SelectItem value="Fourgon">Fourgon</SelectItem>
                <SelectItem value="Pickup">Pickup</SelectItem>
                <SelectItem value="Remorque">Remorque</SelectItem>
              </SelectContent>
            </Select>
            <InputError message={errors.vehicule_type} />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
