<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stock extends Model
{
    protected $fillable = [
        'product_id',
        'quantite_totale_entree',
        'quantite_totale_sortie',
        'stock_disponible',
        'stock_minimum',
        'stock_maximum',
        'valeur_stock',
        'derniere_entree',
        'derniere_sortie',
    ];

    protected $casts = [
        'valeur_stock' => 'decimal:2',
        'derniere_entree' => 'datetime',
        'derniere_sortie' => 'datetime',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // Cette méthode n'est plus nécessaire car nous stockons directement stock_disponible
    // public function getStockDisponibleAttribute()
    // {
    //     return (int) $this->getAttribute('quantite_totale_entree') - (int) $this->getAttribute('quantite_totale_sortie');
    // }

    // Recalculer le stock disponible à partir des entrées et sorties
    public function recalculateStockDisponible()
    {
        $this->stock_disponible = (int) $this->quantite_totale_entree - (int) $this->quantite_totale_sortie;
        return $this->stock_disponible;
    }

    // Vérifier si le stock est critique
    public function isStockCritique(): bool
    {
        return $this->getAttribute('stock_disponible') <= (int) $this->getAttribute('stock_minimum');
    }
}
