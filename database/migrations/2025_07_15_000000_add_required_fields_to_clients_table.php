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
        Schema::table('clients', function (Blueprint $table) {
            // Ajouter les nouveaux champs avec des valeurs par défaut temporaires
            $table->decimal('remise_special', 10, 2)->default(0)->after('idCommercial');
            $table->decimal('pourcentage', 5, 2)->default(0)->after('remise_special');
            $table->string('telephone', 20)->nullable()->after('pourcentage');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn(['remise_special', 'pourcentage', 'telephone']);
        });
    }
};
