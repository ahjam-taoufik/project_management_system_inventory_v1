<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
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
        $rules = [
            'product_Ref' => [
                'required',
                'string',
                'min:3',
                'max:50',
                Rule::unique('products')->ignore($this->route('product'))
            ],
            'product_libelle' => [
                'required',
                'string',
                'min:3',
                'max:255',
                Rule::unique('products')->ignore($this->route('product'))
            ],
            'prix_achat_colis' => [
                'required',
                'numeric',
                'min:0',
                'max:99999999.99'
            ],
            'prix_achat_unite' => [
                'required',
                'numeric',
                'min:0',
                'max:99999999.99'
            ],
            'prix_vente_colis' => [
                'required',
                'numeric',
                'min:0',
                'max:99999999.99'
            ],
            'prix_vente_unite' => [
                'required',
                'numeric',
                'min:0',
                'max:99999999.99'
            ],
            'brand_id' => [
                'required',
                'integer',
                Rule::exists('brands', 'id')
            ],
            'category_id' => [
                'required',
                'integer',
                Rule::exists('categories', 'id')
            ],
            'product_Poids' => [
                'required',
                'numeric',
                'min:0',
                'max:99999.999'
            ],
            'nombre_unite_par_colis' => [
                'required',
                'integer',
                'min:1',
                'max:9999'
            ],
            'product_isActive' => [
                'required',
                'boolean'
            ],
            'observation' => [
                'nullable',
                'string',
                'max:1000'
            ]
        ];

        // Vérification si on essaie de désactiver un produit avec stock disponible
        $product = $this->route('product');
        if ($product && $this->input('product_isActive') === false && $product->product_isActive) {
            // On essaie de désactiver un produit qui était actif
            $rules['product_isActive'][] = function($attribute, $value, $fail) use ($product) {
                // Vérifier si le produit a un stock disponible non-nul (positif ou négatif)
                $stock = \App\Models\Stock::where('product_id', $product->id)->first();
                if ($stock && $stock->stock_disponible != 0) {
                    $message = $stock->stock_disponible > 0 
                        ? "Impossible de désactiver ce produit car il a un stock disponible de {$stock->stock_disponible}. Veuillez d'abord épuiser le stock."
                        : "Impossible de désactiver ce produit car il a un stock négatif de {$stock->stock_disponible}. Veuillez d'abord corriger les anomalies de stock.";
                    $fail($message);
                }
            };
        }

        return $rules;
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'product_Ref.required' => 'La référence produit est obligatoire.',
            'product_Ref.min' => 'La référence produit doit contenir au moins 3 caractères.',
            'product_Ref.max' => 'La référence produit doit contenir au plus 50 caractères.',
            'product_Ref.unique' => 'Cette référence produit existe déjà.',

            'product_libelle.required' => 'Le libellé du produit est obligatoire.',
            'product_libelle.min' => 'Le libellé du produit doit contenir au moins 3 caractères.',
            'product_libelle.max' => 'Le libellé du produit doit contenir au plus 255 caractères.',
            'product_libelle.unique' => 'Ce libellé de produit existe déjà.',

            'prix_achat_colis.required' => 'Le prix d\'achat colis est obligatoire.',
            'prix_achat_colis.numeric' => 'Le prix d\'achat colis doit être un nombre.',
            'prix_achat_colis.min' => 'Le prix d\'achat colis doit être positif.',
            'prix_achat_colis.max' => 'Le prix d\'achat colis est trop élevé.',

            'prix_achat_unite.required' => 'Le prix d\'achat unité est obligatoire.',
            'prix_achat_unite.numeric' => 'Le prix d\'achat unité doit être un nombre.',
            'prix_achat_unite.min' => 'Le prix d\'achat unité doit être positif.',
            'prix_achat_unite.max' => 'Le prix d\'achat unité est trop élevé.',

            'prix_vente_colis.required' => 'Le prix de vente colis est obligatoire.',
            'prix_vente_colis.numeric' => 'Le prix de vente colis doit être un nombre.',
            'prix_vente_colis.min' => 'Le prix de vente colis doit être positif.',
            'prix_vente_colis.max' => 'Le prix de vente colis est trop élevé.',

            'prix_vente_unite.required' => 'Le prix de vente unité est obligatoire.',
            'prix_vente_unite.numeric' => 'Le prix de vente unité doit être un nombre.',
            'prix_vente_unite.min' => 'Le prix de vente unité doit être positif.',
            'prix_vente_unite.max' => 'Le prix de vente unité est trop élevé.',

            'brand_id.required' => 'La marque est obligatoire.',
            'brand_id.integer' => 'L\'identifiant de la marque doit être un entier.',
            'brand_id.exists' => 'La marque sélectionnée n\'existe pas.',

            'category_id.required' => 'La catégorie est obligatoire.',
            'category_id.integer' => 'L\'identifiant de la catégorie doit être un entier.',
            'category_id.exists' => 'La catégorie sélectionnée n\'existe pas.',

            'product_Poids.required' => 'Le poids du produit est obligatoire.',
            'product_Poids.numeric' => 'Le poids du produit doit être un nombre.',
            'product_Poids.min' => 'Le poids du produit doit être positif.',
            'product_Poids.max' => 'Le poids du produit est trop élevé.',

            'nombre_unite_par_colis.required' => 'Le nombre d\'unités par colis est obligatoire.',
            'nombre_unite_par_colis.integer' => 'Le nombre d\'unités par colis doit être un entier.',
            'nombre_unite_par_colis.min' => 'Le nombre d\'unités par colis doit être au moins 1.',
            'nombre_unite_par_colis.max' => 'Le nombre d\'unités par colis doit être au plus 9999.',

            'product_isActive.required' => 'Le statut actif est obligatoire.',
            'product_isActive.boolean' => 'Le statut actif doit être vrai ou faux.',

            'observation.max' => 'L\'observation ne doit pas dépasser 1000 caractères.',
        ];
    }
}
