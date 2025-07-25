"use client";
import AppTable from '@/pages/commercial/AppTable';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Commerciaux',
        href: '/commerciaux',
    },
];

export default function Index() {
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {
        setIsLoad(true);
    }, []);

    if (!isLoad) return null;

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
                <Head title="Commerciaux" />
                <div className="poppins p-5 border w-full min-h-screen">
                    <Card className='flex flex-col shadow-none p-5'>
                        <AppTable />
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
