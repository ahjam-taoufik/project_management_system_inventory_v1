"use client"
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserDialog from "./components/UserDialog";
import { createColumns } from "./config/columns";
import { UserTable } from "./components/UserTable";
import type { User, Role } from "@/types";
import { useEffect } from "react";
import { usePermissions } from "@/hooks/use-permissions";

export default function AppTable() {
    const { props: { users, roles } } = usePage();
    const { hasPermission } = usePermissions();
    const usersArray = users as User[];
    const rolesArray = roles as Role[];

    // Générer les colonnes avec les rôles
    const columns = createColumns(rolesArray);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                document.getElementById('add-user-button')?.click();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <Card className="mt-6 md:mt-12 flex flex-col shadow-none poppins border-none w-full max-w-full overflow-x-auto">
            <CardHeader className="flex justify-between p-2 md:p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
                    <div>
                        <CardTitle className="font-bold text-lg sm:text-xl md:text-2xl">Utilisateurs</CardTitle>
                        <p className="text-muted-foreground text-sm md:text-base">
                            {usersArray.length} {usersArray.length > 1 ? "Utilisateurs" : "Utilisateur"}
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        {hasPermission('users.create') && (
                            <UserDialog roles={rolesArray} />
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-1 sm:p-2 md:p-4 w-full overflow-x-auto">
                <div className="min-w-[300px]">
                    <UserTable data={users as User[]} columns={columns} />
                </div>
            </CardContent>
        </Card>
    );
}
