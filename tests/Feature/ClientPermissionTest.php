<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Client;
use App\Models\User;
use App\Models\Ville;
use App\Models\Secteur;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class ClientPermissionTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Ville $ville;
    protected Secteur $secteur;
    protected Client $client;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->ville = Ville::factory()->create();
        $this->secteur = Secteur::factory()->create(['idVille' => $this->ville->id]);
        $this->client = Client::factory()->create([
            'ville_id' => $this->ville->id,
            'secteur_id' => $this->secteur->id,
        ]);
    }

    /** @test */
    public function user_without_permission_cannot_view_clients()
    {
        $this->actingAs($this->user)
            ->get('/clients')
            ->assertStatus(403);
    }

    /** @test */
    public function user_with_view_permission_can_view_clients()
    {
        $permission = Permission::create(['name' => 'clients.view']);
        $this->user->givePermissionTo($permission);

        $this->actingAs($this->user)
            ->get('/clients')
            ->assertStatus(200);
    }

    /** @test */
    public function user_without_create_permission_cannot_create_client()
    {
        $clientData = [
            'code' => 'CL999',
            'fullName' => 'Test Client',
            'ville_id' => $this->ville->id,
            'secteur_id' => $this->secteur->id,
        ];

        $this->actingAs($this->user)
            ->post('/clients', $clientData)
            ->assertStatus(403);
    }

    /** @test */
    public function user_with_create_permission_can_create_client()
    {
        $permission = Permission::create(['name' => 'clients.create']);
        $this->user->givePermissionTo($permission);

        $clientData = [
            'code' => 'CL999',
            'fullName' => 'Test Client',
            'ville_id' => $this->ville->id,
            'secteur_id' => $this->secteur->id,
        ];

        $this->actingAs($this->user)
            ->post('/clients', $clientData)
            ->assertRedirect('/clients');

        $this->assertDatabaseHas('clients', [
            'code' => 'CL999',
            'fullName' => 'Test Client',
        ]);
    }

    /** @test */
    public function user_without_edit_permission_cannot_update_client()
    {
        $updateData = [
            'code' => 'CL999',
            'fullName' => 'Updated Client',
            'ville_id' => $this->ville->id,
            'secteur_id' => $this->secteur->id,
        ];

        $this->actingAs($this->user)
            ->put("/clients/{$this->client->id}", $updateData)
            ->assertStatus(403);
    }

    /** @test */
    public function user_with_edit_permission_can_update_client()
    {
        $permission = Permission::create(['name' => 'clients.edit']);
        $this->user->givePermissionTo($permission);

        $updateData = [
            'code' => 'CL999',
            'fullName' => 'Updated Client',
            'ville_id' => $this->ville->id,
            'secteur_id' => $this->secteur->id,
        ];

        $this->actingAs($this->user)
            ->put("/clients/{$this->client->id}", $updateData)
            ->assertRedirect('/clients');

        $this->assertDatabaseHas('clients', [
            'id' => $this->client->id,
            'fullName' => 'Updated Client',
        ]);
    }

    /** @test */
    public function user_without_delete_permission_cannot_delete_client()
    {
        $this->actingAs($this->user)
            ->delete("/clients/{$this->client->id}")
            ->assertStatus(403);
    }

    /** @test */
    public function user_with_delete_permission_can_delete_client()
    {
        $permission = Permission::create(['name' => 'clients.delete']);
        $this->user->givePermissionTo($permission);

        $this->actingAs($this->user)
            ->delete("/clients/{$this->client->id}")
            ->assertRedirect('/clients');

        $this->assertDatabaseMissing('clients', [
            'id' => $this->client->id,
        ]);
    }
}
