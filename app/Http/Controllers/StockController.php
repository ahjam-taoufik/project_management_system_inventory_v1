<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Stock::class);

        // Correction : charger la relation brand et inclure brand_id
        $products = Product::with('brand')
            ->where('product_isActive', true)
            ->get(['id', 'brand_id', 'product_libelle', 'product_Ref', 'prix_achat_colis', 'prix_vente_colis']);
        $stocks = Stock::with('product')
            ->whereHas('product', function ($q) {
                $q->where('product_isActive', true);
            })
            ->get();

        $query = Stock::with(['product.brand'])
            ->whereHas('product', function ($q) {
                $q->where('product_isActive', true);
            });

        // Recherche par produit
        if ($request->search) {
            $query->whereHas('product', function ($q) use ($request) {
                $q->where('product_libelle', 'like', "%{$request->search}%");
            });
        }

        // Filtrage par recherche (search)
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('product', function ($q) use ($search) {
                $q->where('product_libelle', 'like', "%{$search}%")
                  ->orWhere('product_Ref', 'like', "%{$search}%");
            });
        }

        // Filtrage par marque (brand_ids)
        if ($request->has('brand_ids')) {
            $brandIds = $request->input('brand_ids');
            $query->whereHas('product', function ($q) use ($brandIds) {
                $q->whereIn('brand_id', (array)$brandIds);
            });
        }

        // Filtrage par valeur de stock (positive, negative, zero)
        if ($request->filled('stock_value_filter')) {
            $stockValueFilter = $request->input('stock_value_filter');

            switch ($stockValueFilter) {
                case 'positive':
                    $query->where('stock_disponible', '>', 0);
                    break;
                case 'negative':
                    $query->where('stock_disponible', '<', 0);
                    break;
                case 'zero':
                    $query->where('stock_disponible', '=', 0);
                    break;
                // Par défaut, pas de filtrage
            }
        }

        // Tri (par défaut sur created_at desc)
        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');
        $query->orderBy($sort, $direction);

        // Pagination dynamique (par défaut "All" = tout afficher)
        $perPage = $request->get('perPage', -1); // -1 ou 'All' = tout afficher
        if ($perPage === 'All' || $perPage === -1 || $perPage === '-1') {
            $stocks = $query->get();
        } else {
            $stocks = $query->paginate($perPage)->withQueryString();
        }

        // Cloner la requête pour le total (sans pagination)
        $totalQuery = clone $query;
        $allStocks = $totalQuery->get();

        // Calcul des totaux en fonction des valeurs filtrées
        $totalMontantAchat = $allStocks->reduce(function ($acc, $stock) {
            $valeur = $stock->stock_disponible;
            $prix = $stock->product->prix_achat_colis ?? 0;
            // Ne pas filtrer les valeurs négatives pour permettre les totaux corrects
            return $acc + ((float)$valeur * (float)$prix);
        }, 0);

        $totalMontantVente = $allStocks->reduce(function ($acc, $stock) {
            $valeur = $stock->stock_disponible;
            $prix = $stock->product->prix_vente_colis ?? 0;
            // Ne pas filtrer les valeurs négatives pour permettre les totaux corrects
            return $acc + ((float)$valeur * (float)$prix);
        }, 0);

        $totalDiff = $totalMontantVente - $totalMontantAchat;

        return Inertia::render('mouvements/stock/index', [
            'stocks' => $stocks,
            'products' => $products,
            'filters' => $request->only(['search', 'sort', 'direction', 'perPage', 'brand_ids', 'stock_value_filter']),
            'total_montant_achat' => $totalMontantAchat,
            'total_montant_vente' => $totalMontantVente,
            'total_diff' => $totalDiff,
        ]);
    }
}
