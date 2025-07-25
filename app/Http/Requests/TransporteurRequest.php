<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransporteurRequest extends FormRequest
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
            'conducteur_name' => ['required', 'string', 'max:255'],
            'vehicule_matricule' => ['required', 'string', 'max:20', 'unique:transporteurs,vehicule_matricule,' . $this->transporteur?->id],
            'conducteur_cin' => ['required', 'string', 'max:20', 'unique:transporteurs,conducteur_cin,' . $this->transporteur?->id],
            'conducteur_telephone' => ['required', 'string', 'max:20'],
            'vehicule_type' => ['required', 'string', 'max:100'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'conducteur_name.required' => 'Le nom du conducteur est requis.',
            'conducteur_name.string' => 'Le nom du conducteur doit être une chaîne de caractères.',
            'conducteur_name.max' => 'Le nom du conducteur ne peut pas dépasser 255 caractères.',

            'vehicule_matricule.required' => 'La matricule du véhicule est requise.',
            'vehicule_matricule.string' => 'La matricule du véhicule doit être une chaîne de caractères.',
            'vehicule_matricule.max' => 'La matricule du véhicule ne peut pas dépasser 20 caractères.',
            'vehicule_matricule.unique' => 'Cette matricule de véhicule est déjà utilisée.',

            'conducteur_cin.required' => 'Le CIN du conducteur est requis.',
            'conducteur_cin.string' => 'Le CIN du conducteur doit être une chaîne de caractères.',
            'conducteur_cin.max' => 'Le CIN du conducteur ne peut pas dépasser 20 caractères.',
            'conducteur_cin.unique' => 'Ce CIN de conducteur est déjà utilisé.',

            'conducteur_telephone.required' => 'Le téléphone du conducteur est requis.',
            'conducteur_telephone.string' => 'Le téléphone du conducteur doit être une chaîne de caractères.',
            'conducteur_telephone.max' => 'Le téléphone du conducteur ne peut pas dépasser 20 caractères.',

            'vehicule_type.required' => 'Le type de véhicule est requis.',
            'vehicule_type.string' => 'Le type de véhicule doit être une chaîne de caractères.',
            'vehicule_type.max' => 'Le type de véhicule ne peut pas dépasser 100 caractères.',
        ];
    }
}
