<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VilleRequest extends FormRequest
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
            "nameVille" => [
                "required",
                "string",
                "min:3",  // Minimum 3 caractères
                "max:40",
                Rule::unique('villes')->ignore($this->route('ville'))
            ],
        ];
    }

    public function messages()
    {
        return [
            'nameVille.required' => 'Le nom de la ville est obligatoire',
            'nameVille.min' => 'Le nom doit contenir au moins 3 caractères',
            'nameVille.max' => 'Le nom ne doit pas dépasser 40 caractères',
            'nameVille.unique' => 'Cette ville existe déjà',
        ];
    }
}
