<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sortie extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero_bl',
        'commercial_id',
        'client_id',
        'date_bl',
        'livreur',
        'total_bl',
    ];

    protected $casts = [
        'date_bl' => 'date',
        'total_bl' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the commercial that owns the sortie.
     */
    public function commercial(): BelongsTo
    {
        return $this->belongsTo(Commercial::class);
    }

    /**
     * Get the client that owns the sortie.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Get the products for the sortie.
     */
    public function products(): HasMany
    {
        return $this->hasMany(SortieProduct::class);
    }

    /**
     * Calculate and update the total BL
     */
    public function calculateTotal(): void
    {
        $total = $this->products()->sum('total_ligne');
        $this->update(['total_bl' => $total]);
    }

    /**
     * Get the product count attribute
     */
    public function getProductCountAttribute(): int
    {
        return $this->products()->count();
    }

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        // Removed automatic total calculation to prevent infinite loops
        // Total will be calculated manually when needed
    }
}