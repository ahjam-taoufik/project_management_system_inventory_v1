import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Printer, ChevronDown, FileText, Users, User } from 'lucide-react';
import { PrintableClientList } from './PrintableClientList';
import { PrintableClientsByCommercial } from './PrintableClientsByCommercial';
import { PrintableClientsBySpecificCommercial } from './PrintableClientsBySpecificCommercial';
import { CommercialSelectionDialog } from './CommercialSelectionDialog';
import type { Client } from '../../config/columns';

interface PrintButtonsProps {
  clients: Client[];
  commerciaux: Array<{
    id: number;
    commercial_code: string;
    commercial_fullName: string;
  }>;
}

export function PrintButtons({ clients, commerciaux }: PrintButtonsProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [selectedCommercial, setSelectedCommercial] = useState<{
    id: number;
    commercial_code: string;
    commercial_fullName: string;
  } | null>(null);

  // Refs for the printable components
  const clientListRef = useRef<HTMLDivElement>(null);
  const clientsByCommercialRef = useRef<HTMLDivElement>(null);
  const clientsBySpecificCommercialRef = useRef<HTMLDivElement>(null);

  // Handler for printing all clients
  const handlePrintAllClients = useReactToPrint({
    contentRef: clientListRef,
    documentTitle: `Liste_Clients_${new Date().toISOString().split('T')[0]}`,
    onAfterPrint: () => {
      setIsPrinting(false);
    },
    onPrintError: (error) => {
      setIsPrinting(false);
      console.error('Print error:', error);
    },
  });

  // Handler for printing clients by commercial
  const handlePrintByCommercial = useReactToPrint({
    contentRef: clientsByCommercialRef,
    documentTitle: `Clients_Par_Commercial_${new Date().toISOString().split('T')[0]}`,
    onAfterPrint: () => {
      setIsPrinting(false);
    },
    onPrintError: (error) => {
      setIsPrinting(false);
      console.error('Print error:', error);
    },
  });

  // Handler for printing clients by specific commercial
  const handlePrintBySpecificCommercial = useReactToPrint({
    contentRef: clientsBySpecificCommercialRef,
    documentTitle: `Clients_${selectedCommercial?.commercial_code}_${new Date().toISOString().split('T')[0]}`,
    onAfterPrint: () => {
      setIsPrinting(false);
      setSelectedCommercial(null); // Reset selection after printing
    },
    onPrintError: (error) => {
      setIsPrinting(false);
      setSelectedCommercial(null);
      console.error('Print error:', error);
    },
  });

  // Handle commercial selection and trigger print
  function handleCommercialSelection(commercial: {
    id: number;
    commercial_code: string;
    commercial_fullName: string;
  }) {
    setSelectedCommercial(commercial);
    setIsPrinting(true);
    // Use setTimeout to ensure the component is rendered before printing
    setTimeout(() => {
      handlePrintBySpecificCommercial();
    }, 100);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled={isPrinting || clients.length === 0}
          >
            <Printer className="h-4 w-4" />
            {isPrinting ? 'Impression...' : 'Imprimer'}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuItem
            onClick={() => {
              setIsPrinting(true);
              handlePrintAllClients();
            }}
            disabled={isPrinting || clients.length === 0}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Liste complète des clients
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsPrinting(true);
              handlePrintByCommercial();
            }}
            disabled={isPrinting || clients.length === 0}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Tous les clients par commercial
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <CommercialSelectionDialog
              commerciaux={commerciaux}
              onCommercialSelected={handleCommercialSelection}
              disabled={isPrinting || clients.length === 0 || commerciaux.length === 0}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

            {/* Hidden printable components */}
      <div style={{ display: 'none' }}>
        <PrintableClientList
          ref={clientListRef}
          clients={clients}
          title="Liste Complète des Clients"
        />
        <PrintableClientsByCommercial
          ref={clientsByCommercialRef}
          clients={clients}
          commerciaux={commerciaux}
        />
        {selectedCommercial && (
          <PrintableClientsBySpecificCommercial
            ref={clientsBySpecificCommercialRef}
            clients={clients}
            commercial={selectedCommercial}
          />
        )}
      </div>
    </>
  );
}
