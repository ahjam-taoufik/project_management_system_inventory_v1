"use client";

import { useState } from 'react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import toast from 'react-hot-toast';
import type { Role } from "@/types";

interface UserDialogProps {
  roles: Role[];
}

export default function UserDialog({ roles }: UserDialogProps) {
  const [open, setOpen] = useState(false);
  const { data, setData, post, errors, reset, processing } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    roles: [] as string[],
  });

  const handleRoleChange = (roleName: string, checked: boolean) => {
    if (checked) {
      setData('roles', [...data.roles, roleName]);
    } else {
      setData('roles', data.roles.filter(r => r !== roleName));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('users.store'), {
      onSuccess: () => {
        toast.success('Utilisateur créé avec succès!');
        reset();
        setOpen(false);
      },
      onError: () => {
         console.log(errors);
        toast.error('Erreur lors de la création!');
      },
      preserveScroll: true,
    });
  };

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
         <Button id="add-user-button" className="h-10 w-full sm:w-auto">
        Ajouter un Utilisateur
    </Button>
      </DialogTrigger>
      <DialogContent
        className="w-[95vw] max-w-[800px] max-h-[95vh] overflow-y-auto p-4 sm:p-6 sm:max-w-[800px] md:p-7 md:px-8 poppins"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl md:text-[22px] text-center sm:text-left">
            Ajouter un Utilisateur
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-center sm:text-left">
            Remplissez le formulaire pour ajouter un nouvel utilisateur
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Entrez le nom complet"
                className="h-10 sm:h-11"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="utilisateur@example.com"
                className="h-10 sm:h-11"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label>Rôles (optionnel)</Label>
              {roles.length > 0 ? (
                <div className="max-h-32 overflow-y-auto p-3 border rounded-md space-y-2">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={data.roles.includes(role.name)}
                        onCheckedChange={(checked) =>
                          handleRoleChange(role.name, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`role-${role.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {role.name}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun rôle disponible
                </p>
              )}
              {errors.roles && (
                <p className="text-xs text-red-500">{errors.roles}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 8 caractères avec majuscules, minuscules, chiffres et symboles"
                className="h-10 sm:h-11"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
              <Input
                id="password_confirmation"
                type="password"
                placeholder="Répétez le mot de passe"
                className="h-10 sm:h-11"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
              />
              {errors.password_confirmation && (
                <p className="text-xs text-red-500">{errors.password_confirmation}</p>
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
                  <span>Création en cours...</span>
                </>
              ) : (
                "Ajouter"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
