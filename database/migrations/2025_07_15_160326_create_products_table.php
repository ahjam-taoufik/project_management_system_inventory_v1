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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_Ref')->unique();
            $table->string('product_libelle');
            $table->decimal('prix_achat_colis', 10, 2);
            $table->decimal('prix_achat_unite', 10, 2);
            $table->decimal('prix_vente_colis', 10, 2);
            $table->decimal('prix_vente_unite', 10, 2);
            $table->foreignId('brand_id')->constrained('brands')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->decimal('product_Poids', 8, 3); // poids en kg avec 3 décimales
            $table->boolean('product_isActive')->default(true);
            $table->text('observation')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
