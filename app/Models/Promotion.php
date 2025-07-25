<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Promotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'produit_promotionnel_id',
        'quantite_produit_promotionnel',
        'produit_offert_id',
        'quantite_produit_offert',
        'is_active',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function produitPromotionnel(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'produit_promotionnel_id');
    }

    public function produitOffert(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'produit_offert_id');
    }
}
