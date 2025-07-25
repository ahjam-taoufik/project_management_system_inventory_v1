<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
// use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $roles = Role::with('permissions')->latest()->get();
        $permissions = Permission::orderBy('name')->get();
        return Inertia::render('role/index', [
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleRequest $request)
    {
        try {
            $validated = $request->validated();

            $role = Role::create([
                'name' => $validated['name'],
            ]);

            // Attribuer les permissions sélectionnées au rôle
            if (isset($validated['permissions']) && is_array($validated['permissions'])) {
                $role->syncPermissions($validated['permissions']);
            }

            return redirect()->route('roles.index')->with('success', 'Rôle créé avec succès');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la création: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleRequest $request, Role $role)
    {
        try {
            $validated = $request->validated();

            $role->update([
                'name' => $validated['name'],
            ]);

            // Mettre à jour les permissions
            if (isset($validated['permissions']) && is_array($validated['permissions'])) {
                $role->syncPermissions($validated['permissions']);
            } else {
                // Si aucune permission n'est fournie, supprimer toutes les permissions
                $role->syncPermissions([]);
            }

            return redirect()->route('roles.index')->with('success', 'Rôle mis à jour avec succès.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la mise à jour: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        try {
            $role->delete();
            return redirect()->route('roles.index')->with('success', 'Rôle supprimé avec succès');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la suppression: ' . $e->getMessage()])->withInput();
        }
    }
}
