<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoleRequest extends FormRequest
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
            "name" => [
                "required",
                "string",
                "min:3",  // Minimum 3 caractères
                "max:40",
                Rule::unique('roles')->ignore($this->route('role'))
            ],
            "permissions" => [
                "nullable",
                "array"
            ],
            "permissions.*" => [
                "string",
                "exists:permissions,name"
            ],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Le nom du rôle est obligatoire',
            'name.min' => 'Le nom doit contenir au moins 3 caractères',
            'name.max' => 'Le nom ne doit pas dépasser 40 caractères',
            'name.unique' => 'Ce rôle existe déjà',
            'permissions.array' => 'Les permissions doivent être un tableau',
            'permissions.*.exists' => 'Une ou plusieurs permissions sélectionnées n\'existent pas',
        ];
    }
}
