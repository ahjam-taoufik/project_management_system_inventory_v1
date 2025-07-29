<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Sortie;
use App\Models\SortieProduct;
use App\Models\Commercial;
use App\Models\Client;
use App\Models\Product;
use App\Models\Ville;
use App\Models\Secteur;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class SortieModuleTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Create permissions
        Permission::create(['name' => 'sorties.view']);
        Permission::create(['name' => 'sorties.create']);
        Permission::create(['name' => 'sorties.edit']);
        Permission::create(['name' => 'sorties.delete']);

        // Create super-admin role with all permissions
        $role = Role::create(['name' => 'super-admin']);
        $role->givePermissionTo(Permission::all());

        // Create user with super-admin role
        $this->user = User::factory()->create();
        $this->user->assignRole($role);
    }

    /** @test */
    public function user_can_view_sorties_index()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('sorties.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('mouvements/sortie/index'));
    }

    /** @test */
    public function user_can_create_sortie()
    {
        $this->actingAs($this->user);

        // Create required data
        $ville = Ville::factory()->create();
        $secteur = Secteur::factory()->create(['idVille' => $ville->id]);
        $commercial = Commercial::factory()->create();
        $client = Client::factory()->create([
            'idVille' => $ville->id,
            'idSecteur' => $secteur->id,
            'idCommercial' => $commercial->id,
        ]);
        $product = Product::factory()->create();

        $sortieData = [
            'numero_bl' => 'BL-TEST-001',
            'commercial_id' => $commercial->id,
            'client_id' => $client->id,
            'date_bl' => now()->format('Y-m-d'),
            'livreur' => 'Test Livreur',
            'products' => [
                [
                    'product_id' => $product->id,
                    'quantite_produit' => 5,
                    'prix_vente_produit' => 100.00,
                ]
            ]
        ];

        $response = $this->post(route('sorties.store'), $sortieData);

        $response->assertRedirect(route('sorties.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('sorties', [
            'numero_bl' => 'BL-TEST-001',
            'commercial_id' => $commercial->id,
            'client_id' => $client->id,
            'livreur' => 'Test Livreur',
        ]);

        $this->assertDatabaseHas('sortie_products', [
            'product_id' => $product->id,
            'quantite_produit' => 5,
            'prix_vente_produit' => 100.00,
            'total_ligne' => 500.00,
        ]);
    }

    /** @test */
    public function user_can_update_sortie()
    {
        $this->actingAs($this->user);

        $sortie = Sortie::factory()->create();

        $updateData = [
            'numero_bl' => 'BL-UPDATED-001',
            'commercial_id' => $sortie->commercial_id,
            'client_id' => $sortie->client_id,
            'date_bl' => now()->format('Y-m-d'),
            'livreur' => 'Updated Livreur',
        ];

        $response = $this->put(route('sorties.update', $sortie), $updateData);

        $response->assertRedirect(route('sorties.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('sorties', [
            'id' => $sortie->id,
            'numero_bl' => 'BL-UPDATED-001',
            'livreur' => 'Updated Livreur',
        ]);
    }

    /** @test */
    public function user_can_delete_sortie()
    {
        $this->actingAs($this->user);

        $sortie = Sortie::factory()->create();

        $response = $this->delete(route('sorties.destroy', $sortie));

        $response->assertRedirect(route('sorties.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseMissing('sorties', [
            'id' => $sortie->id,
        ]);
    }

    /** @test */
    public function unauthorized_user_cannot_access_sorties()
    {
        $userWithoutPermissions = User::factory()->create();

        $this->actingAs($userWithoutPermissions);

        $response = $this->get(route('sorties.index'));

        $response->assertStatus(403);
    }

    /** @test */
    public function sortie_calculates_total_automatically()
    {
        $sortie = Sortie::factory()->create();
        
        SortieProduct::factory()->create([
            'sortie_id' => $sortie->id,
            'quantite_produit' => 2,
            'prix_vente_produit' => 50.00,
            'total_ligne' => 100.00,
        ]);

        SortieProduct::factory()->create([
            'sortie_id' => $sortie->id,
            'quantite_produit' => 3,
            'prix_vente_produit' => 30.00,
            'total_ligne' => 90.00,
        ]);

        $sortie->refresh();

        $this->assertEquals(190.00, $sortie->total_bl);
    }
}