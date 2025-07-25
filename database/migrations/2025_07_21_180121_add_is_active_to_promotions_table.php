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
        if (!Schema::hasColumn('promotions', 'is_active')) {
            Schema::table('promotions', function (Blueprint $table) {
                $table->boolean('is_active')->default(1)->after('quantite_produit_offert');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('promotions', 'is_active')) {
            Schema::table('promotions', function (Blueprint $table) {
                $table->dropColumn('is_active');
            });
        }
    }
};
