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
        Schema::create('entrers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('ref_produit');
            $table->decimal('prix_achat_produit', 10, 2)->nullable();
            $table->integer('quantite_produit');
            $table->string('numero_bl');
            $table->foreignId('transporteur_id')->constrained('transporteurs')->onDelete('cascade');
            $table->date('date_charge');
            $table->date('date_decharge')->nullable();
            $table->integer('manque')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entrers');
    }
};
