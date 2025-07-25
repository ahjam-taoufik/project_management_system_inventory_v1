<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update all null values to 1 (default value)
        DB::table('products')
            ->whereNull('nombre_unite_par_colis')
            ->update(['nombre_unite_par_colis' => 1]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Do nothing - we don't want to revert the values back to null
    }
};
