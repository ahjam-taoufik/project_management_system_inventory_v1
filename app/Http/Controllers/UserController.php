<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        abort_unless(auth()->user()->can('users.view'), 403);

        $users = User::with('roles')->latest()->get();
        $roles = Role::orderBy('name')->get();

        return Inertia::render('user/index', [
            'users' => $users,
            'roles' => $roles
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
    public function store(UserRequest $request)
    {
        abort_unless(auth()->user()->can('users.create'), 403);

        try {
            $validated = $request->validated();

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
            ]);

            // Assigner les rôles sélectionnés
            if (isset($validated['roles']) && is_array($validated['roles']) && !empty($validated['roles'])) {
                $user->syncRoles($validated['roles']);
            }

            return redirect()->route('users.index')->with('success', 'Utilisateur créé avec succès');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la création: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        abort_unless(auth()->user()->can('users.view'), 403);

        // Implementation can be added here if needed
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        abort_unless(auth()->user()->can('users.edit'), 403);

        // Implementation can be added here if needed
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, User $user)
    {
        abort_unless(auth()->user()->can('users.edit'), 403);

        try {
            $validated = $request->validated();

            $user->name = $validated['name'];
            $user->email = $validated['email'];

            // Only update password if provided
            if (!empty($validated['password'])) {
                $user->password = $validated['password'];
            }

            $user->save();

            // Mettre à jour les rôles
            if (isset($validated['roles'])) {
                if (is_array($validated['roles']) && !empty($validated['roles'])) {
                    $user->syncRoles($validated['roles']);
                } else {
                    $user->syncRoles([]);
                }
            }

            if ($user) {
                return redirect()->route('users.index')->with('success', 'Utilisateur mis à jour avec succès');
            }
            return redirect()->back()->with('error', 'Impossible de mettre à jour l\'utilisateur. Veuillez réessayer.');

        } catch (\Exception $th) {
            return redirect()->back()->with('error', 'Échec de la mise à jour de l\'utilisateur.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        abort_unless(auth()->user()->can('users.delete'), 403);

        try {
            if ($user) {
                $user->delete();
                return redirect()->route('users.index')->with('success', 'Utilisateur supprimé avec succès');
            }
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la suppression: ' . $e->getMessage()])->withInput();
        }
    }
}
