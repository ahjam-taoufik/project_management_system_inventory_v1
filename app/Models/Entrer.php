<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Entrer extends Model
{
    /** @use HasFactory<\Database\Factories\EntrerFactory> */
    use HasFactory;

    protected $fillable = [
        'product_id',
        'ref_produit',
        'prix_achat_produit',
        'quantite_produit',
        'numero_bl',
        'transporteur_id',
        'date_charge',
        'date_decharge',
        'manque',
    ];

    protected $casts = [
        'prix_achat_produit' => 'decimal:2',
        'quantite_produit' => 'integer',
        'manque' => 'integer',
        'date_charge' => 'date',
        'date_decharge' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the product that owns the entrer.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the transporteur that owns the entrer.
     */
    public function transporteur(): BelongsTo
    {
        return $this->belongsTo(Transporteur::class);
    }
}
