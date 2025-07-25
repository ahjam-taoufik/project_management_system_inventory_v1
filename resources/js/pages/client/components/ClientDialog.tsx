"use client";

import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from 'react-hot-toast';
import { usePermissions } from '@/hooks/use-permissions';

interface Ville {
  id: number;
  nameVille: string;
}

interface Secteur {
  id: number;
  nameSecteur: string;
}

interface Commercial {
  id: number;
  commercial_code: string;
  commercial_fullName: string;
}

export default function ClientDialog({
  villes,
  commerciaux = []
}: {
  villes: Ville[];
  commerciaux?: Commercial[];
}) {
  const [open, setOpen] = useState(false);
  const [secteurs, setSecteurs] = useState<Secteur[]>([]);
  const [loadingSecteurs, setLoadingSecteurs] = useState(false);
  const { can } = usePermissions();

  const { data, setData, post, errors, reset, processing } = useForm({
    code: "",
    fullName: "",
    idVille: "",
    idSecteur: "",
    idCommercial: "",
    remise_special: "",
    pourcentage: "",
    telephone: "",
  });

  // Charger les secteurs quand la ville change
  useEffect(() => {
    if (data.idVille) {
      setLoadingSecteurs(true);
      fetch(`/api/secteurs-by-ville?ville_id=${data.idVille}`)
        .then(response => response.json())
        .then(responseData => {
          setSecteurs(responseData.secteurs || []);
          // Réinitialiser le secteur sélectionné
          setData('idSecteur', '');
        })
        .catch(error => {
          console.error('Error loading secteurs:', error);
          setSecteurs([]);
        })
        .finally(() => {
          setLoadingSecteurs(false);
        });
    } else {
      setSecteurs([]);
      setData('idSecteur', '');
    }
  }, [data.idVille]);

  // Ne pas afficher le bouton si l'utilisateur n'a pas la permission
  if (!can('clients.create')) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('clients.store'), {
      onSuccess: () => {
        toast.success('Client créé avec succès!');
        reset();
        setOpen(false);
        setSecteurs([]);
      },
      onError: () => {
        console.log(errors);
        toast.error('Échec de la création du client!');
      },
      preserveScroll: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button id="add-client-button" className="h-10 w-full sm:w-auto">
          Ajouter un Client
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-[95vw] max-w-[800px] max-h-[95vh] overflow-y-auto p-4 sm:p-6 sm:max-w-[800px] md:p-7 md:px-8 poppins"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl md:text-[22px] text-center sm:text-left">
            Ajouter un Client
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-center sm:text-left">
            Remplissez le formulaire pour ajouter un nouveau client
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <Label htmlFor="code">Code Client</Label>
              <Input
                id="code"
                type="text"
                placeholder="Entrez le code du client (ex: CL001)"
                className="h-10 sm:h-11"
                value={data.code}
                onChange={(e) => setData('code', e.target.value)}
                required
              />
              {errors.code && (
                <p className="text-xs text-red-500">{errors.code}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="fullName">Nom Complet</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Entrez le nom complet du client"
                className="h-10 sm:h-11"
                value={data.fullName}
                onChange={(e) => setData('fullName', e.target.value)}
                required
              />
              {errors.fullName && (
                <p className="text-xs text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="ville-select">Ville</Label>
              <select
                id="ville-select"
                value={data.idVille}
                onChange={(e) => setData('idVille', e.target.value)}
                className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="" disabled>
                  Sélectionnez une ville...
                </option>
                {villes.map((ville) => (
                  <option key={ville.id} value={ville.id.toString()}>
                    {ville.nameVille}
                  </option>
                ))}
              </select>
              {errors.idVille && (
                <p className="text-xs text-red-500">{errors.idVille}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="secteur-select">Secteur</Label>
              <select
                id="secteur-select"
                value={data.idSecteur}
                onChange={(e) => setData('idSecteur', e.target.value)}
                className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                disabled={loadingSecteurs || !data.idVille}
              >
                <option value="" disabled>
                  {loadingSecteurs ? 'Chargement des secteurs...' : 'Sélectionnez un secteur...'}
                </option>
                {secteurs.map((secteur) => (
                  <option key={secteur.id} value={secteur.id.toString()}>
                    {secteur.nameSecteur}
                  </option>
                ))}
              </select>
              {errors.idSecteur && (
                <p className="text-xs text-red-500">{errors.idSecteur}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="commercial-select">Commercial</Label>
              <select
                id="commercial-select"
                value={data.idCommercial}
                onChange={(e) => setData('idCommercial', e.target.value)}
                className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">
                  Sélectionnez un commercial
                </option>
                {commerciaux.map((commercial) => (
                  <option key={commercial.id} value={commercial.id.toString()}>
                    {commercial.commercial_code} - {commercial.commercial_fullName}
                  </option>
                ))}
              </select>
              {errors.idCommercial && (
                <p className="text-xs text-red-500">{errors.idCommercial}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="remise_special">Remise Spéciale</Label>
              <Input
                id="remise_special"
                type="number"
                step="0.01"
                min="0"
                placeholder="Entrez la remise spéciale"
                className="h-10 sm:h-11"
                value={data.remise_special}
                onChange={(e) => setData('remise_special', e.target.value)}
                required
              />
              {errors.remise_special && (
                <p className="text-xs text-red-500">{errors.remise_special}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="pourcentage">Pourcentage</Label>
              <Input
                id="pourcentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="Entrez le pourcentage"
                className="h-10 sm:h-11"
                value={data.pourcentage}
                onChange={(e) => setData('pourcentage', e.target.value)}
                required
              />
              {errors.pourcentage && (
                <p className="text-xs text-red-500">{errors.pourcentage}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                type="tel"
                placeholder="Entrez le numéro de téléphone"
                className="h-10 sm:h-11"
                value={data.telephone}
                onChange={(e) => setData('telephone', e.target.value)}
              />
              {errors.telephone && (
                <p className="text-xs text-red-500">{errors.telephone}</p>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 md:pt-9">
            <Button
              type="button"
              variant="secondary"
              className="h-11 px-6 sm:px-8 md:px-11 w-full sm:w-auto"
              disabled={processing}
              onClick={() => {
                reset();
                setOpen(false);
                setSecteurs([]);
              }}
            >
              Annuler
            </Button>

            <Button
              type="submit"
              className="h-11 px-6 sm:px-8 md:px-11 w-full sm:w-auto flex items-center justify-center gap-2"
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Enregistrement en cours...</span>
                </>
              ) : (
                "Ajouter"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
