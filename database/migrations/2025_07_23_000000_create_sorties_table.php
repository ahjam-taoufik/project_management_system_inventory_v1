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
        Schema::create('sorties', function (Blueprint $table) {
            $table->id();
            $table->string('numero_bl')->unique();
            $table->foreignId('commercial_id')->constrained('commerciaux')->onDelete('cascade');
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->date('date_bl');
            $table->string('livreur');
            $table->decimal('total_bl', 12, 2)->default(0);
            $table->timestamps();

            $table->index(['numero_bl', 'date_bl']);
            $table->index(['commercial_id', 'client_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sorties');
    }
};