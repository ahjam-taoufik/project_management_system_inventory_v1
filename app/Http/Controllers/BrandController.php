<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Brand;
use App\Http\Requests\BrandRequest;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        abort_unless(auth()->user()->can('brands.view'), 403);
        $brands = Brand::latest()->get();
        return Inertia::render('brand/index', [
            'brands' => $brands
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(BrandRequest $request)
    {
        abort_unless(auth()->user()->can('brands.create'), 403);
        try {
            $brand = Brand::create($request->validated());
            return redirect()->route('brands.index')->with('success', 'Marque créée avec succès');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la création: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand)
    {
        abort_unless(auth()->user()->can('brands.view'), 403);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Brand $brand) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(BrandRequest $request, Brand $brand)
    {
        abort_unless(auth()->user()->can('brands.edit'), 403);
        try {
            $brand->update($request->validated());
            return redirect()->route('brands.index')->with('success', 'Marque mise à jour avec succès');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la mise à jour: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        abort_unless(auth()->user()->can('brands.delete'), 403);
        try {
            $brand->delete();
            return redirect()->route('brands.index')->with('success', 'Marque supprimée avec succès');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => 'Erreur lors de la suppression: ' . $e->getMessage()])->withInput();
        }
    }
}
