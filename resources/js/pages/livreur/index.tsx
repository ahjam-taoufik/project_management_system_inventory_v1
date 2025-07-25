import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';
import AppTable from './components/AppTable';
import { Card } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Gestion des livreurs', href: '/livreurs' },
];

export default function Index() {
    const { props } = usePage();
    const livreurs = props.livreurs as any;

    if (!livreurs || !livreurs.data || !livreurs.meta || !livreurs.links) {
        console.error('Structure inattendue de props.livreurs:', livreurs);
        return <div className="p-4 text-center text-red-500">Erreur : Structure inattendue des données livreurs.<br/>Vérifiez le contrôleur backend et la pagination.</div>;
    }

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
                <Head title="Livreurs" />
                <div className="poppins p-5 border w-full min-h-screen">
                    <Card className="flex flex-col shadow-none p-5">
                        <AppTable
                            livreurs={livreurs.data}
                            meta={livreurs.meta}
                            links={livreurs.links}
                        />
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
