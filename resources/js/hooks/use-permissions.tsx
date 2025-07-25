import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

/**
 * Hook personnalisé pour gérer les permissions et rôles de l'utilisateur
 * @returns Objet contenant toutes les fonctions et données relatives aux permissions
 */
export function usePermissions() {
    const { auth } = usePage<SharedData>().props;

    const user = auth?.user;
    const permissions = user?.permissions?.map(p => p.name) || [];
    const roles = user?.roles || [];

    /**
     * Vérifie si l'utilisateur a une permission spécifique
     * @param permission - Nom de la permission à vérifier
     * @returns true si l'utilisateur a la permission, false sinon
     */
    const hasPermission = (permission: string): boolean => {
        if (!user || !permission) return false;
        return permissions.includes(permission);
    };

    /**
     * Vérifie si l'utilisateur a un rôle spécifique
     * @param role - Nom du rôle à vérifier
     * @returns true si l'utilisateur a le rôle, false sinon
     */
    const hasRole = (role: string): boolean => {
        if (!user || !role) return false;
        return roles.includes(role);
    };

    /**
     * Vérifie si l'utilisateur a au moins une des permissions spécifiées
     * @param permissionsList - Liste des permissions à vérifier
     * @returns true si l'utilisateur a au moins une permission, false sinon
     */
    const hasAnyPermission = (permissionsList: string[]): boolean => {
        if (!user || !permissionsList || permissionsList.length === 0) return false;
        return permissionsList.some(permission => permissions.includes(permission));
    };

    /**
     * Vérifie si l'utilisateur a toutes les permissions spécifiées
     * @param permissionsList - Liste des permissions à vérifier
     * @returns true si l'utilisateur a toutes les permissions, false sinon
     */
    const hasAllPermissions = (permissionsList: string[]): boolean => {
        if (!user || !permissionsList || permissionsList.length === 0) return false;
        return permissionsList.every(permission => permissions.includes(permission));
    };

    /**
     * Vérifie si l'utilisateur a au moins un des rôles spécifiés
     * @param rolesList - Liste des rôles à vérifier
     * @returns true si l'utilisateur a au moins un rôle, false sinon
     */
    const hasAnyRole = (rolesList: string[]): boolean => {
        if (!user || !rolesList || rolesList.length === 0) return false;
        return rolesList.some(role => roles.includes(role));
    };

    // Aliases pour plus de clarté
    const can = hasPermission;
    const cannot = (permission: string): boolean => !hasPermission(permission);

    /**
     * Vérifie si l'utilisateur est authentifié
     * @returns true si l'utilisateur est connecté, false sinon
     */
    const isAuthenticated = (): boolean => {
        return !!user;
    };

    return {
        // Données de base
        user,
        permissions,
        roles,

        // Fonctions de vérification des permissions
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        can,
        cannot,

        // Fonctions de vérification des rôles
        hasRole,
        hasAnyRole,

        // Utilitaires
        isAuthenticated,
    };
}
