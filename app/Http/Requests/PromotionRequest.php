<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PromotionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'produit_promotionnel_id' => 'required|exists:products,id',
            'quantite_produit_promotionnel' => 'required|integer|min:1',
            'produit_offert_id' => 'required|exists:products,id',
            'quantite_produit_offert' => 'required|integer|min:1',
            'is_active' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'produit_promotionnel_id.required' => 'Le produit promotionnel est requis.',
            'produit_promotionnel_id.exists' => 'Le produit promotionnel sélectionné n\'existe pas.',
            'quantite_produit_promotionnel.required' => 'La quantité du produit promotionnel est requise.',
            'quantite_produit_promotionnel.integer' => 'La quantité du produit promotionnel doit être un nombre entier.',
            'quantite_produit_promotionnel.min' => 'La quantité du produit promotionnel doit être au moins 1.',
            'produit_offert_id.required' => 'Le produit offert est requis.',
            'produit_offert_id.exists' => 'Le produit offert sélectionné n\'existe pas.',

            'quantite_produit_offert.required' => 'La quantité du produit offert est requise.',
            'quantite_produit_offert.integer' => 'La quantité du produit offert doit être un nombre entier.',
            'quantite_produit_offert.min' => 'La quantité du produit offert doit être au moins 1.',
        ];
    }
}
