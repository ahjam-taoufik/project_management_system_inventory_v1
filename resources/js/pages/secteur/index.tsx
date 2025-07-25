
"use client";
import AppTable from '@/pages/secteur/AppTable';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
// import { ReactNode, useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Secteurs',
        href: '/secteurs',
    },
];
// Add this type definition if Ville is not imported from elsewhere
type Ville = {
    // Define the properties of Ville as needed, for example:
    id: number;
    nameVille: string;
    // Add other properties here
};

export default function Index( { villes }: { villes: Ville[] }) {


      const [isLoad, setIsLoad] = useState(false);

      useEffect(() => {
        setIsLoad(true);
      }, []);
      if (!isLoad)return null;



    return (
        <>
         <Toaster
            position="top-center"
            reverseOrder={true}
            gutter={8}
            toastOptions={{
                // Define default options
                className: '',
                duration: 4000,
                removeDelay: 1000,
                style: {
                    border: '1px solid #713200',
                    padding: '16px',
                    color: '#713200',
                },

            }}
            />
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Secteurs" />
            {/* <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto"> */}
            <div className="poppins  p-5 border w-full min-h-screen">
                <Card className='flex flex-col shadow-none p-5'>
                    <AppTable villes={villes} />
                </Card>
            </div>
        </AppLayout>
        </>
    );
}
