"use client";

import React, { useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Client } from "@/pages/client/config/columns";

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

interface ClientEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
}

export default function ClientEditDialog({
  isOpen,
  onOpenChange,
  client
}: ClientEditDialogProps) {
  const { props: { villes, commerciaux } } = usePage();
  const villesArray = villes as Ville[];
  const commerciauxArray = (commerciaux as Commercial[]) || [];
  const [secteurs, setSecteurs] = useState<Secteur[]>([]);
  const [loadingSecteurs, setLoadingSecteurs] = useState(false);

  const { put, data, setData, processing, reset, errors } = useForm({
    code: client.code || "",
    fullName: client.fullName || "",
    idVille: client.idVille || "",
    idSecteur: client.idSecteur || "",
    idCommercial: client.idCommercial || "",
    remise_special: client.remise_special || "",
    pourcentage: client.pourcentage || "",
    telephone: client.telephone || "",
  });

  // Charger les secteurs quand la ville change
  useEffect(() => {
    if (data.idVille) {
      setLoadingSecteurs(true);
      fetch(`/api/secteurs-by-ville?ville_id=${data.idVille}`)
        .then(response => response.json())
        .then(responseData => {
          setSecteurs(responseData.secteurs || []);
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
    }
  }, [data.idVille]);

  // Charger les secteurs initiaux quand le dialog s'ouvre
  useEffect(() => {
    if (isOpen && client.idVille) {
      setLoadingSecteurs(true);
      fetch(`/api/secteurs-by-ville?ville_id=${client.idVille}`)
        .then(response => response.json())
        .then(responseData => {
          setSecteurs(responseData.secteurs || []);
        })
        .catch(error => {
          console.error('Error loading secteurs:', error);
          setSecteurs([]);
        })
        .finally(() => {
          setLoadingSecteurs(false);
        });
    }
  }, [isOpen, client.idVille]);

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();

    put(route('clients.update', { client: client.id }), {
      onSuccess: () => {
        toast.success('Client modifié avec succès');
        onOpenChange(false);
        reset();
      },
      onError: (errors) => {
        toast.error('Erreur lors de la modification');
        console.error(errors);
      },
      preserveScroll: true,
    });
  }

  // Réinitialiser les données quand le dialog s'ouvre
  React.useEffect(() => {
    if (isOpen) {
      setData({
        code: client.code || "",
        fullName: client.fullName || "",
        idVille: client.idVille || "",
        idSecteur: client.idSecteur || "",
        idCommercial: client.idCommercial || "",
        remise_special: client.remise_special || "",
        pourcentage: client.pourcentage || "",
        telephone: client.telephone || "",
      });
    }
  }, [isOpen, client, setData]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier Client</DialogTitle>
          <DialogDescription>
            Modifiez les informations du client ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                value={data.code}
                onChange={(e) => setData('code', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            {errors.code && (
              <p className="text-xs text-red-500 col-span-4">{errors.code}</p>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Nom Complet
              </Label>
              <Input
                id="fullName"
                value={data.fullName}
                onChange={(e) => setData('fullName', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            {errors.fullName && (
              <p className="text-xs text-red-500 col-span-4">{errors.fullName}</p>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="idVille" className="text-right">
                Ville
              </Label>
              <select
                id="idVille"
                value={data.idVille}
                onChange={(e) => setData('idVille', e.target.value)}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="" disabled>
                  Sélectionnez une ville...
                </option>
                {villesArray.map((ville) => (
                  <option key={ville.id} value={ville.id.toString()}>
                    {ville.nameVille}
                  </option>
                ))}
              </select>
            </div>
            {errors.idVille && (
              <p className="text-xs text-red-500 col-span-4">{errors.idVille}</p>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="idSecteur" className="text-right">
                Secteur
              </Label>
              <select
                id="idSecteur"
                value={data.idSecteur}
                onChange={(e) => setData('idSecteur', e.target.value)}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                disabled={loadingSecteurs || !data.idVille}
              >
                <option value="" disabled>
                  {loadingSecteurs ? 'Chargement...' : 'Sélectionnez un secteur...'}
                </option>
                {secteurs.map((secteur) => (
                  <option key={secteur.id} value={secteur.id.toString()}>
                    {secteur.nameSecteur}
                  </option>
                ))}
              </select>
            </div>
            {errors.idSecteur && (
              <p className="text-xs text-red-500 col-span-4">{errors.idSecteur}</p>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="idCommercial" className="text-right">
                Commercial
              </Label>
              <select
                id="idCommercial"
                value={data.idCommercial}
                required
                onChange={(e) => setData('idCommercial', e.target.value)}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  Sélectionnez un commercial
                </option>
                {commerciauxArray.map((commercial) => (
                  <option key={commercial.id} value={commercial.id.toString()}>
                    {commercial.commercial_code} - {commercial.commercial_fullName}
                  </option>
                ))}
              </select>
            </div>
            {errors.idCommercial && (
              <p className="text-xs text-red-500 col-span-4">{errors.idCommercial}</p>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="remise_special" className="text-right">
                Remise Spéciale (%)
              </Label>
              <Input
                id="remise_special"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={data.remise_special}
                onChange={(e) => setData('remise_special', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            {errors.remise_special && (
              <p className="text-xs text-red-500 col-span-4">{errors.remise_special}</p>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pourcentage" className="text-right">
                Pourcentage
              </Label>
              <Input
                id="pourcentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={data.pourcentage}
                onChange={(e) => setData('pourcentage', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            {errors.pourcentage && (
              <p className="text-xs text-red-500 col-span-4">{errors.pourcentage}</p>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telephone" className="text-right">
                Téléphone
              </Label>
              <Input
                id="telephone"
                type="tel"
                value={data.telephone}
                onChange={(e) => setData('telephone', e.target.value)}
                className="col-span-3"
              />
            </div>
            {errors.telephone && (
              <p className="text-xs text-red-500 col-span-4">{errors.telephone}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={processing}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                "Mettre à jour"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
