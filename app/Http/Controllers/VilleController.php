<?php

namespace App\Http\Controllers;

use App\Http\Requests\VilleRequest;
use App\Models\Ville;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VilleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index():Response
    {
        // Vérifier la permission de voir les villes
        if (!auth()->user()->can('villes.view')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de voir les villes.');
        }

        $villes=Ville::latest()->get();
         return Inertia::render('ville/index',
         ['villes' => $villes]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Vérifier la permission de créer une ville
        if (!auth()->user()->can('villes.create')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de créer une ville.');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
   public function store(VilleRequest $request)
   {
        // Vérifier la permission de créer une ville
        if (!auth()->user()->can('villes.create')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de créer une ville.');
        }

        try {
            $ville = Ville::create([
                'nameVille' => $request->validated()['nameVille'],
            ]);

            return redirect()->route('villes.index')->with('success', 'Ville créée avec succès');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la création: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Vérifier la permission de voir les villes
        if (!auth()->user()->can('villes.view')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de voir cette ville.');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ville $ville)
    {
        // Vérifier la permission d'éditer une ville
        if (!auth()->user()->can('villes.edit')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de modifier cette ville.');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(VilleRequest $request, Ville $ville)
    {
        // Vérifier la permission d'éditer une ville
        if (!auth()->user()->can('villes.edit')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de modifier cette ville.');
        }

        try {
                $ville->nameVille = $request->nameVille;
                $ville->save();

                if ($ville) {
                     return redirect()->route('villes.index')->with('success', 'Ville updated successfully.');
                 }
                return redirect()->back()->with('error', 'Unable to uipdate Ville. Please try again.');

        } catch (\Exception $th) {
            return redirect()->back()->with('error', 'Failed to update Ville.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
     public function destroy(Ville $ville)
    {
        // Vérifier la permission de supprimer une ville
        if (!auth()->user()->can('villes.delete')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de supprimer cette ville.');
        }

        try {
            if ($ville) {
                $ville->delete();
                return redirect()->route('villes.index')->with('success', 'Ville Supprimer avec succès');
            }

         } catch (\Exception $e) {
        return redirect()->back()->withErrors(['message' => 'Erreur lors de la Suppression: ' . $e->getMessage()])->withInput();
    }
    }
}
