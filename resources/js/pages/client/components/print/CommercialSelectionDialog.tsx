import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Users, Printer } from 'lucide-react';

interface CommercialSelectionDialogProps {
  commerciaux: Array<{
    id: number;
    commercial_code: string;
    commercial_fullName: string;
  }>;
  onCommercialSelected: (commercial: {
    id: number;
    commercial_code: string;
    commercial_fullName: string;
  }) => void;
  disabled?: boolean;
}

export function CommercialSelectionDialog({
  commerciaux,
  onCommercialSelected,
  disabled = false
}: CommercialSelectionDialogProps) {
  const [selectedCommercialId, setSelectedCommercialId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  function handlePrint() {
    const selectedCommercial = commerciaux.find(
      c => c.id.toString() === selectedCommercialId
    );

    if (selectedCommercial) {
      onCommercialSelected(selectedCommercial);
      setIsOpen(false);
      setSelectedCommercialId(''); // Reset selection
    }
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) {
      setSelectedCommercialId(''); // Reset selection when dialog closes
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div
          className="w-full flex items-center justify-start gap-2 px-2 py-1.5 h-auto cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm text-sm"
          style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}
        >
          <Users className="h-4 w-4" />
          Client d'un commercial spécifique
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Impression par Commercial
          </DialogTitle>
          <DialogDescription>
            Sélectionnez le commercial dont vous souhaitez imprimer la liste des clients.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="commercial-select" className="text-sm font-medium">
              Commercial :
            </label>
            <Select
              value={selectedCommercialId}
              onValueChange={setSelectedCommercialId}
            >
              <SelectTrigger id="commercial-select">
                <SelectValue placeholder="Choisir un commercial..." />
              </SelectTrigger>
              <SelectContent>
                {commerciaux.map((commercial) => (
                  <SelectItem
                    key={commercial.id}
                    value={commercial.id.toString()}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{commercial.commercial_fullName}</span>
                      <span className="text-sm text-muted-foreground">
                        Code: {commercial.commercial_code}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handlePrint}
              disabled={!selectedCommercialId}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Imprimer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
