"use client";

import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, usePage } from "@inertiajs/react";
import { Sortie, Commercial, Client } from "../types";
import toast from "react-hot-toast";

interface SortieEditDialogProps {
  sortie: Sortie;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SortieEditFormData {
  numero_bl: string;
  commercial_id: string;
  client_id: string;
  date_bl: string;
  livreur: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Index signature to satisfy FormDataType constraint
}

export default function SortieEditDialog({ sortie, open, onOpenChange }: SortieEditDialogProps) {
  const { props: {  commerciaux, clients } } = usePage();

  const commerciauxArray = commerciaux as Commercial[];
  const clientsArray = clients as Client[];

  const { data, setData, put, processing, errors } = useForm<SortieEditFormData>({
    numero_bl: sortie.numero_bl,
    commercial_id: sortie.commercial.id.toString(),
    client_id: sortie.client.id.toString(),
    date_bl: sortie.date_bl.split('T')[0], // Format date for input
    livreur: sortie.livreur,
  });

  useEffect(() => {
    if (open) {
      setData({
        numero_bl: sortie.numero_bl,
        commercial_id: sortie.commercial.id.toString(),
        client_id: sortie.client.id.toString(),
        date_bl: sortie.date_bl.split('T')[0],
        livreur: sortie.livreur,
      });
    }
  }, [open, sortie]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    put(route('sorties.update', sortie.id), {
      onSuccess: () => {
        toast.success("Sortie modifiée avec succès");
        onOpenChange(false);
      },
      onError: (errors) => {
        console.error(errors);
        toast.error("Erreur lors de la modification de la sortie");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier la sortie</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la sortie #{sortie.numero_bl}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero_bl">Numéro BL</Label>
              <Input
                id="numero_bl"
                value={data.numero_bl}
                onChange={(e) => setData("numero_bl", e.target.value)}
                placeholder="Numéro du bon de livraison"
                required
              />
              {errors.numero_bl && (
                <p className="text-sm text-red-500">{errors.numero_bl}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_bl">Date BL</Label>
              <Input
                id="date_bl"
                type="date"
                value={data.date_bl}
                onChange={(e) => setData("date_bl", e.target.value)}
                required
              />
              {errors.date_bl && (
                <p className="text-sm text-red-500">{errors.date_bl}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="commercial_id">Commercial</Label>
              <Select
                value={data.commercial_id}
                onValueChange={(value) => setData("commercial_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un commercial" />
                </SelectTrigger>
                <SelectContent>
                  {commerciauxArray.map((commercial) => (
                    <SelectItem key={commercial.id} value={commercial.id.toString()}>
                      {commercial.nom} ({commercial.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.commercial_id && (
                <p className="text-sm text-red-500">{errors.commercial_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_id">Client</Label>
              <Select
                value={data.client_id}
                onValueChange={(value) => setData("client_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clientsArray.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.nom} ({client.code}) - {typeof client.ville === 'string' ? client.ville : client.ville?.nameVille || ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.client_id && (
                <p className="text-sm text-red-500">{errors.client_id}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="livreur">Livreur</Label>
              <Input
                id="livreur"
                value={data.livreur}
                onChange={(e) => setData("livreur", e.target.value)}
                placeholder="Nom du livreur"
                required
              />
              {errors.livreur && (
                <p className="text-sm text-red-500">{errors.livreur}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Produits associés</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {sortie.products.map((product, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{product.product.product_libelle}</span>
                    <span className="text-sm text-gray-500 ml-2">({product.ref_produit})</span>
                  </div>
                  <div className="text-right text-sm">
                    <div>Qté: {product.quantite_produit}</div>
                    <div>Prix: {product.prix_vente_produit} DH</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Note: Pour modifier les produits, veuillez créer une nouvelle sortie.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? "Modification..." : "Modifier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
