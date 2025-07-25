<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Brand;
use App\Models\Category;
use App\Http\Requests\ProductRequest;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        abort_unless(auth()->user()->can('products.view'), 403);

        $products = Product::with(['brand', 'category'])
            ->latest()
            ->get();

        $brands = Brand::orderBy('brand_name')->get();
        $categories = Category::with('brand')->orderBy('category_name')->get();

        return Inertia::render('product/index', [
            'products' => $products,
            'brands' => $brands,
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort_unless(auth()->user()->can('products.create'), 403);
        // Méthode vide - la création se fait via dialog
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        abort_unless(auth()->user()->can('products.create'), 403);

        try {
            $product = Product::create($request->validated());
            return redirect()->route('products.index')->with('success', 'Produit créé avec succès');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la création: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        abort_unless(auth()->user()->can('products.view'), 403);

        $product->load(['brand', 'category']);

        return Inertia::render('product/show', [
            'product' => $product
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        abort_unless(auth()->user()->can('products.edit'), 403);
        // Méthode vide - l'édition se fait via dialog
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, Product $product)
    {
        abort_unless(auth()->user()->can('products.edit'), 403);

        try {
            $product->update($request->validated());
            return redirect()->route('products.index')->with('success', 'Produit mis à jour avec succès');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la mise à jour: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        abort_unless(auth()->user()->can('products.delete'), 403);

        try {
            $product->delete();
            return redirect()->route('products.index')->with('success', 'Produit supprimé avec succès');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la suppression: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Get products for API
     */
    public function getProducts()
    {
        $products = Product::orderBy('product_libelle')->get(['id', 'product_libelle', 'product_Ref']);

        return response()->json([
            'products' => $products
        ]);
    }
}
