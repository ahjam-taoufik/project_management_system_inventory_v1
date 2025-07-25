<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->integer('quantite_totale_entree')->default(0);
            $table->integer('quantite_totale_sortie')->default(0);
            $table->integer('stock_disponible')->default(0);
            $table->integer('stock_minimum')->default(0);
            $table->integer('stock_maximum')->default(0);
            $table->decimal('valeur_stock', 12, 2)->default(0);
            $table->timestamp('derniere_entree')->nullable();
            $table->timestamp('derniere_sortie')->nullable();
            $table->timestamps();
            $table->unique('product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
