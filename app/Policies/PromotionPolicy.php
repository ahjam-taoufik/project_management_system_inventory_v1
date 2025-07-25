<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Promotion;

class PromotionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('promotions.view');
    }

    public function view(User $user, Promotion $promotion): bool
    {
        return $user->can('promotions.view');
    }

    public function create(User $user): bool
    {
        return $user->can('promotions.create');
    }

    public function update(User $user, Promotion $promotion): bool
    {
        return $user->can('promotions.edit');
    }

    public function delete(User $user, Promotion $promotion): bool
    {
        return $user->can('promotions.delete');
    }
}
