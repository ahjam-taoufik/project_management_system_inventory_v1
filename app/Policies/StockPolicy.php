<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Stock;

class StockPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('stocks.view');
    }
}
