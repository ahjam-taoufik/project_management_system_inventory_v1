<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EntrerRequest extends FormRequest
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
            'numero_bl' => 'required|string|max:255',
            'transporteur_id' => 'required|exists:transporteurs,id',
            'date_charge' => 'required|date',
            'date_decharge' => 'nullable|date|after_or_equal:date_charge',
            'product_lines' => 'required|array|min:1',
            'product_lines.*.product_id' => 'required|exists:products,id',
            'product_lines.*.ref_produit' => 'required|string|max:255',
            'product_lines.*.prix_achat_produit' => 'nullable|numeric|min:0',
            'product_lines.*.total' => 'nullable|numeric|min:0',
            'product_lines.*.quantite_produit' => 'required|integer|min:1',
            'product_lines.*.manque' => 'nullable|integer|min:0',
        ];

        // Pour la création, vérifier que le numéro BL n'existe pas déjà
        if ($this->isMethod('POST')) {
            $rules['numero_bl'] .= '|unique:entrers,numero_bl';
        }

        // Pour la mise à jour, vérifier que le numéro BL n'existe pas déjà (sauf pour le BL actuel)
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $entrerId = $this->route('entrer');
            $originalNumeroBl = $this->input('original_numero_bl');
            $newNumeroBl = $this->input('numero_bl');

            // Si le numéro BL a changé, vérifier qu'il n'existe pas déjà
            if ($newNumeroBl !== $originalNumeroBl) {
                $rules['numero_bl'] .= '|unique:entrers,numero_bl';
            }
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'numero_bl.required' => 'Le numéro BL est requis.',
            'numero_bl.unique' => 'Ce numéro BL existe déjà.',
            'transporteur_id.required' => 'Le transporteur est requis.',
            'transporteur_id.exists' => 'Le transporteur sélectionné n\'existe pas.',
            'date_charge.required' => 'La date de charge est requise.',
            'date_charge.date' => 'La date de charge doit être une date valide.',
            'date_decharge.date' => 'La date de décharge doit être une date valide.',
            'date_decharge.after_or_equal' => 'La date de décharge doit être égale ou postérieure à la date de charge.',
            'product_lines.required' => 'Au moins un produit est requis.',
            'product_lines.array' => 'Les produits doivent être dans un tableau.',
            'product_lines.min' => 'Au moins un produit est requis.',
            'product_lines.*.product_id.required' => 'Le produit est requis.',
            'product_lines.*.product_id.exists' => 'Le produit sélectionné n\'existe pas.',
            'product_lines.*.ref_produit.required' => 'La référence du produit est requise.',
            'product_lines.*.prix_achat_produit.required' => 'Le prix d\'achat est requis.',
            'product_lines.*.prix_achat_produit.numeric' => 'Le prix d\'achat doit être un nombre.',
            'product_lines.*.prix_achat_produit.min' => 'Le prix d\'achat doit être positif.',
            'product_lines.*.quantite_produit.required' => 'La quantité est requise.',
            'product_lines.*.quantite_produit.integer' => 'La quantité doit être un nombre entier.',
            'product_lines.*.quantite_produit.min' => 'La quantité doit être supérieure à 0.',
            'product_lines.*.manque.integer' => 'Le manque doit être un nombre entier.',
            'product_lines.*.manque.min' => 'Le manque doit être positif ou nul.',
        ];
    }
}
