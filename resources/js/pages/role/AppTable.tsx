"use client"
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RoleDialog from "./components/RoleDialog";
import { columns } from "./config/columns";
import { RoleTable } from "./components/RoleTable";
import type { Role } from "./config/columns";
import type { Permission } from "@/types";
import { useEffect } from "react";

export default function AppTable() {
    const { props: { roles, permissions } } = usePage();
    const rolesArray = roles as Role[];
    const permissionsArray = permissions as Permission[];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                document.getElementById('add-role-button')?.click();
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
                        <CardTitle className="font-bold text-lg sm:text-xl md:text-2xl">Roles</CardTitle>
                        <p className="text-muted-foreground text-sm md:text-base">
                            {rolesArray.length} {rolesArray.length > 1 ? "Roles" : "Role"}
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <RoleDialog permissions={permissionsArray} />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-1 sm:p-2 md:p-4 w-full overflow-x-auto">
                <div className="min-w-[300px]">
                    <RoleTable data={roles as Role[]} columns={columns} />
                </div>
            </CardContent>
        </Card>
    );
}
