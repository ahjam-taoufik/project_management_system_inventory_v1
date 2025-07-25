<?php

use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CommercialController;
use App\Http\Controllers\EntrerController;
use App\Http\Controllers\LivreurController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SecteurController;
use App\Http\Controllers\TransporteurController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VilleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('villes', VilleController::class);
    Route::resource('secteurs', SecteurController::class);
    Route::resource('commerciaux', CommercialController::class)->parameters(['commerciaux' => 'commercial']);
    Route::resource('clients', ClientController::class);
    Route::resource('roles', RoleController::class);
    Route::resource('brands', BrandController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('products', ProductController::class);
    Route::resource('promotions', PromotionController::class);
    Route::resource('livreurs', LivreurController::class);
    Route::resource('transporteurs', TransporteurController::class);
    Route::resource('entrers', EntrerController::class);
    Route::get('stocks', [App\Http\Controllers\StockController::class, 'index'])->name('stocks.index');

    Route::resource('users', UserController::class);

    // API routes
    Route::get('/api/secteurs-by-ville', [ClientController::class, 'getSecteursByVille'])->name('api.secteurs-by-ville');
    Route::get('/api/products', [ProductController::class, 'getProducts'])->name('api.products');
    Route::get('/api/product-details/{productId}', [EntrerController::class, 'getProductDetails'])->name('api.product-details');
Route::get('/api/check-bl-exists/{numeroBl}', [EntrerController::class, 'checkBlExists'])->name('api.check-bl-exists');
    Route::get('/api/bl-details/{numeroBl}', [EntrerController::class, 'getBlDetails'])->name('api.bl-details');
    Route::get('/promotion-for-product/{ref_produit}', [PromotionController::class, 'getPromotionForProduct'])->name('promotion-for-product');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
