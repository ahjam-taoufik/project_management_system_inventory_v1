<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Product;
use App\Models\Entrer;
use App\Models\Sortie;
use App\Models\SortieProduct;
use App\Observers\ProductObserver;
use App\Observers\EntrerObserver;
use App\Observers\SortieObserver;
use App\Observers\SortieProductObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Product::observe(ProductObserver::class);
        Entrer::observe(EntrerObserver::class);
        Sortie::observe(SortieObserver::class);
        SortieProduct::observe(SortieProductObserver::class);
    }
}
