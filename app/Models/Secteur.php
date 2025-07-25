<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Secteur extends Model
{


    protected $fillable = [
        'nameSecteur',
        'idVille',
    ];

    public function ville()
    {
         return $this->belongsTo(Ville::class, 'idVille'); // Spécifiez explicitement la clé étrangèr
    }

}
