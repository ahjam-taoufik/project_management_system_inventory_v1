<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SortieRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $sortieId = $this->route('sortie') ? $this->route('sortie')->id : null;

        return [
            'numero_bl' => [
                'required',
                'string',
                'max:255',
                Rule::unique('sorties', 'numero_bl')->ignore($sortieId),
            ],
            'commercial_id' => 'required|exists:commerciaux,id',
            'client_id' => 'required|exists:clients,id',
            'date_bl' => 'required|date',
            'livreur' => 'required|string|max:255',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantite_produit' => 'required|integer|min:1',
            'products.*.prix_vente_produit' => 'required|numeric|min:0',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'numero_bl.required' => 'Le numéro de BL est obligatoire.',
            'numero_bl.unique' => 'Ce numéro de BL existe déjà.',
            'commercial_id.required' => 'Le commercial est obligatoire.',
            'commercial_id.exists' => 'Le commercial sélectionné n\'existe pas.',
            'client_id.required' => 'Le client est obligatoire.',
            'client_id.exists' => 'Le client sélectionné n\'existe pas.',
            'date_bl.required' => 'La date du BL est obligatoire.',
            'date_bl.date' => 'La date du BL doit être une date valide.',
            'livreur.required' => 'Le livreur est obligatoire.',
            'products.required' => 'Au moins un produit est obligatoire.',
            'products.min' => 'Au moins un produit est obligatoire.',
            'products.*.product_id.required' => 'Le produit est obligatoire.',
            'products.*.product_id.exists' => 'Le produit sélectionné n\'existe pas.',
            'products.*.quantite_produit.required' => 'La quantité est obligatoire.',
            'products.*.quantite_produit.min' => 'La quantité doit être au moins 1.',
            'products.*.prix_vente_produit.required' => 'Le prix de vente est obligatoire.',
            'products.*.prix_vente_produit.min' => 'Le prix de vente doit être positif.',
        ];
    }
}