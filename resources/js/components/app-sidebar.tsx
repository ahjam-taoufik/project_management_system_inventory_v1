import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { type MainNavItem, NavItem } from '@/types';
import {  LayoutGrid, LayoutPanelTop, MapPinCheckInside, Notebook, UserRoundPlus, Users, Users2, FolderTree, Package, Package2, Truck, Gift, ArrowDownToLine, ArrowUpFromLine, Move, Warehouse } from 'lucide-react';
import AppLogo from './app-logo';
import { NavMainSimple } from '@/components/nav-main2';
import { usePermissions } from '@/hooks/use-permissions';

export function AppSidebar() {
    const { hasPermission } = usePermissions();

    // Navigation simple avec permissions
    const mainNavItemsSimple: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        // Les liens utilisateurs sont désormais regroupés dans le sous-menu "Utilisateurs" ci-dessous
        ...(hasPermission('roles.view') ? [{
            title: 'Roles',
            href: '/roles',
            icon: Notebook,
        }] : []),
    ];

    // Navigation avec sous-éléments et permissions
    const mainNavItems: MainNavItem[] = [
        ...(hasPermission('entrers.view') || hasPermission('sorties.view') || hasPermission('products.view') ? [{
            title: 'Mouvements',
            icon: Move,
            subItems: [
                ...(hasPermission('entrers.view') ? [{
                    title: 'Entrées',
                    href: '/entrers',
                    icon: ArrowDownToLine,
                }] : []),
                ...(hasPermission('sorties.view') ? [{
                    title: 'Sorties',
                    href: '/sorties',
                    icon: ArrowUpFromLine,
                }] : []),
                ...(hasPermission('products.view') ? [{
                    title: 'Stock',
                    href: '/stocks',
                    icon: Warehouse,
                }] : []),
            ]
        }] : []),
        ...(hasPermission('clients.view') || hasPermission('secteurs.view') || hasPermission('villes.view') ? [{
            title: 'Manage Clients',
            icon: Users2,
            subItems: [
                ...(hasPermission('clients.view') ? [{
                    title: 'Clients',
                    href: '/clients',
                    icon: UserRoundPlus,
                }] : []),
                ...(hasPermission('secteurs.view') ? [{
                    title: 'Secteurs',
                    href: '/secteurs',
                    icon: LayoutPanelTop,
                }] : []),
                ...(hasPermission('villes.view') ? [{
                    title: 'Villes',
                    href: '/villes',
                    icon: MapPinCheckInside,
                }] : []),
            ]
        }] : []),
        ...(hasPermission('brands.view') || hasPermission('categories.view') || hasPermission('products.view') || hasPermission('promotions.view') ? [{
            title: 'Manage Product',
            icon: Package,
            subItems: [
                ...(hasPermission('brands.view') ? [{
                    title: 'Brands',
                    href: '/brands',
                    icon: Notebook,
                }] : []),
                ...(hasPermission('categories.view') ? [{
                    title: 'Catégories',
                    href: '/categories',
                    icon: FolderTree,
                }] : []),
                ...(hasPermission('products.view') ? [{
                    title: 'Produits',
                    href: '/products',
                    icon: Package2,
                }] : []),
                ...(hasPermission('promotions.view') ? [{
                    title: 'Promotions',
                    href: '/promotions',
                    icon: Gift,
                }] : []),
            ]
        }] : []),
        ...(hasPermission('users.view') || hasPermission('livreurs.view') || hasPermission('transporteurs.view') || hasPermission('commerciaux.view') ? [{
            title: 'Personnels',
            icon: Users2,
            subItems: [
                ...(hasPermission('users.view') ? [{
                    title: 'Users',
                    href: '/users',
                    icon: Users,
                }] : []),
                ...(hasPermission('livreurs.view') ? [{
                    title: 'Livreurs',
                    href: '/livreurs',
                    icon: Truck,
                }] : []),
                ...(hasPermission('transporteurs.view') ? [{
                    title: 'Transporteurs',
                    href: '/transporteurs',
                    icon: Truck,
                }] : []),
                ...(hasPermission('commerciaux.view') ? [{
                    title: 'Commerciaux',
                    href: '/commerciaux',
                    icon: Users,
                }] : []),
            ]
        }] : []),
    ];

    const footerNavItems: NavItem[] = [
        // Ajoutez ici les éléments du footer si nécessaire
    ];

    return (
        <Sidebar>
            <SidebarHeader>
                <AppLogo />
            </SidebarHeader>
            <SidebarContent>
                <NavMainSimple items={mainNavItemsSimple} />
                <NavMain items={mainNavItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
                <NavFooter items={footerNavItems} />
            </SidebarFooter>
        </Sidebar>
    );
}
