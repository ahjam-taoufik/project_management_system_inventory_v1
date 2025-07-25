import AppTable from './AppTable';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Brands',
    href: '/brands',
  },
];

function BrandIndex() {
  return (
    <>
      <Toaster position="top-center" reverseOrder gutter={8} toastOptions={{ className: '', duration: 4000, removeDelay: 1000, style: { border: '1px solid #713200', padding: '16px', color: '#713200' } }} />
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Marques" />
        <div className="poppins p-5 border w-full min-h-screen">
          <Card className="flex flex-col shadow-none p-5">
            <AppTable />
          </Card>
        </div>
      </AppLayout>
    </>
  );
}

export default BrandIndex;
