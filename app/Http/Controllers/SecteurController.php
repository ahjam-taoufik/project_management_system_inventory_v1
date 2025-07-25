<?php

namespace App\Http\Controllers;

use App\Http\Requests\SecteurRequest;
use App\Models\Secteur;
use App\Models\Ville;
use Inertia\Inertia;
use Inertia\Response;

class SecteurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        // Vérifier la permission de voir les secteurs
        if (!auth()->user()->can('secteurs.view')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de voir les secteurs.');
        }

        $secteurs = Secteur::with('ville')->latest()->get();
        $villes = Ville::all(); // Ou votre logique de récupération
        return Inertia::render('secteur/index',
            ['secteurs' => $secteurs,
             'villes' => $villes
            ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Vérifier la permission de créer un secteur
        if (!auth()->user()->can('secteurs.create')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de créer un secteur.');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SecteurRequest $request)
    {
        // Vérifier la permission de créer un secteur
        if (!auth()->user()->can('secteurs.create')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de créer un secteur.');
        }

        try {
            $secteur = Secteur::create([
                'nameSecteur' => $request->validated()['nameSecteur'],
                'idVille' => $request->validated()['idVille'],
            ]);

            return redirect()->route('secteurs.index')->with('success', 'Secteur créé avec succès');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la création: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Secteur $secteur)
    {
        // Vérifier la permission de voir les secteurs
        if (!auth()->user()->can('secteurs.view')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de voir ce secteur.');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Secteur $secteur)
    {
        // Vérifier la permission d'éditer un secteur
        if (!auth()->user()->can('secteurs.edit')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de modifier ce secteur.');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SecteurRequest $request, Secteur $secteur)
    {
        // Vérifier la permission d'éditer un secteur
        if (!auth()->user()->can('secteurs.edit')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de modifier ce secteur.');
        }

        try {
            $validatedData = $request->validated();
            
            $secteur->update([
                'nameSecteur' => $validatedData['nameSecteur'],
                'idVille' => $validatedData['idVille']
            ]);

                return redirect()->route('secteurs.index')->with('success', 'Secteur mis à jour avec succès.');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la mise à jour: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Secteur $secteur)
    {
        // Vérifier la permission de supprimer un secteur
        if (!auth()->user()->can('secteurs.delete')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de supprimer ce secteur.');
        }

        try {
            $secteur->delete();
            return redirect()->route('secteurs.index')->with('success', 'Secteur supprimé avec succès');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la suppression: ' . $e->getMessage()])->withInput();
        }
    }
}
