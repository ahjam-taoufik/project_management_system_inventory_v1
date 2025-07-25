<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ClientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->idCommercial === '') {
            $this->merge([
                'idCommercial' => null,
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "code" => [
                "required",
                "string",
                "min:3",
                "max:20",
                Rule::unique('clients')->ignore($this->route('client'))
            ],
            "fullName" => [
                "required",
                "string",
                "min:3",
                "max:100",
                Rule::unique('clients')->ignore($this->route('client'))
            ],
            "idVille" => [
                "required",
                Rule::exists('villes', 'id')
            ],
            "idSecteur" => [
                "required",
                Rule::exists('secteurs', 'id')
            ],
            "idCommercial" => [
                "required",
                Rule::exists('commerciaux', 'id')
            ],
            "remise_special" => [
                "required",
                "numeric",
                "min:0",
                "max:100"
            ],
            "pourcentage" => [
                "required",
                "numeric",
                "min:0",
                "max:100"
            ],
            "telephone" => [
                "nullable",
                "string",
                "min:10",
                "max:20"
            ]
        ];
    }

    public function messages(): array
    {
        return [
            "code.required" => "Le code est obligatoire.",
            "code.min" => "Le code doit contenir au moins 3 caractères.",
            "code.max" => "Le code doit contenir au plus 20 caractères.",
            "code.unique" => "Ce code existe déjà.",
            "fullName.required" => "Le nom complet est obligatoire.",
            "fullName.min" => "Le nom complet doit contenir au moins 3 caractères.",
            "fullName.max" => "Le nom complet doit contenir au plus 100 caractères.",
            "fullName.unique" => "Ce nom de client existe déjà.",
            "idVille.required" => "La ville est obligatoire.",
            "idVille.exists" => "La ville sélectionnée n'existe pas.",
            "idSecteur.required" => "Le secteur est obligatoire.",
            "idSecteur.exists" => "Le secteur sélectionné n'existe pas.",
            "idCommercial.exists" => "Le commercial sélectionné n'existe pas.",
            "remise_special.required" => "La remise spéciale est obligatoire.",
            "remise_special.numeric" => "La remise spéciale doit être un nombre.",
            "remise_special.min" => "La remise spéciale doit être positive.",
            "remise_special.max" => "La remise spéciale est trop élevée.",
            "pourcentage.required" => "Le pourcentage est obligatoire.",
            "pourcentage.numeric" => "Le pourcentage doit être un nombre.",
            "pourcentage.min" => "Le pourcentage doit être positif.",
            "pourcentage.max" => "Le pourcentage ne peut pas dépasser 100.",
            "telephone.string" => "Le téléphone doit être une chaîne de caractères.",
            "telephone.min" => "Le téléphone doit contenir au moins 10 caractères.",
            "telephone.max" => "Le téléphone doit contenir au plus 20 caractères."
        ];
    }
}
