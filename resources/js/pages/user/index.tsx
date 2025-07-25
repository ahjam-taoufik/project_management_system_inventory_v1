"use client";
import AppTable from '@/pages/user/AppTable';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Users',
        href: '/users',
    },
];

export default function Index() {
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
            <Head title="Utilisateurs" />
            <div className="poppins  p-5 border w-full min-h-screen">
                <Card className='flex flex-col shadow-none p-5'>
                    <AppTable />
                </Card>
            </div>
        </AppLayout>
        </>
    );
}
