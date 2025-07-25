<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;

class Livreur extends Model
{
    use HasFactory, HasRoles;

    protected $fillable = [
        'nom',
        'telephone',
    ];
}
