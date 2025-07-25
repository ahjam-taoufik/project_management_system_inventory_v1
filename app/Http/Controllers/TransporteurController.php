<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\TransporteurRequest;
use App\Models\Transporteur;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransporteurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        abort_unless(auth()->user()->can('transporteurs.view'), 403);

        $transporteurs = Transporteur::query()
            ->when($request->search, function ($query, $search) {
                $query->where('conducteur_name', 'like', "%{$search}%")
                      ->orWhere('vehicule_matricule', 'like', "%{$search}%")
                      ->orWhere('conducteur_cin', 'like', "%{$search}%");
            })
            ->orderBy($request->sort ?? 'created_at', $request->direction ?? 'desc')
            ->get();

        return Inertia::render('transporteur/index', [
            'transporteurs' => $transporteurs,
            'filters' => $request->only(['search', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        abort_unless(auth()->user()->can('transporteurs.create'), 403);

        return Inertia::render('transporteur/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TransporteurRequest $request)
    {
        abort_unless(auth()->user()->can('transporteurs.create'), 403);

        Transporteur::create($request->validated());

        return redirect()->route('transporteurs.index')
            ->with('success', 'Transporteur créé avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Transporteur $transporteur): Response
    {
        abort_unless(auth()->user()->can('transporteurs.view'), 403);

        return Inertia::render('transporteur/show', [
            'transporteur' => $transporteur,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transporteur $transporteur): Response
    {
        abort_unless(auth()->user()->can('transporteurs.edit'), 403);

        return Inertia::render('transporteur/edit', [
            'transporteur' => $transporteur,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TransporteurRequest $request, Transporteur $transporteur)
    {
        abort_unless(auth()->user()->can('transporteurs.edit'), 403);

        $transporteur->update($request->validated());

        return redirect()->route('transporteurs.index')
            ->with('success', 'Transporteur modifié avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transporteur $transporteur)
    {
        abort_unless(auth()->user()->can('transporteurs.delete'), 403);

        $transporteur->delete();

        return redirect()->route('transporteurs.index')
            ->with('success', 'Transporteur supprimé avec succès.');
    }
}
