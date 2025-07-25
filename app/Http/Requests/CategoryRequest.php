<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
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
            'category_name' => [
                'required',
                'string',
                'min:3',
                'max:50',
                Rule::unique('categories')->ignore($this->route('category'))
            ],
            'brand_id' => [
                'required',
                'integer',
                Rule::exists('brands', 'id')
            ]
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'category_name.required' => 'Le nom de la catégorie est obligatoire.',
            'category_name.min' => 'Le nom doit contenir au moins 3 caractères.',
            'category_name.max' => 'Le nom ne doit pas dépasser 50 caractères.',
            'category_name.unique' => 'Cette catégorie existe déjà.',
            'brand_id.required' => 'La marque est obligatoire.',
            'brand_id.integer' => 'L\'identifiant de la marque doit être un nombre entier.',
            'brand_id.exists' => 'La marque sélectionnée n\'existe pas.',
        ];
    }
}
