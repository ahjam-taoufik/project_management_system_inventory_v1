"use client"
import React from "react";
import { User, Role } from "@/types";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface UserEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  roles: Role[];
}

export default function UserEditDialog({
  isOpen,
  onOpenChange,
  user,
  roles
}: UserEditDialogProps) {
  const { put, data, setData, processing, reset, errors } = useForm({
    name: user.name || "",
    email: user.email || "",
    password: "",
    password_confirmation: "",
    roles: user.roles ? user.roles.map(role => role.name) : [] as string[],
  });

  const handleRoleChange = (roleName: string, checked: boolean) => {
    if (checked) {
      setData('roles', [...data.roles, roleName]);
    } else {
      setData('roles', data.roles.filter(r => r !== roleName));
    }
  };

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();

    put(route('users.update', { user: user.id }), {
      onSuccess: () => {
        toast.success('Utilisateur modifié avec succès');
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
        name: user.name || "",
        email: user.email || "",
        password: "",
        password_confirmation: "",
        roles: user.roles ? user.roles.map(role => role.name) : [],
      });
    }
  }, [isOpen, user, setData]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'utilisateur ci-dessous. Laissez le mot de passe vide si vous ne voulez pas le changer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                name="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 col-span-4">{errors.name}</p>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 col-span-4">{errors.email}</p>
            )}

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Rôles
              </Label>
              <div className="col-span-3">
                {roles.length > 0 ? (
                  <div className="max-h-32 overflow-y-auto p-3 border rounded-md space-y-2">
                    {roles.map((role) => (
                      <div key={role.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-role-${role.id}`}
                          checked={data.roles.includes(role.name)}
                          onCheckedChange={(checked) =>
                            handleRoleChange(role.name, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`edit-role-${role.id}`}
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
              </div>
            </div>
            {errors.roles && (
              <p className="text-xs text-red-500 col-span-4">{errors.roles}</p>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Mot de passe
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="col-span-3"
                placeholder="Laisser vide pour ne pas changer"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 col-span-4">{errors.password}</p>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password_confirmation" className="text-right">
                Confirmer
              </Label>
              <Input
                id="password_confirmation"
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                className="col-span-3"
                placeholder="Confirmer le mot de passe"
              />
            </div>
            {errors.password_confirmation && (
              <p className="text-xs text-red-500 col-span-4">{errors.password_confirmation}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={processing}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Modification...' : 'Modifier'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
