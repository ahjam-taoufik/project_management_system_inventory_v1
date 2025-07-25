<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('produit_promotionnel_id')->constrained('products')->onDelete('cascade');
            $table->integer('quantite_produit_promotionnel');
            $table->foreignId('produit_offert_id')->constrained('products')->onDelete('cascade');
            $table->integer('quantite_produit_offert');
            $table->boolean('is_active')->default(true); // Ajout : activation/désactivation de la promotion
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
