<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transporteur extends Model
{
    /** @use HasFactory<\Database\Factories\TransporteurFactory> */
    use HasFactory;

    protected $fillable = [
        'conducteur_name',
        'vehicule_matricule',
        'conducteur_cin',
        'conducteur_telephone',
        'vehicule_type',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
