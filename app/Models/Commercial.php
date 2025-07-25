<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Commercial extends Model
{
    protected $table = 'commerciaux';

    protected $fillable = [
        'commercial_code',
        'commercial_fullName',
        'commercial_telephone',
    ];

    /**
     * Get the clients for the commercial.
     */
    public function clients(): HasMany
    {
        return $this->hasMany(Client::class, 'idCommercial');
    }
}
