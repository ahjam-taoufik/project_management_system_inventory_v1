<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sortie_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sortie_id')->constrained('sorties')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('ref_produit');
            $table->decimal('prix_vente_produit', 10, 2);
            $table->integer('quantite_produit');
            $table->decimal('total_ligne', 12, 2);
            $table->timestamps();

            $table->index(['sortie_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sortie_products');
    }
};