<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\Models\Ville;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class VillePermissionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Créer les permissions nécessaires
        Permission::create(['name' => 'villes.view']);
        Permission::create(['name' => 'villes.create']);
        Permission::create(['name' => 'villes.edit']);
        Permission::create(['name' => 'villes.delete']);
    }

    public function test_user_can_view_villes_with_permission(): void
    {
        $user = User::factory()->create();
        $user->givePermissionTo('villes.view');

        $response = $this->actingAs($user)->get(route('villes.index'));

        $response->assertStatus(200);
    }

    public function test_user_cannot_view_villes_without_permission(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('villes.index'));

        $response->assertStatus(403);
    }

    public function test_user_can_create_ville_with_permission(): void
    {
        $user = User::factory()->create();
        $user->givePermissionTo('villes.create');

        $villeData = ['nameVille' => 'Test Ville'];

        $response = $this->actingAs($user)->post(route('villes.store'), $villeData);

        $response->assertRedirect(route('villes.index'));
        $this->assertDatabaseHas('villes', $villeData);
    }

    public function test_user_cannot_create_ville_without_permission(): void
    {
        $user = User::factory()->create();

        $villeData = ['nameVille' => 'Test Ville'];

        $response = $this->actingAs($user)->post(route('villes.store'), $villeData);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('villes', $villeData);
    }

    public function test_user_can_update_ville_with_permission(): void
    {
        $user = User::factory()->create();
        $user->givePermissionTo('villes.edit');

        $ville = Ville::create(['nameVille' => 'Ville Originale']);
        $updatedData = ['nameVille' => 'Ville Modifiée'];

        $response = $this->actingAs($user)->put(route('villes.update', $ville), $updatedData);

        $response->assertRedirect(route('villes.index'));
        $this->assertDatabaseHas('villes', $updatedData);
    }

    public function test_user_cannot_update_ville_without_permission(): void
    {
        $user = User::factory()->create();

        $ville = Ville::create(['nameVille' => 'Ville Originale']);
        $updatedData = ['nameVille' => 'Ville Modifiée'];

        $response = $this->actingAs($user)->put(route('villes.update', $ville), $updatedData);

        $response->assertStatus(403);
        $this->assertDatabaseHas('villes', ['nameVille' => 'Ville Originale']);
    }

    public function test_user_can_delete_ville_with_permission(): void
    {
        $user = User::factory()->create();
        $user->givePermissionTo('villes.delete');

        $ville = Ville::create(['nameVille' => 'Ville à Supprimer']);

        $response = $this->actingAs($user)->delete(route('villes.destroy', $ville));

        $response->assertRedirect(route('villes.index'));
        $this->assertDatabaseMissing('villes', ['id' => $ville->id]);
    }

    public function test_user_cannot_delete_ville_without_permission(): void
    {
        $user = User::factory()->create();

        $ville = Ville::create(['nameVille' => 'Ville à Conserver']);

        $response = $this->actingAs($user)->delete(route('villes.destroy', $ville));

        $response->assertStatus(403);
        $this->assertDatabaseHas('villes', ['id' => $ville->id]);
    }

    public function test_user_must_be_authenticated_to_access_villes(): void
    {
        $response = $this->get(route('villes.index'));

        $response->assertRedirect(route('login'));
    }
}
