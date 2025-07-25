"use client";
import AppTable from './AppTable';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestion des stocks',
        href: '/stocks',
    },
];

export default function Index() {
    // Utilisation immédiate du rendu plutôt qu'un état de chargement inutile
    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={true}
                gutter={8}
                toastOptions={{
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
                <Head title="Stocks" />
                <div className="poppins p-5 border w-full min-h-screen">
                    <Card className='flex flex-col shadow-none p-5'>
                        <AppTable />
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
