<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\Models\Commercial;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class CommercialPermissionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Créer les permissions nécessaires
        Permission::create(['name' => 'commerciaux.view']);
        Permission::create(['name' => 'commerciaux.create']);
        Permission::create(['name' => 'commerciaux.edit']);
        Permission::create(['name' => 'commerciaux.delete']);
    }

    public function test_user_can_view_commerciaux_with_permission(): void
    {
        $user = User::factory()->create();
        $user->givePermissionTo('commerciaux.view');

        $response = $this->actingAs($user)->get(route('commerciaux.index'));

        $response->assertStatus(200);
    }

    public function test_user_cannot_view_commerciaux_without_permission(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('commerciaux.index'));

        $response->assertStatus(403);
    }

    public function test_user_can_create_commercial_with_permission(): void
    {
        $user = User::factory()->create();
        $user->givePermissionTo('commerciaux.create');

        $commercialData = [
            'commercial_code' => 'COM001',
            'commercial_fullName' => 'Test Commercial',
            'commercial_telephone' => '0661234567'
        ];

        $response = $this->actingAs($user)->post(route('commerciaux.store'), $commercialData);

        $response->assertRedirect(route('commerciaux.index'));
        $this->assertDatabaseHas('commerciaux', $commercialData);
    }

    public function test_user_cannot_create_commercial_without_permission(): void
    {
        $user = User::factory()->create();

        $commercialData = [
            'commercial_code' => 'COM001',
            'commercial_fullName' => 'Test Commercial',
            'commercial_telephone' => '0661234567'
        ];

        $response = $this->actingAs($user)->post(route('commerciaux.store'), $commercialData);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('commerciaux', $commercialData);
    }

    public function test_user_can_update_commercial_with_permission(): void
    {
        $user = User::factory()->create();
        $user->givePermissionTo('commerciaux.edit');

        $commercial = Commercial::create([
            'commercial_code' => 'COM001',
            'commercial_fullName' => 'Commercial Original',
            'commercial_telephone' => '0661234567'
        ]);

        $updatedData = [
            'commercial_code' => 'COM002',
            'commercial_fullName' => 'Commercial Modifié',
            'commercial_telephone' => '0677891234'
        ];

        $response = $this->actingAs($user)->put(route('commerciaux.update', $commercial), $updatedData);

        $response->assertRedirect(route('commerciaux.index'));
        $this->assertDatabaseHas('commerciaux', $updatedData);
    }

    public function test_user_cannot_update_commercial_without_permission(): void
    {
        $user = User::factory()->create();

        $commercial = Commercial::create([
            'commercial_code' => 'COM001',
            'commercial_fullName' => 'Commercial Original',
            'commercial_telephone' => '0661234567'
        ]);

        $updatedData = [
            'commercial_code' => 'COM002',
            'commercial_fullName' => 'Commercial Modifié',
            'commercial_telephone' => '0677891234'
        ];

        $response = $this->actingAs($user)->put(route('commerciaux.update', $commercial), $updatedData);

        $response->assertStatus(403);
        $this->assertDatabaseHas('commerciaux', [
            'commercial_code' => 'COM001',
            'commercial_fullName' => 'Commercial Original',
            'commercial_telephone' => '0661234567'
        ]);
    }

    public function test_user_can_delete_commercial_with_permission(): void
    {
        $user = User::factory()->create();
        $user->givePermissionTo('commerciaux.delete');

        $commercial = Commercial::create([
            'commercial_code' => 'COM001',
            'commercial_fullName' => 'Commercial à Supprimer',
            'commercial_telephone' => '0661234567'
        ]);

        $response = $this->actingAs($user)->delete(route('commerciaux.destroy', $commercial));

        $response->assertRedirect(route('commerciaux.index'));
        $this->assertDatabaseMissing('commerciaux', ['id' => $commercial->id]);
    }

    public function test_user_cannot_delete_commercial_without_permission(): void
    {
        $user = User::factory()->create();

        $commercial = Commercial::create([
            'commercial_code' => 'COM001',
            'commercial_fullName' => 'Commercial à Conserver',
            'commercial_telephone' => '0661234567'
        ]);

        $response = $this->actingAs($user)->delete(route('commerciaux.destroy', $commercial));

        $response->assertStatus(403);
        $this->assertDatabaseHas('commerciaux', ['id' => $commercial->id]);
    }

    public function test_user_must_be_authenticated_to_access_commerciaux(): void
    {
        $response = $this->get(route('commerciaux.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_commercial_validation_rules(): void
    {
        $user = User::factory()->create();
        $user->givePermissionTo('commerciaux.create');

        // Test avec un code trop court
        $response = $this->actingAs($user)->post(route('commerciaux.store'), [
            'commercial_code' => 'CO',
            'commercial_fullName' => 'Test Commercial',
            'commercial_telephone' => '0661234567'
        ]);

        $response->assertSessionHasErrors(['commercial_code']);

        // Test avec un numéro de téléphone invalide
        $response = $this->actingAs($user)->post(route('commerciaux.store'), [
            'commercial_code' => 'COM001',
            'commercial_fullName' => 'Test Commercial',
            'commercial_telephone' => '0561234567' // Commence par 05 au lieu de 06/07
        ]);

        $response->assertSessionHasErrors(['commercial_telephone']);

        // Test avec un nom trop court
        $response = $this->actingAs($user)->post(route('commerciaux.store'), [
            'commercial_code' => 'COM001',
            'commercial_fullName' => 'AB',
            'commercial_telephone' => '0661234567'
        ]);

        $response->assertSessionHasErrors(['commercial_fullName']);
    }

    public function test_commercial_code_must_be_unique(): void
    {
        $user = User::factory()->create();
        $user->givePermissionTo('commerciaux.create');

        // Créer un premier commercial
        Commercial::create([
            'commercial_code' => 'COM001',
            'commercial_fullName' => 'Premier Commercial',
            'commercial_telephone' => '0661234567'
        ]);

        // Essayer de créer un second commercial avec le même code
        $response = $this->actingAs($user)->post(route('commerciaux.store'), [
            'commercial_code' => 'COM001',
            'commercial_fullName' => 'Second Commercial',
            'commercial_telephone' => '0677891234'
        ]);

        $response->assertSessionHasErrors(['commercial_code']);
    }

    public function test_commercial_telephone_must_be_unique(): void
    {
        $user = User::factory()->create();
        $user->givePermissionTo('commerciaux.create');

        // Créer un premier commercial
        Commercial::create([
            'commercial_code' => 'COM001',
            'commercial_fullName' => 'Premier Commercial',
            'commercial_telephone' => '0661234567'
        ]);

        // Essayer de créer un second commercial avec le même téléphone
        $response = $this->actingAs($user)->post(route('commerciaux.store'), [
            'commercial_code' => 'COM002',
            'commercial_fullName' => 'Second Commercial',
            'commercial_telephone' => '0661234567'
        ]);

        $response->assertSessionHasErrors(['commercial_telephone']);
    }
}
