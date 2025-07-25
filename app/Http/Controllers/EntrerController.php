<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Entrer;
use App\Models\Product;
use App\Models\Transporteur;
use App\Http\Requests\EntrerRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use App\Models\Promotion;

class EntrerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        abort_unless(auth()->user()->can('entrers.view'), 403);

        // Récupérer toutes les entrées
        $allEntrers = Entrer::with(['product', 'transporteur'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Regrouper par numéro BL et créer des entrées uniques
        $entrers = $allEntrers->groupBy('numero_bl')->map(function ($group) {
            $firstEntry = $group->first();

            // Calculer le total du BL
            $totalBl = $group->sum(function ($entry) {
                return ($entry->prix_achat_produit ?? 0) * ($entry->quantite_produit ?? 0);
            });

            return [
                'id' => $firstEntry->id,
                'numero_bl' => $firstEntry->numero_bl,
                'transporteur' => $firstEntry->transporteur,
                'date_charge' => $firstEntry->date_charge,
                'date_decharge' => $firstEntry->date_decharge,
                'updated_at' => $firstEntry->updated_at,
                'product_count' => $group->count(), // Nombre de produits dans ce BL
                'total_bl' => $totalBl, // Total du BL
                'products' => $group->map(function ($entry) {
                    return [
                        'id' => $entry->id,
                        'product' => $entry->product,
                        'ref_produit' => $entry->ref_produit,
                        'prix_achat_produit' => $entry->prix_achat_produit,
                        'quantite_produit' => $entry->quantite_produit,
                        'manque' => $entry->manque,
                    ];
                })->values()
            ];
        })->values();

        $products = Product::orderBy('product_libelle')->get();
        $transporteurs = Transporteur::orderBy('conducteur_name')->get();

        return Inertia::render('mouvements/entrer/index', [
            'entrers' => $entrers,
            'products' => $products,
            'transporteurs' => $transporteurs
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort_unless(auth()->user()->can('entrers.create'), 403);
        // Méthode vide - la création se fait via dialog
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(EntrerRequest $request)
    {
        abort_unless(auth()->user()->can('entrers.create'), 403);

        try {
            $validatedData = $request->validated();
            $productLines = $request->input('product_lines', []);

            $createdCount = 0;

            // Créer une entrée pour chaque ligne de produit
            foreach ($productLines as $line) {
                $entrerData = [
                    'product_id' => $line['product_id'],
                    'ref_produit' => $line['ref_produit'],
                    'prix_achat_produit' => $line['prix_achat_produit'],
                    'quantite_produit' => $line['quantite_produit'],
                    'numero_bl' => $validatedData['numero_bl'],
                    'transporteur_id' => $validatedData['transporteur_id'],
                    'date_charge' => $validatedData['date_charge'],
                    'date_decharge' => $validatedData['date_decharge'] ?? null,
                    'manque' => $line['manque'] ?? null,
                ];

                Entrer::create($entrerData);
                $createdCount++;
            }

            $message = $createdCount > 1
                ? "{$createdCount} entrées créées avec succès"
                : "Entrée créée avec succès";

            return redirect()->route('entrers.index')->with('success', $message);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la création: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Entrer $entrer)
    {
        abort_unless(auth()->user()->can('entrers.view'), 403);

        $entrer->load(['product', 'transporteur']);

        return Inertia::render('mouvements/entrer/show', [
            'entrer' => $entrer
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Entrer $entrer)
    {
        abort_unless(auth()->user()->can('entrers.edit'), 403);
        // Méthode vide - l'édition se fait via dialog
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EntrerRequest $request, Entrer $entrer)
    {
        abort_unless(auth()->user()->can('entrers.edit'), 403);

        try {
            $validatedData = $request->validated();
            $productLines = $request->input('product_lines', []);
            $numeroBl = $validatedData['numero_bl'];
            $originalNumeroBl = $request->input('original_numero_bl', $entrer->numero_bl);

            // Démarrer une transaction pour garantir la cohérence
            DB::beginTransaction();

            try {
                // Supprimer toutes les entrées existantes pour l'ancien numéro BL
                Entrer::where('numero_bl', $originalNumeroBl)->delete();

                $updatedCount = 0;

                // Créer les nouvelles entrées avec le nouveau numéro BL
                foreach ($productLines as $line) {
                    $entrerData = [
                        'product_id' => $line['product_id'],
                        'ref_produit' => $line['ref_produit'],
                        'prix_achat_produit' => $line['prix_achat_produit'],
                        'quantite_produit' => $line['quantite_produit'],
                        'numero_bl' => $numeroBl,
                        'transporteur_id' => $validatedData['transporteur_id'],
                        'date_charge' => $validatedData['date_charge'],
                        'date_decharge' => $validatedData['date_decharge'],
                        'manque' => $line['manque'] ?: null,
                    ];

                    Entrer::create($entrerData);
                    $updatedCount++;
                }

                DB::commit();

                $message = $updatedCount > 1
                    ? "BL mis à jour avec {$updatedCount} produits"
                    : "BL mis à jour avec succès";

                return redirect()->route('entrers.index')->with('success', $message);
            } catch (\Exception $e) {
                DB::rollback();
                throw $e;
            }
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la mise à jour: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Entrer $entrer)
    {
        abort_unless(auth()->user()->can('entrers.delete'), 403);

        try {
            // Récupérer le numéro BL avant de supprimer l'entrée
            $numeroBl = $entrer->numero_bl;

            // Récupérer toutes les entrées avec le même numéro BL
            $entrers = Entrer::where('numero_bl', $numeroBl)->get();
            $deletedCount = $entrers->count();

            // Supprimer les entrées une par une pour déclencher les observateurs
            foreach ($entrers as $entrerItem) {
                $entrerItem->delete(); // Ceci déclenchera l'EntrerObserver
            }

            $message = $deletedCount > 1
                ? "BL supprimé avec {$deletedCount} entrées"
                : "BL supprimé avec succès";

            return redirect()->route('entrers.index')->with('success', $message);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la suppression: ' . $e->getMessage()]);
        }
    }

    /**
     * Get product details for API
     */
    public function getProductDetails($productId)
    {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json(['error' => 'Produit non trouvé'], 404);
        }

        return response()->json([
            'ref_produit' => $product->product_Ref,
            'prix_achat_colis' => $product->prix_achat_colis
        ]);
    }

    /**
     * Check if BL number already exists
     */
    public function checkBlExists($numeroBl)
    {
        $exists = Entrer::where('numero_bl', $numeroBl)->exists();

        return response()->json([
            'exists' => $exists,
            'numero_bl' => $numeroBl
        ]);
    }

    /**
     * Get BL details for editing
     */
    public function getBlDetails($numeroBl)
    {
        $entrers = Entrer::with(['product', 'transporteur'])
            ->where('numero_bl', $numeroBl)
            ->get();

        if ($entrers->isEmpty()) {
            return response()->json(['error' => 'BL non trouvé'], 404);
        }

        $firstEntry = $entrers->first();

        $blData = [
            'numero_bl' => $firstEntry->numero_bl,
            'transporteur_id' => $firstEntry->transporteur_id,
            'date_charge' => $firstEntry->date_charge,
            'date_decharge' => $firstEntry->date_decharge,
            'product_lines' => $entrers->map(function ($entry) {
                return [
                    'product_id' => $entry->product_id,
                    'ref_produit' => $entry->ref_produit,
                    'prix_achat_produit' => $entry->prix_achat_produit,
                    'quantite_produit' => $entry->quantite_produit,
                    'manque' => $entry->manque,
                ];
            })->toArray()
        ];

        return response()->json($blData);
    }
}
