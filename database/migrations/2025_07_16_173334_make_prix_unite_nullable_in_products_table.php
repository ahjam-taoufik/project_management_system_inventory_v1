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
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('prix_achat_unite', 10, 2)->nullable()->change();
            $table->decimal('prix_vente_unite', 10, 2)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('prix_achat_unite', 10, 2)->nullable(false)->change();
            $table->decimal('prix_vente_unite', 10, 2)->nullable(false)->change();
        });
    }
};
