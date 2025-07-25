<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ClientRequest;
use App\Models\Client;
use App\Models\Ville;
use App\Models\Secteur;
use App\Models\Commercial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        // Vérifier la permission de voir les clients
        if (!auth()->user()->can('clients.view')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de voir les clients.');
        }

        $clients = Client::with(['ville', 'secteur', 'commercial'])->latest()->get();
        $villes = Ville::all();
        $commerciaux = Commercial::all();

        return Inertia::render('client/index', [
            'clients' => $clients,
            'villes' => $villes,
            'commerciaux' => $commerciaux
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Vérifier la permission de créer un client
        if (!auth()->user()->can('clients.create')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de créer un client.');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ClientRequest $request)
    {
        // Vérifier la permission de créer un client
        if (!auth()->user()->can('clients.create')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de créer un client.');
        }

        try {
            $client = Client::create([
                'code' => $request->validated()['code'],
                'fullName' => $request->validated()['fullName'],
                'idVille' => $request->validated()['idVille'],
                'idSecteur' => $request->validated()['idSecteur'],
                'idCommercial' => $request->validated()['idCommercial'] ?? null,
                'remise_special' => $request->validated()['remise_special'],
                'pourcentage' => $request->validated()['pourcentage'],
                'telephone' => $request->validated()['telephone'],
            ]);

            return redirect()->route('clients.index')->with('success', 'Client créé avec succès');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la création: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        // Vérifier la permission de voir les clients
        if (!auth()->user()->can('clients.view')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de voir ce client.');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        // Vérifier la permission d'éditer un client
        if (!auth()->user()->can('clients.edit')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de modifier ce client.');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ClientRequest $request, Client $client)
    {
        // Vérifier la permission d'éditer un client
        if (!auth()->user()->can('clients.edit')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de modifier ce client.');
        }

        try {
            $validatedData = $request->validated();

            $client->update([
                'code' => $validatedData['code'],
                'fullName' => $validatedData['fullName'],
                'idVille' => $validatedData['idVille'],
                'idSecteur' => $validatedData['idSecteur'],
                'idCommercial' => $validatedData['idCommercial'] ?? null,
                'remise_special' => $validatedData['remise_special'],
                'pourcentage' => $validatedData['pourcentage'],
                'telephone' => $validatedData['telephone'],
            ]);

            return redirect()->route('clients.index')->with('success', 'Client mis à jour avec succès.');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la mise à jour: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        // Vérifier la permission de supprimer un client
        if (!auth()->user()->can('clients.delete')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de supprimer ce client.');
        }

        try {
            $client->delete();
            return redirect()->route('clients.index')->with('success', 'Client supprimé avec succès');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la suppression: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Get secteurs by ville for API calls.
     */
    public function getSecteursByVille(Request $request)
    {
        $villeId = $request->get('ville_id');

        if (!$villeId) {
            return response()->json(['secteurs' => []]);
        }

        $secteurs = Secteur::where('idVille', $villeId)->get();

        return response()->json(['secteurs' => $secteurs]);
    }
}
