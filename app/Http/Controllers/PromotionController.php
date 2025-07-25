<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use App\Models\Product;
use App\Http\Requests\PromotionRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class PromotionController extends Controller
{
    public function index()
    {
        $promotions = Promotion::with(['produitPromotionnel:id,product_libelle,product_Ref', 'produitOffert:id,product_libelle,product_Ref'])
            ->orderBy('created_at', 'desc')
            ->get();

        $products = Product::orderBy('product_libelle')->get();

        return Inertia::render('promotion/index', [
            'promotions' => $promotions,
            'products' => $products,
        ]);
    }

    public function store(PromotionRequest $request)
    {
        Promotion::create($request->validated());

        return redirect()->back();
    }

    public function update(PromotionRequest $request, Promotion $promotion)
    {
        $promotion->update($request->validated());

        return redirect()->back();
    }

    public function destroy(Promotion $promotion)
    {
        $promotion->delete();

        return redirect()->back();
    }

    /**
     * API: Vérifie si un produit a une promotion active (par référence produit).
     * Retourne les infos du produit offert ou null.
     */
    public function getPromotionForProduct($ref_produit)
    {
        try {
            // On cherche le produit principal par sa référence
            $product = \App\Models\Product::where('product_Ref', $ref_produit)->first();
            if (!$product) {
                return response()->json(['exists' => false, 'error' => 'Produit non trouvé']);
            }
            // On cherche une promotion où ce produit est le produit promotionnel
            $promotion = \App\Models\Promotion::where('produit_promotionnel_id', $product->id)
                ->where('is_active', true)
                ->first();
            if ($promotion) {
                $offered = $promotion->produitOffert;
                return response()->json([
                    'exists' => true,
                    'offered_product' => [
                        'product_id' => $offered->id,
                        'ref_produit' => $offered->product_Ref,
                        'product_libelle' => $offered->product_libelle,
                        'quantite_offerte' => $promotion->quantite_produit_offert,
                        'prix_offert' => 0,
                    ],
                    'promotion_id' => $promotion->id,
                    'quantite_produit_promotionnel' => $promotion->quantite_produit_promotionnel, // Ajout pour le calcul frontend
                ]);
            }
            return response()->json(['exists' => false]);
        } catch (\Throwable $e) {
            Log::error('Erreur API promotion: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur interne promotion', 'details' => $e->getMessage()], 500);
        }
    }
}
