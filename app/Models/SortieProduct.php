<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SortieProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'sortie_id',
        'product_id',
        'ref_produit',
        'prix_vente_produit',
        'quantite_produit',
        'total_ligne',
    ];

    protected $casts = [
        'prix_vente_produit' => 'decimal:2',
        'quantite_produit' => 'integer',
        'total_ligne' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the sortie that owns the product.
     */
    public function sortie(): BelongsTo
    {
        return $this->belongsTo(Sortie::class);
    }

    /**
     * Get the product that owns the sortie product.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Calculate the total ligne
     */
    public function calculateTotalLigne(): void
    {
        $this->total_ligne = $this->prix_vente_produit * $this->quantite_produit;
    }

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($sortieProduct) {
            $sortieProduct->calculateTotalLigne();
        });

        static::updating(function ($sortieProduct) {
            $sortieProduct->calculateTotalLigne();
        });

        // Removed automatic sortie total calculation to prevent infinite loops
        // Total will be calculated manually in the controller
    }
}