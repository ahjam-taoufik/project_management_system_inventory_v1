<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sortie;
use App\Models\SortieProduct;
use App\Models\Product;
use App\Models\Commercial;
use App\Models\Client;
use App\Models\Livreur;
use App\Http\Requests\SortieRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;

class SortieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        abort_unless(auth()->user()->can('sorties.view'), 403);

        $sorties = Sortie::with([
            'commercial',
            'client.ville',
            'client.secteur',
            'products.product'
        ])
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($sortie) {
            return [
                'id' => $sortie->id,
                'numero_bl' => $sortie->numero_bl,
                'commercial' => [
                    'id' => $sortie->commercial->id,
                    'code' => $sortie->commercial->commercial_code,
                    'nom' => $sortie->commercial->commercial_fullName,
                    'telephone' => $sortie->commercial->commercial_telephone,
                ],
                'client' => [
                    'id' => $sortie->client->id,
                    'code' => $sortie->client->code,
                    'nom' => $sortie->client->fullName,
                    'telephone' => $sortie->client->telephone,
                    'ville' => $sortie->client->ville->ville_name ?? '',
                    'secteur' => $sortie->client->secteur->secteur_name ?? '',
                    'type_client' => $sortie->client->remise_special ? 'Spécial' : 'Normal',
                ],
                'date_bl' => $sortie->date_bl->format('Y-m-d'),
                'livreur' => $sortie->livreur,
                'product_count' => $sortie->products->count(),
                'total_bl' => $sortie->total_bl,
                'updated_at' => $sortie->updated_at,
                'products' => $sortie->products->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'product' => [
                            'id' => $product->product->id,
                            'product_libelle' => $product->product->product_libelle,
                            'product_Ref' => $product->product->product_Ref,
                        ],
                        'ref_produit' => $product->ref_produit,
                        'prix_vente_produit' => $product->prix_vente_produit,
                        'quantite_produit' => $product->quantite_produit,
                        'total_ligne' => $product->total_ligne,
                    ];
                }),
            ];
        });

        $products = Product::where('product_isActive', true)
            ->orderBy('product_libelle')
            ->get();

        $commerciaux = Commercial::orderBy('commercial_fullName')->get();

        $clients = Client::with(['ville', 'secteur'])
            ->orderBy('fullName')
            ->get();

        // Récupérer la liste des livreurs depuis le modèle Livreur
        $livreurs = Livreur::orderBy('nom')->get();

        return Inertia::render('mouvements/sortie/index', [
            'sorties' => $sorties,
            'products' => $products,
            'commerciaux' => $commerciaux,
            'clients' => $clients,
            'livreurs' => $livreurs,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort_unless(auth()->user()->can('sorties.create'), 403);
        // Méthode vide - la création se fait via dialog
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SortieRequest $request): RedirectResponse
    {
        abort_unless(auth()->user()->can('sorties.create'), 403);

        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            // Créer la sortie principale
            $sortie = Sortie::create([
                'numero_bl' => $validatedData['numero_bl'],
                'commercial_id' => $validatedData['commercial_id'],
                'client_id' => $validatedData['client_id'],
                'date_bl' => $validatedData['date_bl'],
                'livreur' => $validatedData['livreur'],
            ]);

            // Créer les produits associés
            foreach ($validatedData['products'] as $productData) {
                $product = Product::find($productData['product_id']);
                
                SortieProduct::create([
                    'sortie_id' => $sortie->id,
                    'product_id' => $productData['product_id'],
                    'ref_produit' => $product->product_Ref,
                    'prix_vente_produit' => $productData['prix_vente_produit'],
                    'quantite_produit' => $productData['quantite_produit'],
                    'total_ligne' => $productData['prix_vente_produit'] * $productData['quantite_produit'],
                ]);
            }

            // Calculer et mettre à jour le total de la sortie
            $sortie->calculateTotal();

            DB::commit();

            return redirect()->route('sorties.index')
                ->with('success', 'Sortie créée avec succès');

        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()
                ->withErrors(['message' => 'Erreur lors de la création: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Sortie $sortie): Response
    {
        abort_unless(auth()->user()->can('sorties.view'), 403);

        $sortie->load([
            'commercial',
            'client.ville',
            'client.secteur',
            'products.product'
        ]);

        return Inertia::render('mouvements/sortie/show', [
            'sortie' => $sortie
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sortie $sortie)
    {
        abort_unless(auth()->user()->can('sorties.edit'), 403);
        // Méthode vide - l'édition se fait via dialog
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SortieRequest $request, Sortie $sortie): RedirectResponse
    {
        abort_unless(auth()->user()->can('sorties.edit'), 403);

        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            // Mettre à jour la sortie principale
            $sortie->update([
                'numero_bl' => $validatedData['numero_bl'],
                'commercial_id' => $validatedData['commercial_id'],
                'client_id' => $validatedData['client_id'],
                'date_bl' => $validatedData['date_bl'],
                'livreur' => $validatedData['livreur'],
            ]);

            // Si des produits sont fournis, les mettre à jour
            if (isset($validatedData['products'])) {
                // Supprimer les anciens produits
                $sortie->products()->delete();

                // Créer les nouveaux produits
                foreach ($validatedData['products'] as $productData) {
                    $product = Product::find($productData['product_id']);
                    
                    SortieProduct::create([
                        'sortie_id' => $sortie->id,
                        'product_id' => $productData['product_id'],
                        'ref_produit' => $product->product_Ref,
                        'prix_vente_produit' => $productData['prix_vente_produit'],
                        'quantite_produit' => $productData['quantite_produit'],
                        'total_ligne' => $productData['prix_vente_produit'] * $productData['quantite_produit'],
                    ]);
                }

                // Recalculer le total après mise à jour des produits
                $sortie->calculateTotal();
            }

            DB::commit();

            return redirect()->route('sorties.index')
                ->with('success', 'Sortie modifiée avec succès');

        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()
                ->withErrors(['message' => 'Erreur lors de la modification: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sortie $sortie): RedirectResponse
    {
        abort_unless(auth()->user()->can('sorties.delete'), 403);

        try {
            DB::beginTransaction();

            // Supprimer les produits associés (cascade)
            $sortie->products()->delete();
            
            // Supprimer la sortie
            $sortie->delete();

            DB::commit();

            return redirect()->route('sorties.index')
                ->with('success', 'Sortie supprimée avec succès');

        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()
                ->withErrors(['message' => 'Erreur lors de la suppression: ' . $e->getMessage()]);
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
            'prix_vente_colis' => $product->prix_vente_colis
        ]);
    }

    /**
     * Check if BL number already exists
     */
    public function checkBlExists($numeroBl)
    {
        $exists = Sortie::where('numero_bl', $numeroBl)->exists();

        return response()->json([
            'exists' => $exists,
            'numero_bl' => $numeroBl
        ]);
    }

    /**
     * Get clients by commercial
     */
    public function getClientsByCommercial($commercialId)
    {
        $clients = Client::with(['ville', 'secteur'])
            ->where('idCommercial', $commercialId)
            ->orderBy('fullName')
            ->get();

        return response()->json($clients);
    }
}