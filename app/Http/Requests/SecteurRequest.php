<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SecteurRequest extends FormRequest
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
        return [
            "nameSecteur" => [
                "required",
                "string",
                "min:3",  // Minimum 3 caractères
                "max:40",
                Rule::unique('secteurs')->ignore($this->route('secteur'))
            ],
            "idVille" => [
                "required",
                Rule::exists('villes', 'id')
            ]
        ];
    }

    public function messages()
    {
        return [
            "nameSecteur.required" => "Le nom du secteur est obligatoire.",
            "nameSecteur.min" => "Le nom doit contenir au moins 3 caractères.",
            "nameSecteur.max" => "Le nom doit contenir au plus 40 caractères.",
            "nameSecteur.unique" => "Ce secteur existe déjà.",
            "idVille.required" => "La ville est obligatoire.",
            "idVille.exists" => "La ville n'existe pas."

        ];
    }
}
