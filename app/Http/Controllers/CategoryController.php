<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\CategoryRequest;
use App\Models\Brand;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        // Vérifier la permission de voir les catégories
        if (!auth()->user()->can('categories.view')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de voir les catégories.');
        }

        $categories = Category::with('brand')->latest()->get();
        $brands = Brand::orderBy('brand_name')->get();

        return Inertia::render('category/index', [
            'categories' => $categories,
            'brands' => $brands
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Vérifier la permission de créer une catégorie
        if (!auth()->user()->can('categories.create')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de créer une catégorie.');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request)
    {
        // Vérifier la permission de créer une catégorie
        if (!auth()->user()->can('categories.create')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de créer une catégorie.');
        }

        try {
            $validated = $request->validated();

            Category::create([
                'category_name' => $validated['category_name'],
                'brand_id' => $validated['brand_id'],
            ]);

            return redirect()->route('categories.index')->with('success', 'Catégorie créée avec succès');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la création: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        // Vérifier la permission de voir les catégories
        if (!auth()->user()->can('categories.view')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de voir cette catégorie.');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        // Vérifier la permission d'éditer une catégorie
        if (!auth()->user()->can('categories.edit')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de modifier cette catégorie.');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, Category $category)
    {
        // Vérifier la permission d'éditer une catégorie
        if (!auth()->user()->can('categories.edit')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de modifier cette catégorie.');
        }

        try {
            $validated = $request->validated();

            $category->update([
                'category_name' => $validated['category_name'],
                'brand_id' => $validated['brand_id'],
            ]);

            return redirect()->route('categories.index')->with('success', 'Catégorie modifiée avec succès');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la modification: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        // Vérifier la permission de supprimer une catégorie
        if (!auth()->user()->can('categories.delete')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de supprimer cette catégorie.');
        }

        try {
            $category->delete();

            return redirect()->route('categories.index')->with('success', 'Catégorie supprimée avec succès');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la suppression: ' . $e->getMessage()]);
        }
    }
}
