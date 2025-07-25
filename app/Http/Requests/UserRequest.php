<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
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
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');

        return [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:255',
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($this->route('user'))
            ],
            'password' => [
                $isUpdate ? 'nullable' : 'required',
                'string',
                Password::min(8)
                    // ->letters()
                    // ->mixedCase()
                    // ->numbers()
                    // ->symbols()
                    ,
                'confirmed',
            ],
            'password_confirmation' => [
                $isUpdate ? 'nullable' : 'required',
                'string',
            ],
            'roles' => [
                'nullable',
                'array'
            ],
            'roles.*' => [
                'string',
                'exists:roles,name'
            ],
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est obligatoire',
            'name.min' => 'Le nom doit contenir au moins 2 caractères',
            'name.max' => 'Le nom ne doit pas dépasser 255 caractères',

            'email.required' => 'L\'email est obligatoire',
            'email.email' => 'L\'email doit être une adresse email valide',
            'email.max' => 'L\'email ne doit pas dépasser 255 caractères',
            'email.unique' => 'Cette adresse email est déjà utilisée',

            'password.required' => 'Le mot de passe est obligatoire',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas',

            'password_confirmation.required' => 'La confirmation du mot de passe est obligatoire',

            'roles.array' => 'Les rôles doivent être un tableau',
            'roles.*.exists' => 'Un ou plusieurs rôles sélectionnés n\'existent pas',
        ];
    }
}
